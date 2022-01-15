import { verifyTokenAsync } from "../utils";
import { Response, NextFunction } from "express";
import { Express, IJwtData } from "../types";
require("dotenv").config();

export async function authMiddleware(
  req: Express.MyRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  let token = null;

  if (req.headers && req.headers.authorization) {
    if (typeof req.headers.authorization === "string") {
      token = req.headers.authorization.split(" ")[1].trim();
    }
  }

  if (!token) {
    return res.status(401).json({ error: "not authenticated" });
  }

  const decoded = await verifyTokenAsync(token);
  if (decoded instanceof Error) {
    return res.status(403).json({ error: decoded });
  } else {
    req.user = decoded as IJwtData;
    next();
  }
}
