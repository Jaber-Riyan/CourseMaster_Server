import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { hashPassword } from "../../utils/hashPassword";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import { Role, type IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import { sendEmail } from "../../utils/sendEmail";
import { envVars } from "../../config/env";

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

    await sendEmail({
        to: "jaberriyan357@gmail.com",
        subject: `Welcome To Course Master - ${user?.name}`,
        templateName: "registrationEmail",
        templateData: {
            name: user?.name,
            url:`${envVars.FRONTEND_PRODUCTION_URL}/${user.role}/dashboard`
        }
    })

    return user
}

const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find(), query);

    const users = queryBuilder
        .search(userSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        queryBuilder.build(),
        queryBuilder.getMeta()
    ]);

    return {
        data,
        meta
    }
}

const getMe = async (userId: string) => {
    let isUserExist = await User.findById(userId)

    // console.log(isUserExist)

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Not Found!")
    }

    isUserExist = await User.findById(userId).select("-password")

    return {
        data: isUserExist
    }
};

const getSingleUser = async (id: string) => {

    let isUserExist = await User.findById(id)

    // console.log(isUserExist)

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Not Found!")
    }
    isUserExist = await User.findById(id).select("-password");

    return {
        data: isUserExist
    }
};

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    if (decodedToken.role === Role.STUDENT) {
        if (userId != decodedToken.userId) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Your are Not Authorized")
        }
    }

    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    if (payload.role) {
        if (decodedToken.role === Role.STUDENT) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized for this action");
        }
    }

    if (payload.password) {
        if (decodedToken.role === Role.STUDENT) {
            throw new AppError(httpStatus.FORBIDDEN, "Change your password instead update password");
        }
    }

    if (payload.email) {
        if (decodedToken.role === Role.STUDENT) {
            throw new AppError(httpStatus.FORBIDDEN, "Change your password instead update password");
        }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}

export const UserServices = {
    createUser,
    getAllUsers,
    getMe,
    getSingleUser,
    updateUser
}