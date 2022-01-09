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
exports.ProductClass = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const Category_1 = require("./Category");
let ProductClass = class ProductClass {
};
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], ProductClass.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], ProductClass.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], ProductClass.prototype, "image", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, min: 0.99 }),
    __metadata("design:type", Number)
], ProductClass.prototype, "price", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], ProductClass.prototype, "quantity", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Category_1.CategoryClass, required: true }),
    __metadata("design:type", Object)
], ProductClass.prototype, "category", void 0);
ProductClass = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: { collection: "products" }
    })
], ProductClass);
exports.ProductClass = ProductClass;
//# sourceMappingURL=Product.js.map