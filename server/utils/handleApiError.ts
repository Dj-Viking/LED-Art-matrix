import { IS_PROD } from "../constants";
import { Response } from "express";
export async function handleError(
    endpoint: string,
    error: Error,
    res: Response
): Promise<Response> {
    if (!IS_PROD) {
        console.error(error);
        return res.status(500).json({
            error: "an error occured with " + endpoint + " " + error.message + `\n ${error.stack}`,
        });
    } else {
        return res
            .status(500)
            .json({ error: "an error occurred with " + endpoint + " " + error.message });
    }
}