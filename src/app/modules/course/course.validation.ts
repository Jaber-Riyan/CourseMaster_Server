import { z } from "zod";

// Sub Schemas
const syllabusContentSchema = z.object({
  title: z.string().min(1, "Content title required"),
  videoUrl: z.string().url("Invalid video URL"),
  completed: z.boolean().optional().default(false),
});

const quizQuestionSchema = z.object({
  question: z.string().min(1, "Question required"),
  options: z.array(z.string().min(1, "Option cannot be empty")),
  correctAnswer: z.string().min(1, "Correct answer required"),
});

const quizSchema = z.object({
  questions: z.array(quizQuestionSchema),
});

const assignmentSchema = z.object({
  requirement: z.string().min(1),
  message: z.string().min(1),
});

const syllabusSchema = z.object({
  moduleNumber: z.number(),
  title: z.string().min(1),
  content: z.array(syllabusContentSchema),
  quiz: quizSchema.optional(),
  assignment: assignmentSchema.optional(),
});

const batchSchema = z.object({
  name: z.string().min(1),
  startDate: z.string().or(z.date()),
});

// CREATE Course Schema
export const createCourseSchema = z.object({
  title: z.string().min(1, "Course title required"),
  description: z.string().min(1).optional(),
  instructor: z.string().min(1),
  price: z.number().min(0, "Price must be a positive number"),

  thumbnail: z.string().url().optional(),
  courseBanner: z.string().url().optional(),

  category: z.array(z.string().min(1)),
  tags: z.array(z.string()).optional(),

  syllabus: z.array(syllabusSchema).optional(),
  batches: z.array(batchSchema).optional(),
});

// UPDATE Course Schema
export const updateCourseSchema = createCourseSchema.partial();

// ADD New Course Module 
export const addCourseModule = z.object({
  title: z.string().min(1),
  content: z.array(syllabusContentSchema),
  quiz: quizSchema.optional(),
  assignment: assignmentSchema.optional(),
}).partial()

// ADD New Course Batch
export const addCourseBatch = z.object({
  name: z.string().min(1),
  startDate: z.string().or(z.date()),
}).partial()
