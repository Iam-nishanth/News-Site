'use server';

import { CLOUDINARY, MediaObject } from '../cloudinary';

export const handleUploadFile = async (formData: FormData): Promise<MediaObject> => {
    const file = formData.get('file') as File;
    const type = (formData.get('type') as string) || 'image';

    if (!file) {
        throw new Error('No file provided for upload.');
    }

    if (!CLOUDINARY.CLOUD_NAME || !CLOUDINARY.PRESET || !CLOUDINARY.API) {
        throw new Error(
            'Cloudinary environment variables (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET, NEXT_PUBLIC_CLOUDINARY_API) are not properly configured. Please check your .env file.'
        );
    }

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', CLOUDINARY.PRESET);

    try {
        const call = await fetch(`${CLOUDINARY.API}/${type}/upload`, { method: 'POST', body: cloudinaryFormData });
        const response = await call.json();

        if (!call.ok) {
            throw new Error(response.error?.message || 'Cloudinary upload failed');
        }

        return {
            secure_url: response.secure_url,
            width: response.width,
            height: response.height,
            url: response.url,
            asset_id: response.asset_id,
            format: response.format,
            public_id: response.public_id,
            version_id: response.version_id,
            name: response.original_filename || file.name, // Use file.name as fallback
            bytes: response.bytes
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return Promise.reject(error);
    }
};
