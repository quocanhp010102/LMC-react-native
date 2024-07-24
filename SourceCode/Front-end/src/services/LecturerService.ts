import { microservice } from './customService'
import HttpService from './HttpService'

const url = microservice.getEndPointService('lecturers')
const ulrCourse = microservice.getEndPointService("course-lecture-history");
export const LecturerService = {
    getLecturers: (): Promise<any> => {
        return HttpService.axiosClient.get(`${url}`)
    },
    getLecturerById: (lecturerId: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url}/${lecturerId}`)
    },
    postLecturer: (data: any): Promise<any> => {
        return HttpService.axiosClient.post(`${url}`, data)
    },
    putLecturer: (lecturerId: any, data: any): Promise<any> => {
        return HttpService.axiosClient.put(`${url}/${lecturerId}`, data)
    },
    deleteLecturer: (id: any): Promise<any> => {
        return HttpService.axiosClient.delete(`${url}/${id}`)
    },

    getCourseByLectureHistory: ():Promise<any> => {
        return HttpService.axiosClient.get(ulrCourse);
    },
    getCurrenLecturer: ():Promise<any> => {
        return HttpService.axiosClient.get(`${url}/myself`);
    },
    
}
