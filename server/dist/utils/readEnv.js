"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readEnv = void 0;
function readEnv() {
    let entries = {};
    let env;
    if (typeof process.env.ENV_TXT !== "undefined") {
        env = process.env.ENV_TXT.split("\n");
        for (let i = 0; i < env.length; i++) {
            entries = Object.assign(Object.assign({}, entries), { [env[i].split("=")[0]]: env[i].split("=")[1].replace(/'/g, "") });
        }
        process.env = Object.assign(Object.assign({}, process.env), entries);
    }
}
exports.readEnv = readEnv;
//# sourceMappingURL=readEnv.js.map