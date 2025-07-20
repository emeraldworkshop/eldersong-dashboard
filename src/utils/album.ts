import { supabase } from '@/lib/supabase';

export interface AlbumPayload {
    name: string;
    description?: string;
    coverFile?: File | null;
}

interface AlbumMutationResult {
    success: boolean;
    message: string;
    coverPath?: string;
}

export async function uploadCoverImage(
    coverFile: File
): Promise<{ success: boolean; path?: string; message?: string }> {
    const fileName = `${Date.now()}_${coverFile.name}`;
    const filePath = `covers/album_covers/${fileName}`;

    const { error } = await supabase.storage
        .from('music-images')
        .upload(filePath, coverFile, {
            upsert: true,
        });

    if (error) {
        return { success: false, message: `Storage error: ${error.message}` };
    }

    return { success: true, path: filePath };
}

export async function createAlbum({
    name,
    description,
    coverFile,
}: AlbumPayload): Promise<AlbumMutationResult> {
    if (!coverFile)
        return { success: false, message: 'Cover image is required.' };

    const upload = await uploadCoverImage(coverFile);
    if (!upload.success)
        return {
            success: false,
            message: upload.message || 'Error uploading cover image',
        };

    const { error } = await supabase.from('albums').insert({
        name,
        description,
        'cover-image': upload.path,
    });

    if (error) {
        return { success: false, message: `Database error: ${error.message}` };
    }

    return {
        success: true,
        message: 'Album created successfully!',
        coverPath: upload.path,
    };
}

export async function updateAlbum(
    id: number,
    payload: AlbumPayload
): Promise<AlbumMutationResult> {
    let updateData: any = {
        name: payload.name,
        description: payload.description,
    };

    // If a new cover file is provided, upload and update path
    if (payload.coverFile) {
        const upload = await uploadCoverImage(payload.coverFile);
        if (!upload.success)
            return {
                success: false,
                message: upload.message || 'Error uploading cover image',
            };
        updateData['cover-image'] = upload.path;
    }

    const { error } = await supabase
        .from('albums')
        .update(updateData)
        .eq('id', id);

    if (error) {
        return { success: false, message: `Update error: ${error.message}` };
    }

    return { success: true, message: 'Album updated successfully!' };
}
