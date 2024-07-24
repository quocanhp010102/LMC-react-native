import HttpService from './HttpService'
import { microservice } from './customService'

const url = microservice.getEndPointService('classrooms')
const url_delete = microservice.getEndPointService('classroom')
const url_action = microservice.getEndPointService("classroom-students");
export const ClassService = {
    // get all
    getClasses: (option:any): Promise<any> => {
        return HttpService.axiosClient.get(`${url}?page=${option.page}&size=${option.size}&sort=${option.sort}`)
    },
    getClassDetail: (id:any):Promise<any> => {

        return HttpService.axiosClient.get(`${url}/${id}`);
    } ,

    addClass: (data:any):Promise<any> => {
        return HttpService.axiosClient.post(url, data)
    },
    addSudentsToClass: (id:any,ids:any[]):Promise<any> => {
        
        return HttpService.axiosClient.post(`${url_action}/insertStudent/${id}`, ids)
    },
    updateClass: (id:any, data:any):Promise<any> => {
        return HttpService.axiosClient.put(`${url}/${id}`, data)
    },
    deleteClass: (ids:any):Promise<any> => {

        return HttpService.axiosClient.delete(`${url_delete}/deleteClassroom`, {data: ids});
    },
    deleteStudentClass: (id:any, idStudents:any[]):Promise<any> => {

        return HttpService.axiosClient.delete(`${url_action}/deleteStudent/${id}`, {data: idStudents})
    },
    searchClassRomeByAdmin: (keyword: any, option:any):Promise<any> => {

        return HttpService.axiosClient.get(`${url}/searchClassroomByCodeNameAndDepartment?param=${keyword}&page=${option.page}&size=${option.size}&sort=${option.sort}`)
    },
    checkClassCode: (keyword:any):Promise<any> => {

        return HttpService.axiosClient.get(`${url}/checkExistClassroom?classCode=${keyword}`)
    },
   

 
}
