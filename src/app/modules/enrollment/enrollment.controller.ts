import httpStatus from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse"
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { EnrollmentServices } from "./enrollment.service"
import { JwtPayload } from "jsonwebtoken"

const makeEnroll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload
    const result = await EnrollmentServices.makeEnroll(user, req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Retrieved Successfully",
        data: result
    })
})

const enrollMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload
    const result = await EnrollmentServices.enrollMe(user)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Enrollment Retrieved Successfully",
        data: result
    })
})

const enrollProgress = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const enrollmentId = req.params.enrollmentId
    const result = await EnrollmentServices.enrollProgress(enrollmentId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Progress Retrieved Successfully",
        data: result
    })
})

const markProgress = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, moduleId, lessonId } = req.params
    const result = await EnrollmentServices.markProgress(courseId, Number(moduleId), Number(lessonId))

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Progress Update Successfully",
        data: result
    })
})

export const EnrollmentControllers = {
    makeEnroll,
    enrollMe,
    enrollProgress,
    markProgress
}