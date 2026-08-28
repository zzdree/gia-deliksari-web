import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { uploadToGoogleDrive } from '@/lib/googleDrive';
import { GalleryItem } from '@/types';

const MAX_ACTIVE_PHOTOS = 50; // Rolling buffer limit to keep CDN ultra-lean (<100MB)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string || 'Dokumentasi Jemaat GIA Deliksari';
    const category = (formData.get('category') as string) || 'ibadah';
    const date = formData.get('date') as string || new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const uploaderName = formData.get('uploaderName') as string || 'Jemaat';

    if (!file) {
      return NextResponse.json({ error: 'File gambar wajib diunggah' }, { status: 400 });
    }

    // Security Check 1: Max file size (10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Ukuran file melebihi batas maksimum 10MB' }, { status: 400 });
    }

    // Security Check 2: MIME type whitelist
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Format file tidak didukung. Harap unggah format JPG, PNG, WEBP, atau GIF.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Security Check 3: Magic Bytes Verification
    const isJpeg = buffer.length > 3 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    const isPng = buffer.length > 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    const isGif = buffer.length > 3 && buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;
    const isWebp = buffer.length > 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';

    if (!isJpeg && !isPng && !isGif && !isWebp) {
      return NextResponse.json({ error: 'Header file tidak valid untuk format gambar yang diizinkan.' }, { status: 400 });
    }

    const validExts: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
    const fileExt = validExts[file.type] || 'jpg';
    const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    let imageUrl = '';
    let thumbUrl = '';
    let driveResult: any = null;

    // 1. Upload to Google Drive (Master Permanent Archive di My Drive gereja)
    try {
      driveResult = await uploadToGoogleDrive({
        fileName: `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.${fileExt}`,
        mimeType: file.type || 'image/jpeg',
        buffer: buffer,
        description: `Judul: ${title} | Kategori: ${category} | Diunggah oleh: ${uploaderName} | Tanggal: ${date}`,
      });
    } catch (gdriveErr) {
      console.warn('Google Drive direct upload warning:', gdriveErr);
    }

    // 1b. Make uploaded file publicly readable via link (anyone with the link can view).
    // Jemaat can download from the webViewLink returned by the upload, but cannot list
    // or delete (service account is the only owner-role).
    if (driveResult && driveResult.success && driveResult.fileId) {
      try {
        const { getDriveClient } = await import('@/lib/googleDrive');
        const client = getDriveClient();
        if (client) {
          await client.drive.permissions.create({
            fileId: driveResult.fileId,
            requestBody: { role: 'reader', type: 'anyone' },
            fields: 'id',
            supportsAllDrives: true,
          });
        }
      } catch (permErr) {
        console.warn('Could not set public-read on uploaded Drive file:', permErr);
      }
    }

    // 2. Upload ke Supabase Storage 'church-gallery' untuk CDN publik (thumbnail kompres otomatis)
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      try {
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('church-gallery')
          .upload(`public/${fileName}`, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: true,
          });

        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from('church-gallery')
            .getPublicUrl(`public/${fileName}`);
          imageUrl = publicUrlData.publicUrl;
          // Generate thumbnail via Supabase Image Transform (800px, quality 70)
          // CDN Supabase akan auto-kompres on-the-fly + cache
          thumbUrl = `${imageUrl}?width=800&quality=70&format=webp`;
        }
      } catch (storageErr) {
        console.warn('Supabase storage upload error, falling back to data URL:', storageErr);
      }
    }

    // 3. Fallback ke optimized Base64 data URL jika storage bucket belum siap
    if (!imageUrl) {
      const base64 = buffer.toString('base64');
      imageUrl = `data:${file.type || 'image/jpeg'};base64,${base64}`;
      thumbUrl = imageUrl;
    }

    // 4. Create new Gallery Item dengan field Drive integration
    const newGalleryItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: title,
      category: category as any,
      image: imageUrl,
      thumbUrl: thumbUrl,
      driveFileId: driveResult?.success ? driveResult.fileId : undefined,
      driveWebViewLink: driveResult?.success ? driveResult.webViewLink : undefined,
      uploaderName: uploaderName,
      isPublished: true,
      date: date,
      createdAt: new Date().toISOString(),
    };

    // 5. Insert ke Supabase DB + Auto-Prune (rolling buffer MAX_ACTIVE_PHOTOS)
    let dbSynced = false;
    let dbError: string | null = null;
    let insertedId: string | null = null;
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      try {
        // Insert dengan kolom Drive integration lengkap
        const { data: insertedRow, error: insertErr } = await supabaseAdmin
          .from('gallery_items')
          .insert([
            {
              title: newGalleryItem.title,
              category: newGalleryItem.category,
              image: newGalleryItem.image,
              thumb_url: newGalleryItem.thumbUrl,
              drive_file_id: newGalleryItem.driveFileId,
              drive_web_view_link: newGalleryItem.driveWebViewLink,
              uploader_name: newGalleryItem.uploaderName,
              is_published: newGalleryItem.isPublished,
              date: newGalleryItem.date,
            },
          ])
          .select('id')
          .single();

        if (insertErr) {
          // Fallback: coba insert TANPA kolom Drive integration (untuk schema lama)
          // yang mungkin belum punya thumb_url / drive_file_id / dll.
          console.warn(
            '[gallery/upload] Insert pertama gagal, retry tanpa kolom opsional:',
            insertErr.message,
          );
          const { data: retryRow, error: retryErr } = await supabaseAdmin
            .from('gallery_items')
            .insert([
              {
                title: newGalleryItem.title,
                category: newGalleryItem.category,
                image: newGalleryItem.image,
                is_published: true,
                date: newGalleryItem.date,
              },
            ])
            .select('id')
            .single();

          if (retryErr) {
            dbError = retryErr.message;
            console.error('[gallery/upload] Insert retry juga gagal:', retryErr.message);
          } else {
            dbSynced = true;
            insertedId = retryRow?.id ?? null;
            console.log(
              '[gallery/upload] Berhasil insert via fallback (tanpa kolom opsional)',
            );
          }
        } else {
          dbSynced = true;
          insertedId = insertedRow?.id ?? null;
        }

        // Auto-Prune: jika melebihi MAX_ACTIVE_PHOTOS, hapus yang terlama dari SUPABASE CACHE saja.
        // File di Google Drive TIDAK dihapus — jemaat selalu bisa buka resolusi penuh via Drive.
        if (dbSynced) {
          const { count } = await supabaseAdmin
            .from('gallery_items')
            .select('*', { count: 'exact', head: true });

          if (count && count > MAX_ACTIVE_PHOTOS) {
            const { data: oldestItems } = await supabaseAdmin
              .from('gallery_items')
              .select('id, image, drive_file_id')
              .order('created_at', { ascending: true })
              .limit(count - MAX_ACTIVE_PHOTOS);

            if (oldestItems && oldestItems.length > 0) {
              const idsToDelete = oldestItems.map((i) => i.id);
              await supabaseAdmin
                .from('gallery_items')
                .delete()
                .in('id', idsToDelete);
              console.log(
                `[Auto-Prune] ${idsToDelete.length} foto lama dihapus dari cache Supabase. Arsip Drive tetap aman.`,
              );
            }
          }
        }
      } catch (dbErr: any) {
        dbError = dbErr?.message ?? String(dbErr);
        console.error('[gallery/upload] Database sync error:', dbErr);
      }
    }

    // Jika insert DB gagal sepenuhnya, kembalikan 500 agar client tahu row
    // tidak tersimpan. Drive upload tetap sukses (file ada di arsip).
    if (!dbSynced && dbError) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Upload berhasil ke Google Drive, tetapi gagal menyimpan metadata ke database. Foto tetap aman di Drive, namun tidak muncul di galeri publik.',
          googleDrive: driveResult?.success
            ? {
                synced: true,
                fileId: driveResult.fileId,
                link: driveResult.webViewLink,
              }
            : { synced: false },
          dbSynced: false,
          dbError,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Foto dokumentasi berhasil diunggah ke Galeri Web & tersimpan abadi di Google Drive',
      item: { ...newGalleryItem, id: insertedId ?? newGalleryItem.id },
      googleDrive: driveResult?.success
        ? {
            synced: true,
            fileId: driveResult.fileId,
            link: driveResult.webViewLink,
          }
        : {
            synced: false,
            error: driveResult?.error || driveResult?.reason || 'unconfigured',
          },
      dbSynced,
    });
  } catch (error: any) {
    console.error('Gallery upload error:', error);
    return NextResponse.json({ error: error.message || 'Gagal mengunggah foto' }, { status: 500 });
  }
}
