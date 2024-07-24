import { Course } from "./Course"

export type Department = {
    id?: string | number
    department_name?: string,
    department_type?: string,
    department_image?: string
    courses?: Course[]
}

export type stateType = {
    id: number
    department_image: string
    department_name: string
    department_type: string
    courses: []
}