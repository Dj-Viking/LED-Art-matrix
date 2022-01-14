// const { APP_DOMAIN_PREFIX } = require("../constants");

import { Response, NextFunction } from "express";
import { Express } from "../types";

export function accessControl(
  _req: Express.MyRequest,
  _res: Response,
  next: NextFunction
) {
  // turns out cors package is handling all this stuff...

  // res.setHeader("Access-Control-Allow-Origin", APP_DOMAIN_PREFIX);
  // res.header("Access-Control-Allow-Headers", ["Origin", "X-Requested-With", "Content-Type", "Accept"]);
  // res.header("Access-Control-Allow-Methods", ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]);
  return next();
}
