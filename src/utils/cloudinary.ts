export const CLOUDINARY = {
    PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET!,
    API: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}`,
    CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
};

export type MediaObject = {
    secure_url: string;
    url: string;
    height: number;
    width: number;
    asset_id: string;
    format: string;
    public_id: string;
    version_id: string;
    name: string;
    bytes: number;
};

export type ImageObject = MediaObject;
export type VideoObject = MediaObject;
