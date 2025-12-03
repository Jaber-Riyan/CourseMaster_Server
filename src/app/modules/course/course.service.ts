import AppError from "../../errorHelpers/AppError";
import { IBatches, ICourse, ISyllabus } from "./course.interface";
import { Course } from "./course.model";
import httpStatus from "http-status-codes"

const createCourse = async (payload: Partial<ICourse>) => {
    const result = await Course.create(payload)

    return result
}

const updateCourse = async (courseId: string, payload: Partial<ICourse>) => {
    const course = await Course.findById(courseId)

    if (!course) {
        throw new AppError(httpStatus.BAD_REQUEST, "Course Not Found")
    }

    const newUpdateCurse = await Course.findByIdAndUpdate(courseId, payload, {
        new: true,
        runValidators: true
    })

    return newUpdateCurse
}

const addModule = async (courseId: string, payload: Partial<ISyllabus>) => {
    const course = await Course.findById(courseId)

    if (!course) {
        throw new AppError(httpStatus.BAD_REQUEST, "Course Not Found")
    }

    const moduleNumber = course.syllabus.length + 1

    const newModule: ISyllabus = {
        moduleNumber,
        title: payload.title ?? "",
        content: payload.content ?? [],
        quiz: payload.quiz ?? {
            questions: [],
        },
        assignment: payload.assignment ?? {
            requirement: "",
            message: "",
        }
    }

    course.syllabus.push(newModule)

    await course.save()

    return course
}

const addBatch = async (courseId: string, payload: Partial<IBatches>) => {
    const course = await Course.findById(courseId)

    if (!course) {
        throw new AppError(httpStatus.BAD_REQUEST, "Course Not Found")
    }

    // const newDate = new Date();
    // newDate.setDate(newDate.getDate() + 15);

    // // Get date components
    // let day = newDate.getDate();
    // let month = newDate.getMonth() + 1;
    // let year = newDate.getFullYear();
    if (!payload.name) {
        throw new AppError(httpStatus.BAD_REQUEST, "Batch name is required");
    }

    const exists = course.batches.some(
        (batch) => batch.name.toLowerCase() === payload.name?.toLowerCase()
    )

    if (exists) {
        throw new AppError(
            httpStatus.CONFLICT,
            `Batch "${payload.name}" already exists in this course`
        );
    }

    const newBatch: IBatches = {
        name: payload.name ?? "",
        startDate: payload.startDate ?? new Date()
    }

    course.batches.push(newBatch)

    await course.save()

    return course
}

export const CourseServices = {
    createCourse,
    updateCourse,
    addModule,
    addBatch
}