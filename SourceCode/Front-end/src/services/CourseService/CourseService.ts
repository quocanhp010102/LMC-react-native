
import HttpService from "../HttpService";
import { microservice } from "../customService";

const url:string = microservice.getEndPointService('courses');



export const CourseService = {

    getAllCourses():Promise<any> {
        return HttpService.axiosClient.get(`${url}`);
    },

    getStudentsByCourseId(id: number):Promise<any> {
        return HttpService.axiosClient.get(`/services/lmsbackenddung/api/course-students/getByCourse/${id}`);
    },

 
   


}
