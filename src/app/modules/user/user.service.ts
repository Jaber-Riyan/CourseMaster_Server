import AppError from "../../errorHelpers/AppError";
import { hashPassword } from "../../utils/hashPassword";
import type { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist, try with another email!")
    }

    const hashedPassword = await hashPassword(password!)

    const user = await User.create({
        email,
        password: hashedPassword,
        ...rest
    })

    return user
}

export const UserServices = {
    createUser
}