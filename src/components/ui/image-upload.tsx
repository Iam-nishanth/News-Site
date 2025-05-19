'use client';
import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from './input';
import { Progress } from './progress';
import { ScrollArea } from './scroll-area';
import { toast } from 'sonner';
import { uploadFileToFirebase } from '@/lib/editor'; // Adjust the import path as necessary
import { ImageIcon, UploadCloud, X } from 'lucide-react';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop, type PercentCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { uploadFileToServerAction } from '@/utils/actions/cloudinary';

interface FileUploadProgress {
    progress: number;
    File: File;
    source: { cancel: (reason?: string) => void };
}

interface FileWithPreview extends File {
    preview: string;
}

export default function ImageUpload({ onFileUpload }: { onFileUpload: (url: string) => void }) {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
    const [showCropDialog, setShowCropDialog] = useState(false);
    const [crop, setCrop] = useState<Crop>();
    const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');
    const imgRef = useRef<HTMLImageElement | null>(null);

    const removeFile = (fileToRemove: File) => {
        // Clear all states related to the file
        setUploadedFiles([]);
        setFilesToUpload([]);
        setSelectedFile(null);
        setCroppedImageUrl('');
        setShowCropDialog(false);

        // Revoke the object URL to prevent memory leaks
        if (selectedFile?.preview) {
            URL.revokeObjectURL(selectedFile.preview);
        }
    };

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, 600 / 400));
    }

    function onCropComplete(crop: PixelCrop) {
        if (imgRef.current && crop.width && crop.height) {
            const croppedImageUrl = getCroppedImg(imgRef.current, crop);
            setCroppedImageUrl(croppedImageUrl);
        }
    }

    function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = 600;
        canvas.height = 400;

        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.imageSmoothingEnabled = false;

            ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, 600, 400);
        }

        return canvas.toDataURL('image/png', 1.0);
    }

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            // If there's already an uploaded file, remove it first
            if (uploadedFiles.length > 0 || filesToUpload.length > 0) {
                removeFile(uploadedFiles[0] || filesToUpload[0].File);
            }

            const file = acceptedFiles[0];
            const fileWithPreview = Object.assign(file, {
                preview: URL.createObjectURL(file)
            });
            setSelectedFile(fileWithPreview);
            setShowCropDialog(true);
        },
        [uploadedFiles, filesToUpload]
    );

    const handleCropComplete = async () => {
        if (!croppedImageUrl) return;

        try {
            // Convert base64 to blob
            const response = await fetch(croppedImageUrl);
            const blob = await response.blob();
            const croppedFile = new File([blob], selectedFile?.name || 'cropped.png', {
                type: 'image/png'
            });

            // Update the filesToUpload state
            setFilesToUpload([
                {
                    progress: 0,
                    File: croppedFile,
                    source: { cancel: () => {} }
                }
            ]);

            // Upload the cropped file to Firebase
            // const downloadURL = await uploadFileToFirebase(croppedFile, (progress) => {
            //     setFilesToUpload((prevUploadProgress) => {
            //         return prevUploadProgress.map((item) => {
            //             if (item.File.name === croppedFile.name) {
            //                 return {
            //                     ...item,
            //                     progress
            //                 };
            //             } else {
            //                 return item;
            //             }
            //         });
            //     });
            // });

            const formData = new FormData();
            formData.append('file', croppedFile);
            formData.append('type', 'image'); // Or determine type dynamically if needed

            const { url } = await uploadFileToServerAction(formData);

            setUploadedFiles((prevUploadedFiles) => [...prevUploadedFiles, croppedFile]);
            setFilesToUpload([]);
            onFileUpload(url);
            setShowCropDialog(false);
            setSelectedFile(null);
            setCroppedImageUrl('');
            toast.success('Uploaded Successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Error Uploading Image', { position: 'top-right' });
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'image/png': [],
            'image/jpeg': [],
            'image/gif': [],
            'image/webp': []
        }
    });

    return (
        <div className="flex w-full flex-col gap-5 py-5">
            <div>
                <label
                    {...getRootProps()}
                    className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-border border-dashed rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-950 transition-colors"
                >
                    <div className="text-center">
                        <div className="border p-2 rounded-md max-w-min mx-auto">
                            <UploadCloud size={25} />
                        </div>

                        <p className="mt-2 text-sm text-gray-600">
                            <span className="font-semibold">Drag files</span>
                        </p>
                        <p className="text-xs text-gray-500">Click to upload files &#40;files should be under 5 MB &#41;</p>
                    </div>
                </label>

                <Input {...getInputProps()} id="dropzone-file" accept="image/png, image/jpeg, image/gif, image/webp" type="file" className="hidden" />
            </div>

            {showCropDialog && selectedFile && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
                        <h2 className="text-xl font-semibold mb-4">Crop Image</h2>
                        <div className="mb-4">
                            <ReactCrop
                                crop={crop}
                                onChange={(_: unknown, percentCrop: PercentCrop) => setCrop(percentCrop)}
                                onComplete={(c: PixelCrop) => onCropComplete(c)}
                                aspect={600 / 400}
                                className="w-full"
                            >
                                <img ref={imgRef} src={selectedFile.preview} alt="Crop me" onLoad={onImageLoad} className="max-h-[60vh]" />
                            </ReactCrop>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowCropDialog(false);
                                    removeFile(selectedFile);
                                }}
                                type="button"
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button onClick={handleCropComplete} type="button" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                Crop & Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {filesToUpload.length > 0 && (
                <div>
                    <ScrollArea className="h-40">
                        <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">Files to upload</p>
                        <div className="space-y-2 pr-3">
                            {filesToUpload.map((fileUploadProgress) => {
                                return (
                                    <div key={fileUploadProgress.File.lastModified} className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2">
                                        <div className="flex items-center flex-1 p-2">
                                            <div className="text-white">
                                                <ImageIcon size={40} className="fill-ring" />
                                            </div>

                                            <div className="w-full ml-2 space-y-1">
                                                <div className="text-sm flex justify-between">
                                                    <p className="text-muted-foreground">{fileUploadProgress.File.name.slice(0, 25)}</p>
                                                    <span className="text-xs">{fileUploadProgress.progress}%</span>
                                                </div>
                                                <Progress value={fileUploadProgress.progress} color="bg-ring" />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (fileUploadProgress.source) fileUploadProgress.source.cancel('Upload cancelled');
                                                removeFile(fileUploadProgress.File);
                                            }}
                                            className="bg-red-500 text-white transition-all items-center justify-center cursor-pointer px-2 hidden group-hover:flex"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>
            )}

            {uploadedFiles.length > 0 && (
                <div>
                    <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">Uploaded File</p>
                    <div className="space-y-2 pr-3">
                        {uploadedFiles.map((file) => {
                            return (
                                <div
                                    key={file.lastModified}
                                    className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2 hover:border-slate-300 transition-all"
                                >
                                    <div className="flex items-center flex-1 p-2">
                                        <div className="text-white">
                                            <ImageIcon size={40} className="fill-ring" />
                                        </div>
                                        <div className="w-full ml-2 space-y-1">
                                            <div className="text-sm flex justify-between">
                                                <p className="text-muted-foreground">{file.name.slice(0, 25)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFile(file)} className="bg-red-500 text-white transition-all items-center justify-center px-2 flex lg:hidden sm:group-hover:flex">
                                        <X size={20} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper function to center the crop
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 50,
                height: 50
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}
