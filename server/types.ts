import { Request } from "express";
import { DocumentType } from "@typegoose/typegoose";
import jwt from "jsonwebtoken";
import { UserClass } from "./models/User";
import * as typegoose from "@typegoose/typegoose";
import { Types } from "mongoose";

export type MyJwtData = IJwtData;
export interface IJwtData extends jwt.JwtPayload {
    _id: Types.ObjectId & string;
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
    _id: typegoose.mongoose.Types.ObjectId | string;
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
        files?: Record<
            string,
            {
                fieldName: string;
                originalFilename: string;
                path: string;
                headers: Record<string, string>;
                size: number;
                name: string;
                type: string;
            }
        >;
        _readableState?: {
            buffer: Buffer[];
        };
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

type Base64String = string;
export interface IGif {
    listOwner: string;
    listName: string;
    // TODO: soon to be base64 strings
    gifSrcs: Base64String[];
    _id: string;
}

export interface IAddPresetResponse {
    presets: IPreset[];
}
export interface IGetUserPresetResponse {
    presets: IPreset[];
}
export interface IGetUserDefaultPresetResponse {
    preset: IPreset;
}

export interface IUser {
    gifs: string[];
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
    _id: string;
    presetName: string;
    displayName: string;
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
    _id: string;
    displayName: string;
    defaultPreset: string;
    animVarCoeff: string;
}

export interface IUpdateUserPresetResponse {
    preset: IPreset;
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

export interface IDeletePresetResponse {
    message: string;
}
