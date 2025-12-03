import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { CourseServices } from "./course.service";
import { Course } from "./course.model";

const createCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await CourseServices.createCourse(req.body)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Course Created Successfully",
        success: true,
        data: result
    })
})

const getSingleCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const courseId: string = req.params.courseId
    const result = await CourseServices.getSingleCourse(courseId)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Retrieved Course Successfully",
        success: true,
        data: result
    })
})

const getPublicCourses = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const result = await CourseServices.getPublicCourses(query as Record<string, string>)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Course Retrieved Successfully",
        success: true,
        data: result
    })
})

const updateCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const courseId: string = req.params.courseId
    const result = await CourseServices.updateCourse(courseId, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Course Updated Successfully",
        success: true,
        data: result
    })
})

const deleteCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.courseId
    const result = await Course.findByIdAndDelete(courseId)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Course Deleted Successfully",
        success: true,
        data: result
    })
})

const addModule = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const courseId: string = req.params.courseId
    const result = await CourseServices.addModule(courseId, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Course Module Added Successfully",
        success: true,
        data: result
    })
})

const addBatch = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const courseId: string = req.params.courseId
    const result = await CourseServices.addBatch(courseId, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Course Batch Added Successfully",
        success: true,
        data: result
    })
})

export const CourseControllers = {
    createCourse,
    updateCourse,
    addModule,
    addBatch,
    getSingleCourse,
    getPublicCourses,
    deleteCourse
}