import { supabase } from '@/lib/supabase';

interface CreateAlbumArgs {
    name: string;
    description?: string;
    coverFile: File;
}

export async function createAlbum({ name, description, coverFile }: CreateAlbumArgs): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        const fileName = `${Date.now()}_${coverFile.name}`;
        const filePath = `covers/album_covers/${fileName}`;

        // 1. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('music-images')
            .upload(filePath, coverFile, {
                upsert: true,
                contentType: coverFile.type,
            });

        if (uploadError) {
            return { success: false, message: `Storage error: ${uploadError.message}` };
        }

        // 2. Insert into albums table
        const { error: insertError } = await supabase.from('albums').insert([
            {
                name,
                description,
                'cover-image': filePath,
            },
        ]);

        if (insertError) {
            return { success: false, message: `Database error: ${insertError.message}` };
        }

        return { success: true, message: 'Album created successfully' };
    } catch (err) {
        console.error('Unexpected error during album creation:', err);
        return { success: false, message: 'Unexpected internal error occurred' };
    }
}
