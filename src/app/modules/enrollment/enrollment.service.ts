import { JwtPayload } from "jsonwebtoken";
import { IEnrollment } from "./enrollment.interface";
import { Enrollment } from "./enrollment.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import { User } from "../user/user.model";
import { Types } from "mongoose";
import { createProgressFromSyllabus } from "./enrollment.utils";
import { Course } from "../course/course.model";
import { IProgress, IUserModule } from "../user/user.interface";

const makeEnroll = async (user: JwtPayload, payload: Partial<IEnrollment>) => {
    const session = await Enrollment.startSession()
    session.startTransaction()

    try {
        const exist = await Enrollment.findOne({ studentId: user.userId, courseId: payload.courseId, batch: payload.batch })

        if (exist) {
            throw new AppError(httpStatus.BAD_REQUEST, "You Already Enrolled In This Batch")
        }

        const student = await User.findById(user.userId)
        const course = await Course.findById(payload.courseId)
        const enrollmentPayload: IEnrollment = {
            courseId: new Types.ObjectId(payload.courseId),
            studentId: new Types.ObjectId(user.userId),
            transactionId: payload.transactionId ?? "",
            batch: payload.batch ?? ""
        }
        const enrollment = await Enrollment.create([enrollmentPayload], { session })

        // Student Model enrolledCourses Manipulation 
        if (!student) {
            throw new AppError(httpStatus.NOT_FOUND, "Student Not Found")
        }

        student?.enrolledCourses?.push({
            courseId: new Types.ObjectId(payload.courseId),
            batch: payload.batch ?? "",
            enrollmentId: new Types.ObjectId(enrollment[0]._id)
        })

        if (!course) {
            throw new AppError(httpStatus.NOT_FOUND, "Course Not Found")
        }

        // Student Model progress Manipulation 
        const modules: IUserModule[] = course?.syllabus.map((mod) => ({
            moduleId: mod.moduleNumber,
            lessons: mod.content.map((lesson, index) => ({
                lessonId: index + 1,
                complete: false,
                completedAt: null
            })),
            quiz: {
                attempted: false,
                score: 0
            },
            assignment: {
                submitted: false,
                grade: 0
            }
        }));

        const progress: IProgress = {
            courseId: new Types.ObjectId(payload.courseId),
            batch: payload.batch ?? "",
            modules,
            overallPercentage: 0
        }

        student.progress = [progress]

        await student.save({ session })

        // Transaction Commit and End the Session
        await session.commitTransaction() // Transaction
        session.endSession()

        return enrollment
    }
    catch (error) {
        await session.abortTransaction() // Rollback
        session.endSession()
        throw error
    }
}

export const EnrollmentServices = {
    makeEnroll
}