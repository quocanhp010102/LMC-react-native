import { User } from "./User"

export type CourseStudent = {
    id: string | number,
    courseStudent_notification: string,
    student: Student
    point?: string | number
}


export type Student = {
    id?: string | number,
    student_code?: string,
    student_email?: string,
    student_fullname?: string,
    student_birthday?:string,
    student_gender?:string,
    student_phone?: string,
    student_avatar?: string,
    user?: User
}