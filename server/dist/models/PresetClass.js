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
exports.PresetClass = void 0;
const typegoose_1 = require("@typegoose/typegoose");
class PresetClass {
}
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", String)
], PresetClass.prototype, "presetName", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "64" }),
    __metadata("design:type", String)
], PresetClass.prototype, "animVarCoeff", void 0);
exports.PresetClass = PresetClass;
//# sourceMappingURL=PresetClass.js.map