"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_auth_1 = require("../middleware/user.auth");
const user_controller_1 = require("../controller/user.controller");
const user_controller_2 = require("../controller/user.controller");
exports.userRouter = express_1.default.Router();
exports.userRouter.post("/generateotp", user_controller_2.generateOTP);
exports.userRouter.post("/verify", user_controller_2.verifyOTP);
exports.userRouter.use(user_auth_1.authenticateUser);
exports.userRouter.get("/getmyprofile?", user_controller_2.getMyProfile);
exports.userRouter.get("/getalllist", user_controller_2.getUsers);
exports.userRouter.get("/myfriends", user_controller_1.getMyfriends);
