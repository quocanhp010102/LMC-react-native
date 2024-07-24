import { microservice } from './customService'
import HttpService from './HttpService'

export type CourseStudentType = {
    id?: string | number
    courseStudent_notification: string
    course: {
        id: string | number
    }
    user: {
        id: string | number
    }
}

const url = microservice.getEndPointService('course-students-percent')
const url_history = microservice.getEndPointService('course-students-percent-history')
const url_search = microservice.getEndPointService("course-students");
const url_student = microservice.getEndPointService("course-students/getByCourse")

const url_course = microservice.getEndPointService('lmsbackend', 'course')

export const CourseStudentsService = {
    getCourseStudents: (option:any): Promise<any> => {
        return HttpService.axiosClient.get(`${url}?page=${option.page}&size=${option.size}`)
    },

    getStudentsByCourse: (id:any):Promise<any> => {
        return HttpService.axiosClient.get(`${url_student}/${id}`)
    },

    getCourseStudentHistory: ():Promise<any>=> {

        return HttpService.axiosClient.get(url_history);
    },

    getCourseStudentsById: (id: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url_course}/${id}`)
    },

    postCourseStudent: (data: CourseStudentType): Promise<any> => {
        return HttpService.axiosClient.post(`${url_course}`, data)
    },
    
    putCourseStudent: (id: any, data: CourseStudentType): Promise<any> => {
        return HttpService.axiosClient.put(`${url_course}/${id}`, data)
    },

    deleteCourseStudent: (id: any): Promise<any> => {
        return HttpService.axiosClient.delete(`${url_course}/${id}`)
    },

    getCoursesByStudentId: (id: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url_course}/getByStudent/${id}`)
    },

    searchCourseByStudent:(keyword:any, option:any):Promise<any> => {

        return HttpService.axiosClient.get(`${url_search}/searchCourseByCurrentUser?param=${keyword}&page=${option.page}&size=${option.size}`)

    }
}
