import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { getDriveClient } from '@/lib/googleDrive';
import { readSessionFromCookie } from '@/lib/admin-session.legacy';

/**
 * GaleriSync Worker — sinkronisasi 1 arah dari Google Drive → Supabase.
 *
 * Tujuan: foto yang di-upload jemaat langsung via Google Drive (mis. admin
 * mindahin file dari HP), secara otomatis muncul sebagai etalase di web.
 *
 * Trigger: bisa dipanggil manual (POST /api/gallery/sync) atau via cron
 * (mis. Vercel Cron harian). Butuh admin session cookie OR secret key.
 */
export async function POST(req: NextRequest) {
  // Auth: cek session admin ATAU header x-sync-secret
  const syncSecret = process.env.GALLERY_SYNC_SECRET;
  const providedSecret = req.headers.get('x-sync-secret');
  const session = readSessionFromCookie(req);

  const isAuthed = (syncSecret && providedSecret === syncSecret) || session?.isAdmin === true;
  if (!isAuthed) {
    return NextResponse.json(
      { error: 'Akses ditolak. Butuh admin session atau sync secret.' },
      { status: 401 },
    );
  }

  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase admin belum dikonfigurasi. Sinkronisasi tidak bisa berjalan.' },
      { status: 503 },
    );
  }

  const folderId = process.env.GOOGLE_DRIVE_PUBLIC_FOLDER_ID;
  if (!folderId) {
    return NextResponse.json(
      { error: 'GOOGLE_DRIVE_PUBLIC_FOLDER_ID belum di-set di environment.' },
      { status: 503 },
    );
  }

  const client = getDriveClient();
  if (!client) {
    return NextResponse.json(
      { error: 'Google Drive OAuth belum dikonfigurasi. Jalankan `node scripts/drive-auth-setup.js` dulu.' },
      { status: 503 },
    );
  }

  const { drive } = client;

  let added = 0;
  let skipped = 0;
  const errors: string[] = [];

  try {
    // 1. List file gambar di folder Drive (exclude folder, trashed)
    const list = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'files(id, name, mimeType, webViewLink, createdTime, description)',
      orderBy: 'createdTime desc',
      pageSize: 100,
    });

    const driveFiles = list.data.files ?? [];
    if (driveFiles.length === 0) {
      return NextResponse.json({ success: true, added: 0, skipped: 0, message: 'Tidak ada foto di folder Drive.' });
    }

    // 2. Untuk tiap file, cek apakah sudah ada di DB (by drive_file_id)
    const { data: existing } = await supabaseAdmin
      .from('gallery_items')
      .select('drive_file_id')
      .not('drive_file_id', 'is', null);

    const existingIds = new Set((existing ?? []).map((r) => r.drive_file_id));

    for (const file of driveFiles) {
      if (!file.id || existingIds.has(file.id)) {
        skipped++;
        continue;
      }

      try {
        // 3. Dapatkan public URL via thumbnail link (Drive sudah auto-resize)
        //    Drive webViewLink tidak bisa dipakai langsung sebagai <img src> karena
        //    auth-protected. Pakai thumbnail endpoint Drive.
        //    Untuk etalase Supabase, kita pakai Supabase sebagai CDN proxy:
        //    ambil binary dari Drive, upload ke Supabase Storage.
        const dlRes = await drive.files.get(
          { fileId: file.id, alt: 'media' },
          { responseType: 'arraybuffer' },
        );
        const buffer = Buffer.from(dlRes.data as ArrayBuffer);

        const ext = (file.mimeType?.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
        const fileName = `synced_${file.id}_${Date.now()}.${ext}`;

        // Upload ke Supabase Storage (supaya ada CDN publik)
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('church-gallery')
          .upload(`public/${fileName}`, buffer, {
            contentType: file.mimeType || 'image/jpeg',
            upsert: false,
          });

        let imageUrl = '';
        let thumbUrl = '';
        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from('church-gallery')
            .getPublicUrl(`public/${fileName}`);
          imageUrl = publicUrlData.publicUrl;
          thumbUrl = `${imageUrl}?width=800&quality=70&format=webp`;
        } else {
          // Fallback: pakai Drive thumbnail (less performant tapi works)
          imageUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w2000`;
          thumbUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`;
        }

        // Parse deskripsi: "Judul: X | Kategori: Y | Diunggah oleh: Z | Tanggal: W"
        const desc = file.description || '';
        const titleMatch = desc.match(/Judul:\s*([^|]+)/);
        const categoryMatch = desc.match(/Kategori:\s*([^|]+)/);
        const uploaderMatch = desc.match(/Diunggah oleh:\s*([^|]+)/);
        const dateMatch = desc.match(/Tanggal:\s*([^|]+)/);

        const title = (titleMatch?.[1] || file.name || 'Dokumentasi Jemaat').trim();
        const categoryRaw = (categoryMatch?.[1] || 'umum').trim().toLowerCase();
        const validCategories = ['ibadah', 'worship', 'youth', 'komunitas', 'umum'];
        const category = validCategories.includes(categoryRaw) ? categoryRaw : 'umum';
        const uploaderName = (uploaderMatch?.[1] || 'Jemaat').trim();
        const date = (dateMatch?.[1] || new Date(file.createdTime || Date.now()).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })).trim();

        // 4. Insert row ke gallery_items
        const { error: insertErr } = await supabaseAdmin.from('gallery_items').insert([{
          title,
          category,
          image: imageUrl,
          thumb_url: thumbUrl,
          drive_file_id: file.id,
          drive_web_view_link: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
          uploader_name: uploaderName,
          is_published: true,
          date,
        }]);

        if (insertErr) {
          errors.push(`${file.name}: ${insertErr.message}`);
        } else {
          added++;
        }
      } catch (fileErr: any) {
        errors.push(`${file.name}: ${fileErr.message || 'unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      added,
      skipped,
      totalScanned: driveFiles.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err: any) {
    console.error('[gallery/sync] error:', err);
    return NextResponse.json(
      { error: 'Sinkronisasi gagal: ' + (err.message || 'unknown') },
      { status: 500 },
    );
  }
}
