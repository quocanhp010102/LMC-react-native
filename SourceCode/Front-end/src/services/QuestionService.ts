import HttpService from "./HttpService";
import { microservice } from "./customService";
import { NumberLiteralType } from "typescript";
import { Questions } from "../types/Question";

const url = microservice.getEndPointService("question-and-answers");
const urlGetquestionByUser = microservice.getEndPointService("question-and-answers-userId");

export const QuestionService = {
    getQuestion(page?:number, size?:number):Promise<any> {
        return HttpService.axiosClient.get(`${url}?page=${page}&size=${size}&sort=id,desc`);
    },
    getQuestiosById(id:number):Promise<any>{
        return HttpService.axiosClient.get(`${url}/${id}`)
    },
    getQuestiosByUser(page?:number, size?:number):Promise<any>{
        if(page>=0 && size >=0) return HttpService.axiosClient.get(`${urlGetquestionByUser}?page=${page}&size=${size}`)
    },
    putQuestionsById(id:number, data: Questions): Promise<any>{
        return HttpService.axiosClient.put(`${url}/${id}`,data)
    },
    postQuestion(data: any): Promise<any>{
        return HttpService.axiosClient.post(`${url}`,data)
    }
}