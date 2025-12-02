import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import type { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import { createUserTokens } from "../../utils/userTokes";
import { setAuthCookie } from "../../utils/setCookie";
import type { Response } from "express";

const credentialsLogin = async (payload: Partial<IUser>, res:Response) => {
    const { email, password } = payload

    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not Exist")
    }

    const isPasswordMatched = await bcrypt.compare(password!, isUserExist.password!)

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const userTokens = createUserTokens(isUserExist)

    const { password: pass, ...rest } = isUserExist.toObject()

    setAuthCookie(res, userTokens)

    return {
        userTokens,
        rest
    }
}
export const AuthServices = {
    credentialsLogin
}