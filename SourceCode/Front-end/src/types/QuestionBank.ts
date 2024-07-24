import { Course } from "./Course"

export type QuestionBank = {
    id?: number
    questionName: string,
    questionType?: 1 | 0,
    course?: Course,
    answerBanks: Answer[]
}

export type Answer = {
    id?:number
    answerName: string
    answerStatus: 1 | 0
}