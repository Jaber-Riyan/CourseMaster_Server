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
    const { courseId, batch, moduleId, lessonId, enrollmentId } = req.params
    const user = req.user
    const result = await EnrollmentServices.markProgress(courseId, batch, Number(moduleId), Number(lessonId), enrollmentId, user)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Lesson Mark as Complete",
        data: result
    })
})

const getEnrollments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await EnrollmentServices.getEnrollments()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Enrollments Retrieved Successfully",
        data: result
    })
})

const submitAssignment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { enrollmentId, moduleId } = req.params
    const result = await EnrollmentServices.submitAssignment(enrollmentId, Number(moduleId))

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Assignment Submitted",
        data: result
    })
})

export const EnrollmentControllers = {
    makeEnroll,
    enrollMe,
    enrollProgress,
    markProgress,
    getEnrollments,
    submitAssignment
}