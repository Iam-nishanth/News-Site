import { app } from "@/config/firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";


export function cleanHtml(html: string): string {

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const elementsToClean = doc.querySelectorAll(".bn-inline-content");

    elementsToClean.forEach((element) => {
        element.classList.remove("bn-inline-content");
    });

    doc.querySelectorAll('[class=""]').forEach((element) => {
        element.removeAttribute("class");
    });

    const cleanedHtml = doc.body.innerHTML;

    return cleanedHtml;
}

export async function uploadFile(file: File) {
    const body = new FormData();
    body.append("file", file);

    const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: body,
    });
    return (await ret.json()).data.url.replace(
        "tmpfiles.org/",
        "tmpfiles.org/dl/"
    );
}

export async function uploadFileToFirebase(file: File, onProgress?: (progress: number) => void): Promise<string> {
    const storage = getStorage(app);
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, name);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) {
                    onProgress(progress);
                }
                switch (snapshot.state) {
                    case "paused":
                        break;
                    case "running":
                        break;
                }
            },
            (error) => {
                console.error("Upload failed:", error);
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
}




export const deleteFirebaseFile = async (url: string) => {
    const storage = getStorage(app);

    const fileRef = ref(storage, url)

    await deleteObject(fileRef).then(() => {
        return true
        // File deleted successfully
    }).catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error)
        return false
    });
}


