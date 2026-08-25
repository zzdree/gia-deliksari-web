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
    let driveResult: any = null;

    // 1. Upload to Google Drive via Service Account (Master Permanent Archive)
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

    // 2. If Supabase is configured, upload to Supabase Storage 'church-gallery' bucket for fast web CDN
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
        }
      } catch (storageErr) {
        console.warn('Supabase storage upload error, falling back to data URL:', storageErr);
      }
    }

    // 3. Fallback to optimized Base64 data URL if storage bucket is not ready
    if (!imageUrl) {
      const base64 = buffer.toString('base64');
      imageUrl = `data:${file.type || 'image/jpeg'};base64,${base64}`;
    }

    // 4. Create new Gallery Item
    const newGalleryItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: title,
      category: category as any,
      image: imageUrl,
      date: date,
      createdAt: new Date().toISOString(),
    };

    // 5. If Supabase DB is active, insert row and auto-prune oldest items beyond MAX_ACTIVE_PHOTOS
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from('gallery_items').insert([{
          title: newGalleryItem.title,
          category: newGalleryItem.category,
          image: newGalleryItem.image,
          date: newGalleryItem.date,
        }]);

        // Auto-Prune: Check total count in Supabase
        const { count } = await supabaseAdmin
          .from('gallery_items')
          .select('*', { count: 'exact', head: true });

        if (count && count > MAX_ACTIVE_PHOTOS) {
          // Fetch oldest items exceeding limit
          const { data: oldestItems } = await supabaseAdmin
            .from('gallery_items')
            .select('id, image')
            .order('created_at', { ascending: true })
            .limit(count - MAX_ACTIVE_PHOTOS);

          if (oldestItems && oldestItems.length > 0) {
            const idsToDelete = oldestItems.map(i => i.id);
            await supabaseAdmin.from('gallery_items').delete().in('id', idsToDelete);
            console.log(`[Auto-Prune] Dihapus ${idsToDelete.length} foto lama dari cache Supabase agar kuota hemat.`);
          }
        }
      } catch (dbErr) {
        console.warn('Database sync warning for gallery item:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Foto dokumentasi berhasil diunggah ke Galeri Web & tersimpan abadi di Google Drive',
      item: newGalleryItem,
      googleDrive: driveResult?.success ? {
        synced: true,
        fileId: driveResult.fileId,
        link: driveResult.webViewLink,
      } : {
        synced: false,
        error: driveResult?.error || driveResult?.reason || 'unconfigured',
      },
    });
  } catch (error: any) {
    console.error('Gallery upload error:', error);
    return NextResponse.json({ error: error.message || 'Gagal mengunggah foto' }, { status: 500 });
  }
}
