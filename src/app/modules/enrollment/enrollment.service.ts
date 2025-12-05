import { JwtPayload } from "jsonwebtoken";
import { IEnrollment } from "./enrollment.interface";
import { Enrollment } from "./enrollment.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import { User } from "../user/user.model";
import { Types } from "mongoose";
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

const enrollMe = async (user: JwtPayload) => {
    const enrollments = await Enrollment.find({ studentId: user.userId }).populate("studentId").populate("courseId")

    return enrollments
}

const enrollProgress = async (enrollmentId: string) => {
    const enrollment = await Enrollment.findById(enrollmentId)

    if (!enrollment) {
        throw new AppError(httpStatus.NOT_FOUND, "Enrollment Not Found")
    }

    const enrolledUser = await User.findById(enrollment?.studentId)

    if (!enrolledUser) {
        throw new AppError(httpStatus.NOT_FOUND, "Student Not Found")
    }

    const totalLessonsPerCourse = enrolledUser.progress?.map((progress) => {
        const lessonCount = progress.modules.reduce((moduleAcc, module) => {
            const totalLessons = module.lessons.filter(l => l.lessonId).length
            if (module.quiz) moduleAcc++
            if (module.assignment) moduleAcc++
            return moduleAcc + totalLessons
        }, 0)

        return {
            courseId: progress.courseId,
            batch: progress.batch,
            totalLessons: lessonCount
        }
    })


    const incompleteTotalLessonsPerCourse = enrolledUser.progress?.map((progress) => {

        const lessonCount = progress.modules.reduce((moduleAcc, module) => {
            const incompleteLessons = module.lessons.filter(l => !l.complete).length
            if (!module.quiz.attempted) moduleAcc++
            if (!module.assignment.submitted) moduleAcc++
            return moduleAcc + incompleteLessons
        }, 0)

        return {
            courseId: progress.courseId,
            batch: progress.batch,
            totalLessons: lessonCount,
        }
    })

    const completeTotalLessonsPerCourse = enrolledUser.progress?.map((progress) => {

        const lessonCount = progress.modules.reduce((moduleAcc, module) => {
            const completeLessons = module.lessons.filter(l => l.complete).length
            if (module.quiz.attempted) moduleAcc++
            if (module.assignment.submitted) moduleAcc++
            return moduleAcc + completeLessons
        }, 0)

        return {
            courseId: progress.courseId,
            batch: progress.batch,
            totalLessons: lessonCount
        }
    })

    const completedPercentagePerCourse = completeTotalLessonsPerCourse?.map((course, index) => {
        if (!totalLessonsPerCourse) {
            throw new AppError(httpStatus.NOT_FOUND, "Total Lessons Per Course Not Found");
        }

        if (course.courseId === totalLessonsPerCourse[index].courseId) {

            return {
                courseId: course.courseId,
                percentage:
                    Math.round((course.totalLessons / totalLessonsPerCourse[index].totalLessons) * 100),
                batch: course.batch,
            };
        }
    });

    if (!completedPercentagePerCourse) {
        throw new AppError(httpStatus.NOT_FOUND, "Completed Percentage Per Course Not Found");
    }

    for (const progress of enrolledUser.progress ?? []) {

        const match = completedPercentagePerCourse.find(
            (c: any) =>
                c.courseId.equals(progress.courseId) &&
                c.batch === progress.batch
        );

        if (match) {
            progress.overallPercentage = match.percentage;
        }
    }

    await enrolledUser.save();

    const totalPercentageProgress = enrolledUser.progress?.reduce((sum, p) => {
        return sum + (p.overallPercentage ?? 0);
    }, 0);

    if (!enrolledUser.progress) throw new AppError(httpStatus.NOT_FOUND, "Enrolled User Progress Not Found")

    const enrollmentProgress = Math.round(Number(totalPercentageProgress) && Number(totalPercentageProgress) / enrolledUser.progress?.length)

    enrollment.progress = enrollmentProgress ?? 0

    await enrollment.save()

    return {
        totalLessonsPerCourse,
        incompleteTotalLessonsPerCourse,
        completeTotalLessonsPerCourse,
        completedPercentagePerCourse,
        enrollmentProgress
    }
}

const markProgress = async (courseId: string, batch: string, moduleId: number, lessonId: number, enrollmentId: string, userInfo: JwtPayload) => {
    const user = await User.findById(userInfo.userId);

    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

    if (!user.progress || user.progress.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "User has no progress data");
    }

    const courseProgress = user.progress.find(
        (p) =>
            p.courseId.toString() === courseId.toString() &&
            p.batch === batch
    );

    if (!courseProgress) {
        throw new AppError(httpStatus.NOT_FOUND, "Course progress not found");
    }

    const moduleProgress = courseProgress.modules.find(
        (m) => m.moduleId === moduleId
    );

    if (!moduleProgress) {
        throw new AppError(httpStatus.NOT_FOUND, "Module not found");
    }

    const lessonProgress = moduleProgress.lessons.find(
        (l) => l.lessonId === lessonId
    );

    if (!lessonProgress) {
        throw new AppError(httpStatus.NOT_FOUND, "Lesson not found");
    }

    if (lessonProgress.complete && lessonProgress.completedAt) throw new AppError(httpStatus.CONFLICT, "Lesson Already Marked!!")

    lessonProgress.complete = true;
    lessonProgress.completedAt = new Date();

    await user.save();

    await enrollProgress(enrollmentId)

    return user.progress
}

const getEnrollments = async (courseId: string) => {
    return await Enrollment.find({ courseId: courseId }).populate("studentId").populate("courseId")
}

export const EnrollmentServices = {
    makeEnroll,
    enrollMe,
    enrollProgress,
    markProgress,
    getEnrollments
}