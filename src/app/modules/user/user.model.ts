import { model, Schema } from "mongoose";
import { Role, type IEnrolledCourses, type IProgress, type IUser } from "./user.interface";

const enrolledCoursesSchema = new Schema<IEnrolledCourses>(
    {
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        batch: { type: String, required: true }
    },
    { _id: false, timestamps: true, versionKey: false }
);

const progressSchema = new Schema<IProgress>({
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    batch: { type: String, required: true },
    modules: [
        {
            moduleId: { type: Number, required: true },
            lessons: [
                {
                    lessonId: { type: String },
                    complete: { type: Boolean, default: false },
                    completedAt: { type: Date }
                }
            ],

            quiz: {
                attempted: { type: Boolean, default: false },
                score: { type: Number, default: 0 },
            },

            assignment: {
                submitted: { type: Boolean, default: false },
                grade: { type: Number, default: 0 }
            }
        }
    ],
    overallPercentage: { type: Number, default: 0 }
}, {
    _id: false,
    versionKey: false
})

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.STUDENT },
    enrolledCourses: [enrolledCoursesSchema],
    progress: [progressSchema]
}, {
    timestamps: true,
    versionKey: false
})

export const User = model<IUser>("User", userSchema)