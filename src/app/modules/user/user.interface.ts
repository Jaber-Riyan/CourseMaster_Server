import type { Types } from "mongoose"

export enum Role {
    ADMIN = "admin",
    STUDENT = "student"
}

export interface IEnrolledCourses {
    courseId: Types.ObjectId,
    batch: string
}

export interface IProgress {
    courseId: Types.ObjectId,
    batch: string,
    modules:
    {
        moduleId: number,
        lessons: [
            {
                lessonId: string,
                complete: boolean,
                completedAt: Date
            }
        ],
        quiz: {
            attempted: boolean,
            score: number
        },
        assignment: {
            submitted: boolean,
            grade: number
        }
    }[]
    ,
    overallPercentage: number
}

export interface IUser {
    _id?: Types.ObjectId,
    name: string,
    email: string,
    role: Role,
    password: string,
    enrolledCourses?: IEnrolledCourses[],
    progress?: IProgress[]

}