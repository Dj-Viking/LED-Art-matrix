import jwt from "jsonwebtoken";
import { MyJwtData } from "../types";
import { readEnv } from "../utils/readEnv";
readEnv();
const { EXPIRATION, SECRET } = process.env;

export async function verifyTokenAsync(token: string): Promise<MyJwtData | null | Error> {
    return new Promise((resolve) => {
        let returnMe: MyJwtData | null | any;
        jwt.verify(
            token as string,
            SECRET as string,
            { maxAge: EXPIRATION }, //maxage deprecated but still accepted...
            (error, decoded) => {
                if (!!error) returnMe = error;
                if (decoded) returnMe = decoded;
            }
        );
        resolve(returnMe);
    });
}
