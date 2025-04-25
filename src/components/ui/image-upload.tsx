"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "./input";
import { Progress } from "./progress";
import { ScrollArea } from "./scroll-area";
import { toast } from "sonner";
import { uploadFileToFirebase } from "@/lib/editor"; // Adjust the import path as necessary
import { ImageIcon, UploadCloud, X } from "lucide-react";

interface FileUploadProgress {
  progress: number;
  File: File;
  source: { cancel: (reason?: string) => void };
}

export default function ImageUpload({
  onFileUpload,
}: {
  onFileUpload: (url: string) => void;
}) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);

  const removeFile = (fileToRemove: File) => {
    setFilesToUpload((prevUploadProgress) => {
      return prevUploadProgress.filter(
        (item) => item.File.name !== fileToRemove.name
      );
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Assuming only one file is accepted at a time
      const file = acceptedFiles[0];

      // Update the filesToUpload state to show the upload progress for the single file
      setFilesToUpload([
        {
          progress: 0,
          File: file,
          source: { cancel: () => {} }, // Provide a dummy source property
        },
      ]);

      try {
        // Upload the single file to Firebase
        const downloadURL = await uploadFileToFirebase(file, (progress) => {
          // Update the progress in the filesToUpload state
          setFilesToUpload((prevUploadProgress) => {
            return prevUploadProgress.map((item) => {
              if (item.File.name === file.name) {
                return {
                  ...item,
                  progress,
                };
              } else {
                return item;
              }
            });
          });
        });

        // On successful upload, update the uploadedFiles state and clear the filesToUpload state
        setUploadedFiles((prevUploadedFiles) => [...prevUploadedFiles, file]);
        setFilesToUpload([]);

        // Call the onFileUpload callback with the download URL
        onFileUpload(downloadURL);

        toast.success("Uploaded Successfully");
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Error Uploading Image", { position: "top-right" });
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/gif": [],
      "image/webp": [],
    },
  });

  return (
    <div className="flex w-full flex-col gap-5 py-5">
      <div>
        <label
          {...getRootProps()}
          className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-border border-dashed rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-950  transition-colors"
        >
          <div className=" text-center">
            <div className=" border p-2 rounded-md max-w-min mx-auto">
              <UploadCloud size={25} />
            </div>

            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Drag files</span>
            </p>
            <p className="text-xs text-gray-500">
              Click to upload files &#40;files should be under 5 MB &#41;
            </p>
          </div>
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/png, image/jpeg, image/gif, image/webp"
          type="file"
          className="hidden"
        />
      </div>

      {filesToUpload.length > 0 && (
        <div>
          <ScrollArea className="h-40">
            <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
              Files to upload
            </p>
            <div className="space-y-2 pr-3">
              {filesToUpload.map((fileUploadProgress) => {
                return (
                  <div
                    key={fileUploadProgress.File.lastModified}
                    className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2"
                  >
                    <div className="flex items-center flex-1 p-2">
                      <div className="text-white">
                        <ImageIcon size={40} className=" fill-ring" />
                      </div>

                      <div className="w-full ml-2 space-y-1">
                        <div className="text-sm flex justify-between">
                          <p className="text-muted-foreground ">
                            {fileUploadProgress.File.name.slice(0, 25)}
                          </p>
                          <span className="text-xs">
                            {fileUploadProgress.progress}%
                          </span>
                        </div>
                        <Progress
                          value={fileUploadProgress.progress}
                          color="bg-ring"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (fileUploadProgress.source)
                          fileUploadProgress.source.cancel("Upload cancelled");
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
          <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
            Uploaded File
          </p>
          <div className="space-y-2 pr-3">
            {uploadedFiles.map((file) => {
              return (
                <div
                  key={file.lastModified}
                  className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center flex-1 p-2">
                    <div className="text-white">
                      <ImageIcon size={40} className=" fill-ring" />
                    </div>
                    <div className="w-full ml-2 space-y-1">
                      <div className="text-sm flex justify-between">
                        <p className="text-muted-foreground ">
                          {file.name.slice(0, 25)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file)}
                    className="bg-red-500 text-white transition-all items-center justify-center px-2 flex lg:hidden sm:group-hover:flex "
                  >
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
