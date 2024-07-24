import { Department, Student, Teacher } from ".";
import { Exam } from "./Exam";
import { CourseStudent } from "./Student";

export type Course = {
    id?: string | number,
    courseNotification?: string,
    courseName?: string,
    courseCode?:string,
    courseImage?: string,
    courseSemester?:string,
    courseDescription?: string,
    courseTotalStudent?:string | number,
    courseCreatedDate?:string,
    lessons?: Lesson[],
    lecturer?:Teacher,
    department?: Department,
    filesOfCourses?: any[],
    courseStudents?: CourseStudent[],
    exams?: Exam[]
}
export type CourseSearch = {
        id: number;
        courseCode?: string;
        courseSemester?: string;
        courseCreatedDate?: string;
        index: string;
        courseName?: string;
        courseImage?: string;
        displayInfo?:string;
        courseTotalStudent?: number
}



export type Lesson = {
    id?:string,
    course?:Course,
    lesson_name: string,
    lesson_notification:string,
    lesson_content:string | null,
    lesson_file?: string | null,
    timeStart?:string,
    timeEnd?: string,
    filesOfLessons?: any[]
}

export type CourseByStudent = {
    courseId: string,
    courseName: string,
    courseImage: string,
    percent: number,
}