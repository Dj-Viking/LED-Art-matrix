import { Blob } from "buffer";
export type BlobContentType = "image/webp";
export function base64ToBlob_Server(base64String: string, contentType: BlobContentType) {
    const byteCharacters = Buffer.from(base64String, "base64").toString();
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteArrays);
    return new Blob([byteArray], { type: contentType });
}
