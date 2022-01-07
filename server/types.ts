import jwt from "jsonwebtoken";
import { Request } from "express";

export type MyJwtData = IJwtData;
export interface IJwtData extends jwt.JwtPayload {
  _id: string;
  username: string;
  email: string;
  uuid?: string;
  adminUuid: string;
  role: "user" | "admin";
  resetEmail?: string;
  iat?: number;
  exp?: number;
}

export interface SignLoginRegisterMeTokenArgs {
  _id?: string;
  username: string;
  email: string;
  role?: string;
  uuid?: string;
}
export interface SignResetPasswordTokenArgs {
  resetEmail: string;
  uuid: string;
  exp: string;
}
export interface AdminTokenArgs {
  adminUuid: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT?: string;
      EXPIRED_TOKEN?: string;
      INVALID_SIGNATURE?: string;
      SECRET?: string;
      EXPIRATION?: string;
      RESET_EXPIRATION?: string;
      NODEMAILER_AUTH_EMAIL?: string;
      NODEMAILER_AUTH_PASS?: string;
      OTHER_NODEMAILER_AUTH_PASS?: string;
      SUPER_SECRET?: string;
      ENV_TXT?: string;
      TEST_ADMIN_ENDPOINT?: string;
    }
  }
}
//declaration merging with express request
export namespace Express {
  export type MyRequest = Request & {
    user?: MyJwtData | null;
  };
}

export interface MySendEmailOptions {
  mailTo: string;
  mailHtml: string;
  fromHeader?: string;
  subject?: string;
}