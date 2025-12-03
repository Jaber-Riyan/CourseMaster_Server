import httpStatus from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse"
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { EnrollmentServices } from "./enrollment.service"

const makeEnroll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const result = await EnrollmentServices.makeEnroll(user, req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Retrieved Successfully",
        data: result
    })
})

export const EnrollmentControllers = {
    makeEnroll,
}