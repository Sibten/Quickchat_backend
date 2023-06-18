"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = void 0;
const joi_1 = __importDefault(require("joi"));
const validateEmail = (data) => {
    const emailSchema = joi_1.default.object({
        email: joi_1.default.string().regex(/^[A-Za-z0-9\-._]+@([A-Za-z0-9-]+\.)+[a-z]{2,}$/),
    });
    return emailSchema.validate(data);
};
exports.validateEmail = validateEmail;
