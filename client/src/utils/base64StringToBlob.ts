export type BlobContentType = "image/webp";
export function base64ToBlob_Client(base64String: string, contentType: BlobContentType): Blob {
    const str = atob(base64String);
    const charArray = [];

    for (let i = 0; i < str.length; i++) {
        charArray.push(str.charCodeAt(i));
    }

    const byteArray = new Uint8Array(charArray);
    return new Blob([byteArray], { type: contentType });
}
