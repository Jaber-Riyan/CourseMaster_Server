import { model, Schema, Types } from "mongoose";
import { IAssignment, IAssignmentSubmissions, IEnrollment, IQuiz, IQuizScores } from "./enrollment.interface";

const assignmentSchema = new Schema<IAssignment>(
    {
        moduleId: {
            type: Number,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
        mark: {
            type: Number,
            default: 0,
        },
        reviewed: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);

const quizSchema = new Schema<IQuiz>(
    {
        moduleId: {
            type: Number,
            required: true,
        },
        score: {
            type: Number,
            default: 0,
        },
    },
    { _id: false }
);

const assignmentSubmissionsSchema = new Schema<IAssignmentSubmissions>(
    {
        courseId: {
            type: Types.ObjectId,
            ref: "Course",
            required: true,
        },
        assignments: {
            type: [assignmentSchema],
            default: [],
        },
    },
    { _id: false }
);

const quizScoresSchema = new Schema<IQuizScores>(
    {
        courseId: {
            type: Types.ObjectId,
            ref: "Course",
            required: true,
        },
        quizzes: {
            type: [quizSchema],
            default: [],
        },
    },
    { _id: false }
);

const enrollmentSchema = new Schema<IEnrollment>(
    {
        studentId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },

        courseId: {
            type: Types.ObjectId,
            ref: "Course",
            required: true,
        },

        batch: {
            type: String,
            required: true
        },

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        transactionId: {
            type: String,
            required: true,
        },

        assignmentSubmissions: {
            type: [assignmentSubmissionsSchema],
            default: [],
        },

        quizScores: {
            type: [quizScoresSchema],
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Enrollment = model<IEnrollment>(
    "Enrollment",
    enrollmentSchema
);