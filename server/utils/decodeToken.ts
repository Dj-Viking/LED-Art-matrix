import jwt from "jsonwebtoken";
import { MyJwtData } from "../types";

/**
 * 
 * @param {{ token: string }} token 
 * @returns {{username?: string, email?: string, uuid?: string, resetEmail?: string, exp?: string }} decoded
 * @example 
 * export type MyJwtData = IJwtData;

export interface IJwtData extends jwt.JwtPayload {
    username: string;
    email: string;
    uuid?: string;
    resetEmail?: string;
    iat?: number;
    exp?: number;
}
 */
export function decodeToken(token: string): MyJwtData | null {
  const profile = jwt.decode(token);
  return profile as MyJwtData;
}
