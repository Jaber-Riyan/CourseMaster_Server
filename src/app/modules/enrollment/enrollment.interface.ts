import { Types } from "mongoose";

export interface IAssignment {
    moduleId: number,
    answer: string,
    mark: number,
    reviewed: boolean
}

export interface IQuiz {
    moduleId: number
    score: number
}

export interface IAssignmentSubmissions {
    courseId: Types.ObjectId
    assignments: IAssignment[]
}

export interface IQuizScores {
    courseId: Types.ObjectId,
    quizzes: IQuiz[]
}

export interface IEnrollment {
    _id?: Types.ObjectId
    studentId: Types.ObjectId
    courseId: Types.ObjectId
    batch: string
    progress?: number
    transactionId: string
    assignmentSubmissions?: IAssignmentSubmissions[]
    quizScores?: IQuizScores[]
}