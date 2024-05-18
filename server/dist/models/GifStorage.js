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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GifStorageClass = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const User_1 = require("./User");
let GifStorageClass = class GifStorageClass {
};
__decorate([
    (0, typegoose_1.prop)({ ref: () => User_1.UserClass }),
    __metadata("design:type", Object)
], GifStorageClass.prototype, "listOwner", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true, required: true }),
    __metadata("design:type", String)
], GifStorageClass.prototype, "listName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, allowMixed: typegoose_1.Severity.ALLOW, type: typegoose_1.mongoose.Schema.Types.Mixed }),
    __metadata("design:type", Array)
], GifStorageClass.prototype, "gifSrcs", void 0);
GifStorageClass = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: { collection: "gifStorage" },
    })
], GifStorageClass);
exports.GifStorageClass = GifStorageClass;
//# sourceMappingURL=GifStorage.js.map