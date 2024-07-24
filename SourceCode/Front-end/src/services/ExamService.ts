import { News } from './../types/News'
import HttpService from './HttpService'
import { microservice, lmstrainingmanagement } from './customService'
import { Exam } from '../types/Exam'

const url = microservice.getEndPointService('exams', lmstrainingmanagement)
const url_exam = microservice.getEndPointService('exams-histories/exams-student', lmstrainingmanagement)
const url_student_exam_course = microservice.getEndPointService('exams-histories/course-student', lmstrainingmanagement)
const url_history = microservice.getEndPointService('exams-histories', lmstrainingmanagement)
export const ExamService = {
    // get tin tức (news)
    getExamById: (id: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url}/${id}`)
    },
    postExamByCourse: (data: any): Promise<any> => {
        return HttpService.axiosClient.post(url, data)
    },
    getExamByIdBeforePass: (id: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url}/beforePass/${id}`)
    },
    getExamByStudent: (studentId: any, examId: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url_exam}?examsId=${examId}&studentId=${studentId}`)
    },
    getExamsByCourse_Student: (studentId: any, courseId: any, option?:any): Promise<any> => {
        return HttpService.axiosClient.get(`${url_student_exam_course}?studentId=${studentId}&courseId=${courseId}${option ? "&page"+"="+option.page + "&size" + "=" + option.size + "&sort=" + option.sort : ""}`)
    },
    getExamsByCourse: (id: any, option: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url}/course/${id}?page=${option.page}&size=${option.size}&sort=${option.sort}`)
    },
    postExamByStudent: (data: any): Promise<any> => {
        return HttpService.axiosClient.post(url_history, data)
    },
    deleteExam: (id: any): Promise<any> => {
        return HttpService.axiosClient.delete(`${url}/${id}`)
    },
    getExamRandom: (id: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url_history}/exams/${id}`)
    },
    markingExam: (id: any, data: any): Promise<any> => {
        return HttpService.axiosClient.put(`${url_history}/${id}`, data)
    },
    postMultipleChoiceExam: (data: any): Promise<any> => {
        return HttpService.axiosClient.post(url, data)
    },
    putMultipleChoiceExam: (examId: any, data: any): Promise<any> => {
        return HttpService.axiosClient.put(`${url}/${examId}`, data)
    },
    getScoresExam: (id:any, option?:any):Promise<any> => {
        return HttpService.axiosClient.get(`${url_history}/student-point/exams/${id}${option ? "?page="+option.page+"&size="+option.size+"&sort="+option.sort : ""}`)
        
    }
}
