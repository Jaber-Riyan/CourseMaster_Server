import { Response } from "express";
import { envVars } from "../config/env";

export const clearCookie = (res: Response, tokenName: "accessToken" | "refreshToken") => {
    res.clearCookie(tokenName, {
        httpOnly: true,
        secure: envVars.NODE_ENV === "production" ? true : false,
        sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    })
}