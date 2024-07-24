import { Course } from "./Course"
import { Student } from "./Student"

export type Exam = {
    id?:string,
    examTotalStudentSubmitted:string,
    examTotalStudent:string | number,
    examStatus:string | number,
    examLimittedWorkingTime?: string | number;
    examPercentageSubmitted?: number | string
    examOpenTime: string,
    examName: string,
    examCloseTime: string,
    course?: Course
    typeOfExams?: {
        id: 1 | 2
    },
    questions: question[]
}

export type question = {
    id?: string | number,
    questionsName: string | null,
    questionsFile: string | null,
    questionsPoint:string | number,

}

export type ExamHistory = {
    id: string,
    courseId: number
    examsHistoryTeacherComment: string
    examsHistoryAnswer: string
    examsHistoryPoint: string | number
    examsHistorySubmissionTime: string;
    examsHistoryStatus: number;
    examsHistoryFileAnswer: string;
    questions: question[],
    examsId?: string,
    examsName:string,
    examsPoint: string
    examsDateSubmit:string
    exams?: Exam
    studentName?:string
    student: Student
    typeOfExams?: number
}