#!/usr/bin/env node
/**
 * Disaster-recovery mirror: Google Drive master → Backblaze B2 cold storage.
 *
 * Why: GIA Deliksari photos live in Google Drive. If the Drive account is
 * compromised, quota-limited, or accidentally deleted, the public-facing
 * gallery loses its master archive. This script copies new/changed files
 * to B2 (cheap cold storage, ~$0.005/GB/month) on a daily cadence.
 *
 * Trigger:
 *   - Manual:  node scripts/mirror-drive-to-b2.mjs
 *   - Scheduled: GitHub Actions (daily-backup.yml already runs at 03:00 WIB;
 *     add this script as a parallel step to mirror Drive alongside DB dump)
 *
 * Env vars required:
 *   B2_ACCOUNT_ID, B2_APPLICATION_KEY, B2_BUCKET_NAME
 *   GOOGLE_DRIVE_PUBLIC_FOLDER_ID (already set for production)
 *   Plus GOOGLE_OAUTH_CLIENT_ID/SECRET/REFRESH_TOKEN or SERVICE_ACCOUNT
 *
 * Cost note:
 *   B2 free tier: 10 GB storage + 1 GB/day egress (Class B transactions).
 *   At ~50 photos/month × 300 KB avg = ~180 MB/year, well within free tier
 *   for the first 5+ years of operation.
 */

import { readdir, stat } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import path from 'node:path';
import process from 'node:process';

// Lazy import so missing creds don't crash on require.
async function getS3Client() {
  const { S3Client } = await import('@aws-sdk/client-s3');
  return new S3Client({
    endpoint: `https://${process.env.B2_ACCOUNT_ID}.s3.backblazeb2.com`,
    region: 'us-west-004', // B2 treats any region as valid; ignored.
    credentials: {
      accessKeyId: process.env.B2_ACCOUNT_ID,
      secretAccessKey: process.env.B2_APPLICATION_KEY,
    },
  });
}

const REQUIRED = ['B2_ACCOUNT_ID', 'B2_APPLICATION_KEY', 'B2_BUCKET_NAME', 'GOOGLE_DRIVE_PUBLIC_FOLDER_ID'];
for (const key of REQUIRED) {
  if (!process.env[key]) {
    console.error(`[b2-mirror] FATAL: missing env ${key}`);
    console.error('Required: B2_ACCOUNT_ID, B2_APPLICATION_KEY, B2_BUCKET_NAME, GOOGLE_DRIVE_PUBLIC_FOLDER_ID');
    process.exit(1);
  }
}

const BUCKET = process.env.B2_BUCKET_NAME;
const DRIVE_FOLDER = process.env.GOOGLE_DRIVE_PUBLIC_FOLDER_ID;

async function getDriveClient() {
  const { getDriveClient } = await import('../src/lib/googleDrive.ts').catch(() => null) ?? {};
  return getDriveClient?.();
}

/**
 * Lists all files under the public gallery Drive folder.
 * Returns array of { id, name, mimeType, modifiedTime, size? }.
 */
async function listDriveFiles() {
  const { google } = await import('googleapis');
  const drive = await getDriveClient();
  if (!drive) throw new Error('Drive client not available — check GOOGLE_OAUTH_* env vars');

  const files = [];
  let pageToken = null;
  do {
    const res = await drive.files.list({
      q: `'${DRIVE_FOLDER}' in parents and trashed = false and mimeType contains 'image/'`,
      fields: 'nextPageToken, files(id, name, mimeType, modifiedTime, size)',
      pageSize: 200,
      pageToken,
    });
    files.push(...(res.data.files ?? []));
    pageToken = res.data.nextPageToken;
  } while (pageToken);
  return files;
}

async function uploadOne(s3, file) {
  const { GetObjectCommand, PutObjectCommand, HeadObjectCommand } = await import('@aws-sdk/client-s3');
  const key = `drive-mirror/${file.id}/${file.name}`;

  // Skip if already mirrored and not modified.
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    const b2Modified = head.LastModified;
    const driveModified = new Date(file.modifiedTime);
    if (b2Modified && b2Modified >= driveModified) {
      return { key, status: 'skipped' };
    }
  } catch {
    // Object doesn't exist yet — proceed to upload.
  }

  // Stream file from Drive to B2.
  const drive = await getDriveClient();
  const media = await drive.files.get(
    { fileId: file.id, alt: 'media' },
    { responseType: 'stream' },
  );

  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: media.data,
    ContentType: file.mimeType,
    Metadata: {
      'drive-file-id': file.id,
      'drive-modified': file.modifiedTime,
      'mirror-source': 'gia-deliksari-web',
    },
  });
  await s3.send(cmd);
  return { key, status: 'uploaded' };
}

async function main() {
  const startedAt = Date.now();
  console.log(`[b2-mirror] starting at ${new Date().toISOString()}`);

  const s3 = await getS3Client();
  const files = await listDriveFiles();
  console.log(`[b2-mirror] found ${files.length} image files in Drive folder`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  // Process in batches of 4 to keep B2 request rate predictable.
  const BATCH = 4;
  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH);
    const results = await Promise.allSettled(batch.map((f) => uploadOne(s3, f)));
    for (const r of results) {
      if (r.status === 'fulfilled') {
        if (r.value.status === 'uploaded') uploaded++;
        else skipped++;
      } else {
        failed++;
        console.error('[b2-mirror] failed:', r.reason?.message ?? r.reason);
      }
    }
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(
    `[b2-mirror] done in ${elapsed}s — ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`,
  );

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('[b2-mirror] fatal:', err);
  process.exit(1);
});