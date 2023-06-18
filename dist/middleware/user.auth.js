"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = (req, res, next) => {
    const token = req.headers.token;
    const key = process.env.JWT_KEY ?? "quick_chat_key";
    try {
        const verify = jsonwebtoken_1.default.verify(token, key);
        if (verify) {
            next();
        }
        else {
            res
                .status(401)
                .json({ verified: 0, message: "Unauthorized Access detect!" });
        }
    }
    catch (e) {
        res.status(401).json({ verified: 0, message: "Error!", error: e });
    }
};
exports.authenticateUser = authenticateUser;
