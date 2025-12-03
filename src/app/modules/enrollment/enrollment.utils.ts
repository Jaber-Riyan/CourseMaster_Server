import { Types } from "mongoose";
import { ISyllabus } from "../course/course.interface";
import { IProgress } from "../user/user.interface";

export const createProgressFromSyllabus = (syllabus: ISyllabus[], courseId: Types.ObjectId, batch: string) => {
    const modules = syllabus.map((mod) => ({
        moduleId: mod.moduleNumber,
        lessons: mod.content.map((lesson, index) => ({
            lessonId: `${index}`,
            complete: false,
            completedAt: undefined
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

    const progress = {
        courseId,
        batch,
        modules,
        overallPercentage: 0
    };

    return progress;
};
