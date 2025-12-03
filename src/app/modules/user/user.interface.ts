import type { Types } from "mongoose"

export enum Role {
    ADMIN = "admin",
    STUDENT = "student"
}

export interface IEnrolledCourses {
    courseId: Types.ObjectId,
    enrollmentId: Types.ObjectId
    batch: string
}

export interface IUserModule {
    moduleId: number,
    lessons:
    {
        lessonId: number,
        complete: boolean,
        completedAt?: Date | null
    }[]
    ,
    quiz: {
        attempted: boolean,
        score: number
    },
    assignment: {
        submitted: boolean,
        grade: number
    }
}

export interface IProgress {
    courseId: Types.ObjectId,
    batch: string,
    modules: IUserModule[]
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