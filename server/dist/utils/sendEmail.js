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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const readEnv_1 = require("./readEnv");
(0, readEnv_1.readEnv)();
const { NODEMAILER_AUTH_EMAIL, OTHER_NODEMAILER_AUTH_PASS } = process.env;
function sendEmail(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const { mailTo, mailHtml, fromHeader, subject } = args;
        let transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: NODEMAILER_AUTH_EMAIL,
                pass: OTHER_NODEMAILER_AUTH_PASS,
            },
        });
        yield transporter.sendMail({
            from: `${fromHeader} <${NODEMAILER_AUTH_EMAIL}>`,
            to: mailTo,
            subject: subject,
            html: mailHtml,
        });
    });
}
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map