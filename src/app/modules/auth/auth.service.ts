import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import type { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload

    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not Exist")
    }

    const isPasswordMatched = await bcrypt.compare(password!, isUserExist.password!)

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    
}
export const AuthServices = {
    credentialsLogin
}