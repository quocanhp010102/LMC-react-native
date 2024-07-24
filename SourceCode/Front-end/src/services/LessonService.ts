
import HttpService from "./HttpService";
import { microservice } from "./customService";

const urlLessons = microservice.getEndPointService('lessons')
const urlPostPercent = microservice.getEndPointService('student-lessons')
const urlGetPercent = microservice.getEndPointService('student-lessons-by-studentId-and-lessonId')
// const urlLessonsDung = microservice.getEndPointService('lessons', "lmsbackenddung")
const urlLessonsfile = microservice.getEndPointService("files-of-lessons")


export const LessonService = {

    getLessonById: (id: any): Promise<any> => {
        return HttpService.axiosClient.get(`${urlLessons}/${id}`);
    },
    postLessons: (data: any): Promise<any> => {
        return HttpService.axiosClient.post(urlLessons, data);
    },
    deleteLesson: (id:any):Promise<any> => {
        return HttpService.axiosClient.delete(`${urlLessons}/${id}`)
    },
    postFileOfLesson: (data:any):Promise<any>=> {
        return HttpService.axiosClient.post(urlLessonsfile, data);
    },
    updateLesson: (id: any, data:any):Promise<any> => {

        return HttpService.axiosClient.put(`${urlLessons}/${id}`, data)
    },
    deleteFileOfLesson: (id:any)=> {
        return HttpService.axiosClient.delete(`${urlLessonsfile}/${id}`);
    },
    postPercentLesson: (id:any,data:any):Promise<any> => {

        return HttpService.axiosClient.put(`${urlPostPercent}/${id}`, data);
    },
    getPercentLesson: (id:any):Promise<any> => {

        return HttpService.axiosClient.get(`${urlGetPercent}/${id}`);
    }


  
}

