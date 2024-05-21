"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64ToBlob_Server = void 0;
const buffer_1 = require("buffer");
function base64ToBlob_Server(base64String, contentType) {
    const byteCharacters = Buffer.from(base64String, "base64").toString();
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
    }
    const byteArray = new Uint8Array(byteArrays);
    return new buffer_1.Blob([byteArray], { type: contentType });
}
exports.base64ToBlob_Server = base64ToBlob_Server;
//# sourceMappingURL=base64ToBlob.js.map