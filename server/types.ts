import { Request } from "express";
import { DocumentType, mongoose } from "@typegoose/typegoose";
import jwt from "jsonwebtoken";
import { UserClass } from "./models/User";

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
export interface IGif {
  gifCategory: string;
  gifSrc: string | URL;
  limit: string;
  _id: string;
}

export interface IAddPresetResponse {
  presets: IPreset[];
}
export interface IGetUserPresetResponse {
  presets: IPreset[];
}
export interface IGetUserDefaultPresetResponse {
  preset: string;
}

export interface IUser {
  username: string;
  email: string;
  token?: string;
  orders?: Array<IOrder>;
  preset?: Array<IPreset>;
  defaultPreset?: IPreset;
  userSearchTerm?: ISearchTerm;
  isCorrectPassword: (this: DocumentType<UserClass>, plainPass: string) => Promise<boolean>;
}
export interface ISearchTerm {
  termText?: string;
  termCategory?: string;
  limit?: string;
}
export interface IOrder {
  purchaseDate?: Date;
  products: Array<IProduct>;
}
export interface IProduct {
  name: string;
  description?: string;
  image?: string;
  price: number;
  quantity?: number;
  category: ICategory;
}
export interface ICategory {
  name: string;
}
export interface IGetGifsResponse {
  gifs: Array<IGif>;
}
export interface ICreateUserResponse {
  _id: string;
  token: string;
}

export interface IPreset {
  presetName: string;
  _id: mongoose.Types.ObjectId;
  animVarCoeff: string;
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
