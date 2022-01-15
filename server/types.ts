import { Request } from "express";
import jwt from "jsonwebtoken";

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
      readonly NODE_ENV: "development" | "production" | "test";
      readonly PORT?: string;
      readonly EXPIRED_TOKEN?: string;
      readonly INVALID_SIGNATURE?: string;
      readonly SECRET?: string;
      readonly EXPIRATION?: string;
      readonly RESET_EXPIRATION?: string;
      readonly NODEMAILER_AUTH_EMAIL?: string;
      readonly NODEMAILER_AUTH_PASS?: string;
      readonly OTHER_NODEMAILER_AUTH_PASS?: string;
      readonly SUPER_SECRET?: string;
      readonly ENV_TXT?: string;
      readonly TEST_ADMIN_ENDPOINT?: string;
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
export interface ICreateUserPayload {
  username?: string;
  password?: string;
  email?: string;
}

export interface ICreateUserResponse {
  _id: string;
  token: string;
}

export interface IPreset {
  presetName: string;
}

export interface ILoginPayload {
  usernameOrEmail: {
    username?: string | void;
    email?: string | void;
  };
  password: string;
}

export interface ILoginResponse {
  user: {
    username: string;
    email: string;
    password?: string;
    token: string;
    defaultPreset: IPreset;
  };
}

export interface IUpdateUserPresetPayload {
  defaultPreset: string;
}

export interface IUpdateUserPresetResponse {
  updated?: string | void;
}

export interface IInvalidSigError {
  error: {
    name: string;
    message: string;
  };
}
export interface IExpiredTokenError {
  error: {
    name: string;
    message: string;
  };
}

export interface IForgotPasswordResponse {
  message: string;
}
