export interface ISyllabusContent {
    title: string
    videoUrl: string
    completed: boolean
}

export interface IQuizQuestions {
    question: string
    options: string[],
    correctAnswer: string
}

export interface IQuiz {
    questions: IQuizQuestions[]
}

export interface IAssignment {
    requirement: string
    message: string
}

export interface ISyllabus {
    moduleNumber: number
    title: string
    content: ISyllabusContent[]
    quiz: IQuiz
    assignment: IAssignment
}

export interface IBatches {
    name: string
    startDate: Date
}

export interface ICourse {
    title: string
    description: string
    instructor: string
    price: number
    thumbnail?: string
    courseBanner?: string
    category: string[]
    tags: string[]
    syllabus: ISyllabus[]
    batches: IBatches[]
}