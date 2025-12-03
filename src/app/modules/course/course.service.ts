import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { User } from "../user/user.model";
import { courseSearchableFields } from "./course.constant";
import { IBatches, ICourse, ISyllabus } from "./course.interface";
import { Course } from "./course.model";
import httpStatus from "http-status-codes"
import { IUser, IUserModule } from "../user/user.interface";

const createCourse = async (payload: Partial<ICourse>) => {
    const result = await Course.create(payload)

    return result
}

const getSingleCourse = async (courseId: string) => {
    const course = await Course.findById(courseId)

    if (!course) {
        throw new AppError(httpStatus.BAD_REQUEST, "Course Not Found")
    }

    return course
}

const getPublicCourses = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Course.find(), query)

    const users = queryBuilder
        .search(courseSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        queryBuilder.build(),
        queryBuilder.getMeta()
    ]);

    const availableCourses = await Course.aggregate([
        {
            $addFields: {
                upcomingBatches: {
                    $filter: {
                        input: "$batches",
                        as: "batch",
                        cond: {
                            $gt: ["$$batch.startDate", new Date()]
                        }
                    }
                }
            }
        },
        {
            $match: {
                "upcomingBatches.0": { $exists: true }
            }
        },
        // {
        //     $project: {
        //         title: 1,
        //         description: 1,
        //         upcomingBatches: {
        //             name: 1,
        //             startDate: 1
        //         }
        //     }
        // }
    ]);

    return {
        data,
        meta,
        availableCourses
    }
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
    const session = await Course.startSession()
    session.startTransaction()

    try {
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

        await course.save({ session })

        // Added New Module Where Users Bought This Course
        const users = await User.find({}).session(session);

        const usersInThisCourse = users.filter(user =>
            user.enrolledCourses?.some(c =>
                new Types.ObjectId(c.courseId).equals(courseId)
            )
        );

        const module: IUserModule = {
            moduleId: moduleNumber,
            lessons: payload.content?.map((lesson, index) => ({
                lessonId: index + 1,
                complete: false,
                completedAt: null
            })) ?? [],
            quiz: { attempted: false, score: 0 },
            assignment: { submitted: false, grade: 0 }
        };

        for (const user of usersInThisCourse) {
            const progress = user.progress?.find((p) =>
                new Types.ObjectId(p.courseId).equals(courseId)
            );

            if (!progress) {
                throw new AppError(httpStatus.NOT_FOUND, "Progress not found");
            }

            progress.modules.push(module);
            await user.save({ session });
        }

        // Transaction Commit and End the Session
        await session.commitTransaction() // Transaction
        session.endSession()

        return course
    } catch (error) {
        await session.abortTransaction() // Rollback
        session.endSession()
        throw error
    }
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
    addBatch,
    getSingleCourse,
    getPublicCourses
}