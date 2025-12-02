import type { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import type { IUser } from "./user.interface"
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service"

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createUser(req.body)

    sendResponse<IUser>(res, {
        statusCode: httpStatus.CREATED,
        message: "Account Create Successfully",
        success: true,
        data: result
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
        statusCode: 200,
        message: "Eito Kaj kore",
        success: true,
        data: null
    })
})

export const UserControllers = {
    createUser,
    getAllUsers
}