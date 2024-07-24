export type Course = {
  id?: string | number
  courseNotification?: string
  courseName?: string
  courseCode?: string
  courseImage?: string
  courseSemester?: string
  courseDescription?: string
  courseTotalStudent?: string | number
  courseCreatedDate?: string
  lessons?: Lesson[]
  lecturer?: any
  department?: Department
  filesOfCourses?: any[]
  courseStudents?: any[]
  exams?: any[]
  courseID?: string
}
export type CourseSearch = {
  id: number
  courseCode?: string
  courseSemester?: string
  courseCreatedDate?: string
  index: string
  courseName?: string
  courseImage?: string
  displayInfo?: string
  courseTotalStudent?: number
}

export type Lesson = {
  id?: string
  course?: Course
  lesson_name: string
  lesson_notification: string
  lesson_content: string | null
  lesson_file?: string | null
  timeStart?: string
  timeEnd?: string
  filesOfLessons?: any[]
}

export type CourseByStudent = {
  courseId: string
  courseName: string
  courseImage: string
  percent: number
}

export type Department = {
  id?: string | number
  department_name?: string
  department_type?: string
  department_image?: string
  courses?: Course[]
}

export type stateType = {
  id: number  
  department_image: string
  department_name: string
  department_type: string
  courses: []
  countCourse?: number
  countSubject?: number
}

export interface ISubject {
  id?: number
  subject_name: string
  subject_code?: string
  courses?: Course
  departments?: Department[] | null
  [key: string]: any
}
