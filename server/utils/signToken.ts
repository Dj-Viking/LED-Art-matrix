import jwt from "jsonwebtoken";
import { readEnv } from "./readEnv";
import {
  SignLoginRegisterMeTokenArgs,
  SignResetPasswordTokenArgs,
  AdminTokenArgs,
} from "../types";
readEnv();

const { SECRET, EXPIRATION } = process.env;

export function signToken(
  args:
    | SignLoginRegisterMeTokenArgs
    | SignResetPasswordTokenArgs
    | AdminTokenArgs
): string {
  const {
    username,
    _id,
    role,
    uuid: someUuid, //i think im aliasing here
    email,
  } = args as SignLoginRegisterMeTokenArgs;

  const { resetEmail, uuid, exp } = args as SignResetPasswordTokenArgs;

  const { adminUuid } = args as AdminTokenArgs;

  switch (true) {
    case Boolean(username && someUuid && email && _id && role): {
      return jwt.sign(
        {
          username,
          _id,
          role,
          uuid: someUuid,
          email,
        },
        SECRET as string,
        { expiresIn: EXPIRATION as string }
      );
    }
    case Boolean(uuid && exp && resetEmail): {
      return jwt.sign(
        {
          resetEmail,
          uuid,
        },
        SECRET as string,
        { expiresIn: exp }
      );
    }
    case Boolean(adminUuid): {
      return jwt.sign(
        {
          adminUuid,
          role: "admin",
        },
        SECRET as string,
        { expiresIn: "240000h" }
      );
    }
    case Boolean(
      username && email && _id && someUuid && typeof role === "undefined"
    ): {
      return jwt.sign(
        {
          someUuid,
          username,
          email,
          _id,
          role: void 0,
        },
        SECRET as string,
        { expiresIn: EXPIRATION }
      );
    }
    default:
      return `couldn't create a token from the input args in signToken, one of the properties in the args input object was possibly null or undefined`;
  }
}