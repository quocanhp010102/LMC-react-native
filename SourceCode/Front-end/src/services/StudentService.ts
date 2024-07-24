import { Student } from '../types'
import HttpService from './HttpService'
import { lmsbackend, microservice } from './customService'

const url = microservice.getEndPointService('students')
const url_student_course = microservice.getEndPointService('course-manager')
const url_students_course = microservice.getEndPointService('students/getByCourse')
const url_update = microservice.getEndPointService('updateAvatar')
const url_courses_student = microservice.getEndPointService('course-students', lmsbackend)
// const url_student_exam_course = microservice.getEndPointService("exams-histories/course-student",)

export const StudentService = {
    getStudent: (): Promise<any> => {
        return HttpService.axiosClient.get(url)
    },
    getStudentDetail: (id:any):Promise<any> => {
        return HttpService.axiosClient.get(`${url}/${id}`)
    },
    searchStudent: (keyword: string): Promise<any> => {
        return HttpService.axiosClient.get(`${url}/getStudentByNameCodeAndClass?param=${keyword}`)
    },
    updateStudent: (id: any, data: any): Promise<any> => {
        return HttpService.axiosClient.put(`${url}/${id}`, data)
    },
    getMySelf: (): Promise<any> => {
        return HttpService.axiosClient.get(`${url}/myself`)
    },
    getSudentByCourse: (id: any, option: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url}/getAllStudentCourse/${id}?page=${option.page}&size=${option.size}`)
    },
    getStudentPercentCourse: (id: any, keyword: any, option: any): Promise<any> => {
        return HttpService.axiosClient.get(
            `${url}/getAllStudentCourseByStudentName/${id}?query=${keyword}&page=${option.page}&size=${option.size}`,
        )
    },
    getListStudentByCourse: (id: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url_students_course}/${id}`)
    },
    getStudentByClass: (id: any, option: any): Promise<any> => {
        return HttpService.axiosClient.get(
            `${url}/getAllStudentByClassroom/${id}?page=${option.page}&size=${option.size}`,
        )
    },
    updateAvatar: (data: any) => {
        return HttpService.axiosClient.put(`${url_update}`, data)
    },
    getStudentsByCourseId: (courseId: any, page?: any, size?: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url}/getByCourse/${courseId}?page=${page}&size=${size}`)
    },
    getListStudentNoInClass: (id:any, keyword:string, option:any):Promise<any> => {
        return HttpService.axiosClient.get(`${url}/getStudentNotInClassroom/${id}?student_name=${keyword}&page=${option.page}&size=${option.size}`)
    },
    getStudentNotInCourse: (courseId: any, searchKeyWord: string): Promise<any> => {
        return HttpService.axiosClient.get(`${url}/getStudentNotInCourse/${courseId}?student_name=${searchKeyWord}`)
    },
}
