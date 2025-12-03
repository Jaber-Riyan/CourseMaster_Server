import { Schema, model } from "mongoose";
import { IAssignment, IBatches, ICourse, IQuiz, IQuizQuestions, ISyllabus, ISyllabusContent } from "./course.interface";

const syllabusContentSchema = new Schema<ISyllabusContent>(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false, versionKey: false }
);

const quizQuestionSchema = new Schema<IQuizQuestions>(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const quizSchema = new Schema<IQuiz>(
  {
    questions: [quizQuestionSchema],
  },
  { _id: false, versionKey: false }
);

const assignmentSchema = new Schema<IAssignment>(
  {
    requirement: { type: String, required: true },
    message: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const syllabusSchema = new Schema<ISyllabus>(
  {
    moduleNumber: { type: Number, required: true },
    title: { type: String, required: true },
    content: [syllabusContentSchema],
    quiz: quizSchema,
    assignment: assignmentSchema,
  },
  { _id: false, versionKey: false }
);

const batchSchema = new Schema<IBatches>(
  {
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
  },
  { _id: false, versionKey: false }
);

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    price: { type: Number, required: true },

    thumbnail: { type: String },
    courseBanner: { type: String },

    category: [{ type: String, required: true }],
    tags: [{ type: String }],

    syllabus: [syllabusSchema],
    batches: [batchSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Course = model<ICourse>("Course", courseSchema);
