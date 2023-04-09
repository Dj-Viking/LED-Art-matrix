"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const constants_1 = require("../constants");
function handleError(endpoint, error, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (constants_1.IS_PROD) {
            console.error(error);
            return res.status(500).json({
                error: "an error occured with " + endpoint + " " + error.message + `\n ${error.stack}`,
            });
        }
        else {
            return res
                .status(500)
                .json({ error: "an error occurred with " + endpoint + " " + error.message });
        }
    });
}
exports.handleError = handleError;
//# sourceMappingURL=handleApiError.js.map