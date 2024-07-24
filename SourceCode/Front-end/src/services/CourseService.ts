import HttpService from './HttpService'
import { lmstrainingmanagement, microservice } from './customService'
import { Course } from '../types'

const url = microservice.getEndPointService('courses')
const url_exam = microservice.getEndPointService('courses', lmstrainingmanagement)
const url_postFile = microservice.getEndPointService('files-of-courses')
const url_courseStudent = microservice.getEndPointService('course-students')
const url_teacher = microservice.getEndPointService('coursesByLecturersId')
const url_search = microservice.getEndPointService('coursesByLecturersIdAllField')

export const CourseService = {
    // get all
    getCourses: (): Promise<any> => {
        return HttpService.axiosClient.get(`${url}`)
    },

    postCourse: (data: any): Promise<any> => {
        return HttpService.axiosClient.post(url, data)
    },

    putCourse: (id: any, data: any): Promise<any> => {
        return HttpService.axiosClient.put(`${url}/${id}`, data)
    },
    // get course theo id departments
    getCourseByDepartmentId(id: number | string, page?: number, size?: number, sort?: string): Promise<any> {
        let urlpage = `${url}/getByDepartment/${id}`
        if (page >= 0 && size > 0) {
            urlpage = `${url}/getByDepartment/${id}?page=${page}&size=${size}&sort=${sort}`
        }
        return HttpService.axiosClient.get(urlpage)
    },
    searchCourseInDepartment(id: number, query: string, page?: number, size?: number, sort?: string): Promise<any> {
        let urlpage = `${url}/getByDepartmentAndName/${id}?name=${query}`
        if (page >= 0 && size > 0) {
            urlpage = `${url}/getByDepartmentAndName/${id}?name=${query}&page=${page}&size=${size}&sort=${sort}`
        }
        return HttpService.axiosClient.get(urlpage)
    },
    getCoursesByStudent: (): Promise<any> => {
        return HttpService.axiosClient.get(url)
    },
    getCourseByLecture: (option: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url_teacher}?page=${option.page}&size=${option.size}&sort=${option.sort}`)
    },

    // getCourseById: async(id: any): Promise<any> => {
    //     console.log(id, "courseid");
    //     const a =await HttpService.axiosClient.get(`${url}/${id}`);

    //     return a;
    // },

    getCourseById: (id: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url}/${id}`)
    },
    deleteCourse(id: any): Promise<any> {
        return HttpService.axiosClient.delete(`${url}/${id}`)
    },

    getCourseExam: (id: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url_exam}/get-one/${id}`)
    },
    // sửa khóa học
    putCourseById(course: Course, id: number): Promise<any> {
        console.log(course)
        return HttpService.axiosClient.put(`${url}/${id}`, course)
    },
    postFileOfCourse: (data: any): Promise<any> => {
        return HttpService.axiosClient.post(url_postFile, data)
    },
    deleteFileOfCourse: (id: any) => {
        return HttpService.axiosClient.delete(`${url_postFile}/${id}`)
    },
    deleteStudentOfCourse: (courseId: any, data: any[]) => {
        return HttpService.axiosClient.delete(`${url_courseStudent}/deleteStudent/${courseId}`, { data })
    },
    addStudentToCourse: (courseId: any, data: any[]) => {
        return HttpService.axiosClient.post(`${url_courseStudent}/insertStudent/${courseId}`, data)
    },

    searchCourseByLecturer: (keyword: any, option: any): Promise<any> => {
        return HttpService.axiosClient.get(
            `${url_search}?query=${keyword}&page=${option.page}&size=${option.size}&sort=${option.sort}`,
        )
    },
}
