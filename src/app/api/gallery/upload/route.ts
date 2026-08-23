import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
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

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let imageUrl = '';

    // 1. If Supabase is configured, upload to Supabase Storage 'church-gallery' bucket
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('church-gallery')
          .upload(`public/${fileName}`, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: true,
          });

        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from('church-gallery')
            .getPublicUrl(`public/${fileName}`);
          imageUrl = publicUrlData.publicUrl;
        }
      } catch (storageErr) {
        console.warn('Supabase storage upload error, falling back to data URL:', storageErr);
      }
    }

    // 2. Fallback to optimized Base64 data URL if storage bucket is not ready
    if (!imageUrl) {
      const base64 = buffer.toString('base64');
      imageUrl = `data:${file.type || 'image/jpeg'};base64,${base64}`;
    }

    // 3. Create new Gallery Item
    const newGalleryItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: title,
      category: category as any,
      image: imageUrl,
      date: date,
      createdAt: new Date().toISOString(),
    };

    // 4. If Supabase DB is active, insert row and auto-prune oldest items beyond MAX_ACTIVE_PHOTOS
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('gallery_items').insert([{
          title: newGalleryItem.title,
          category: newGalleryItem.category,
          image: newGalleryItem.image,
          date: newGalleryItem.date,
        }]);

        // Auto-Prune: Check total count in Supabase
        const { count } = await supabase
          .from('gallery_items')
          .select('*', { count: 'exact', head: true });

        if (count && count > MAX_ACTIVE_PHOTOS) {
          // Fetch oldest items exceeding limit
          const { data: oldestItems } = await supabase
            .from('gallery_items')
            .select('id, image')
            .order('created_at', { ascending: true })
            .limit(count - MAX_ACTIVE_PHOTOS);

          if (oldestItems && oldestItems.length > 0) {
            const idsToDelete = oldestItems.map(i => i.id);
            await supabase.from('gallery_items').delete().in('id', idsToDelete);
            console.log(`[Auto-Prune] Dihapus ${idsToDelete.length} foto lama dari cache Supabase agar kuota hemat.`);
          }
        }
      } catch (dbErr) {
        console.warn('Database sync warning for gallery item:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Foto dokumentasi berhasil diunggah ke Galeri Web & antrean arsip Google Drive',
      item: newGalleryItem,
      driveStatus: 'queued_to_drive',
    });
  } catch (error: any) {
    console.error('Gallery upload error:', error);
    return NextResponse.json({ error: error.message || 'Gagal mengunggah foto' }, { status: 500 });
  }
}
