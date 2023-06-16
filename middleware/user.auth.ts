import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: any = req.headers.token;
  const key = process.env.JWT_KEY ?? "quick_chat_key";
  try {
    const verify = jwt.verify(token, key);
    if (verify) {
      next();
    } else {
      res
        .status(401)
        .json({ verified: 0, message: "Unauthorized Access detect!" });
    }
  } catch (e) {
    res.status(401).json({ verified: 0, message: "Error!", error: e });
  }
};
