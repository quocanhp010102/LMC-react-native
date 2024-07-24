import HttpService from '../HttpService'
import { microservice } from '../customService'

const url: string = microservice.getEndPointService('students')

export const StudentService = {
    getAllStudents(): Promise<any> {
        return HttpService.axiosClient.get(`${url}`)
    },

    getStudentById(id: number): Promise<any> {
        return HttpService.axiosClient.get(`${url}/${id}`)
    },

    // lấy danh sách sinh viên theo id khóa học
    getStudentByCousesId(id: number | string, page?: number, size?: number): Promise<any> {
        let urlget = `${url}/getByCourse/${id}`
        if (page >= 0 && size >= 0) {
            urlget = `${urlget}?page=${page}&size=${size}`
        }
        return HttpService.axiosClient.get(`${urlget}`)
    },

    createNewStudent(): Promise<any> {
        return HttpService.axiosClient.post(`${url}`)
    },

    updateStudentById(id: number) {
        return HttpService.axiosClient.put(`${url}/${id}`)
    },

    deleteStudentById(id: number) {
        return HttpService.axiosClient.delete(`${url}/${id}`)
    },
}
