"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomIntLimit = void 0;
function getRandomIntLimit(min, max) {
    let _min = Math.ceil(min);
    let _max = Math.floor(max);
    return Math.floor(Math.random() * (_max - _min) + _min);
}
exports.getRandomIntLimit = getRandomIntLimit;
//# sourceMappingURL=getRandomIntLimit.js.map