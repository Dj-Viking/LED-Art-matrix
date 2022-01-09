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
exports.OrderClass = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const Product_1 = require("./Product");
let OrderClass = class OrderClass {
};
__decorate([
    (0, typegoose_1.prop)({ default: Date.now() }),
    __metadata("design:type", Date)
], OrderClass.prototype, "purchaseDate", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Product_1.ProductClass }),
    __metadata("design:type", Array)
], OrderClass.prototype, "products", void 0);
OrderClass = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: { collection: "orders" }
    })
], OrderClass);
exports.OrderClass = OrderClass;
//# sourceMappingURL=Order.js.map