"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.UserClass = void 0;
require("dotenv").config();
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Order_1 = require("./Order");
const PresetClass_1 = require("./PresetClass");
const SearchTerm_1 = require("./SearchTerm");
const Gif_1 = require("./Gif");
let UserClass = class UserClass {
    isCorrectPassword(plainPass) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcryptjs_1.default.compare(plainPass, this.password);
        });
    }
};
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], UserClass.prototype, "username", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], UserClass.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], UserClass.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserClass.prototype, "token", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Order_1.OrderClass }),
    __metadata("design:type", Array)
], UserClass.prototype, "orders", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Gif_1.GifClass, default: [] }),
    __metadata("design:type", Array)
], UserClass.prototype, "gifs", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => PresetClass_1.PresetClass, default: [] }),
    __metadata("design:type", Array)
], UserClass.prototype, "presets", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", PresetClass_1.PresetClass)
], UserClass.prototype, "defaultPreset", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => SearchTerm_1.SearchTermClass }),
    __metadata("design:type", Object)
], UserClass.prototype, "userSearchTerm", void 0);
UserClass = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: { collection: "users" },
    }),
    (0, typegoose_1.pre)("save", function (next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isNew)
                this.password = yield bcryptjs_1.default.hash(this.password, Number(process.env.SALT));
            next();
        });
    }),
    (0, typegoose_1.plugin)(mongoose_unique_validator_1.default)
], UserClass);
exports.UserClass = UserClass;
//# sourceMappingURL=User.js.map