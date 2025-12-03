import { number, z } from "zod";

const ObjectIdSchema = z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId");

const assignmentSchema = z.object({
    moduleId: z.number(),
    answer: z.string(),
    mark: z.number(),
    reviewed: z.boolean()
});


const quizSchema = z.object({
    moduleId: z.number(),
    score: z.number()
});


const assignmentSubmissionSchema = z.object({
    courseId: ObjectIdSchema,
    assignments: z.array(assignmentSchema)
});


const quizScoreSchema = z.object({
    courseId: ObjectIdSchema,
    quizzes: z.array(quizSchema)
});

// Create Enrollment Schema
export const createEnrollmentSchema = z.object({
    studentId: ObjectIdSchema.optional(),
    courseId: ObjectIdSchema,
    batch: z.string(),
    progress: z.number().min(0).max(100).default(0),
    transactionId: z.string(),
    assignmentSubmissions: z.array(assignmentSubmissionSchema).optional(),
    quizScores: z.array(quizScoreSchema).optional()
})

// Update Enrollment Schema
export const updateEnrollmentSchema = createEnrollmentSchema.partial()
