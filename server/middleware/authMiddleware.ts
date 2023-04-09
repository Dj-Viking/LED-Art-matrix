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
            if (req.headers.authorization.trim() === "Bearer")
                return res.status(401).json({ error: "not authenticated" });
            token = req.headers.authorization.split(" ")[1].trim();
        }
    }

    const decoded = await verifyTokenAsync(token as string);
    if (decoded instanceof Error) {
        return res.status(403).json({ error: decoded });
    } else {
        req.user = decoded as IJwtData;
        next();
    }
}
