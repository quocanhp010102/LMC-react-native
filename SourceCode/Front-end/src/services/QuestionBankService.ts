import { microservice, lmsbackendthanhnc } from './customService'
import HttpService from './HttpService'
const url = microservice.getEndPointService('question-banks', lmsbackendthanhnc)
const url_filter = microservice.getEndPointService('question-banks-by-filter', lmsbackendthanhnc);
const url_search = microservice.getEndPointService("_search/question-banks", lmsbackendthanhnc);

export const QuestionBankService = {
    getQuestionBank: (option: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url}?page=${option.page}&size=${option.size}&sort=id,desc`)
    },

    getQuestionBankDetail: (id: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url}/${id}`)
    },
    getByFilter: ({ departmentId, courseId, questionType, searchText, page, size }): Promise<any> => {
        return HttpService.axiosClient.get(
            `${url_filter}?questionName=${searchText !== null ? searchText : ''}${departmentId !== -1 ? '&departmentId=' + departmentId : ''}${
                courseId !== -1 ? '&courseId=' + courseId : ''
            }${questionType !== -1 ? '&questionType=' + questionType : ''}&page=${page}&size=${size}&sort=id,desc`,
        )
    },
    getFilter: (questionType: any, departmentId?: any, courseId?: any, searchKeyword?: string): Promise<any> => {
        return HttpService.axiosClient.get(
            `${url_filter}?questionType=${questionType}${departmentId ? '&departmentId=' + departmentId : ''}${
                courseId ? '&courseId=' + courseId : ''
            }${searchKeyword ? '&questionName=' + searchKeyword : ''}`,
        )
    },
    addQuestionBank: (data): Promise<any> => {
        return HttpService.axiosClient.post(url, data)
    },
    editQuestion: (id: any, data: any): Promise<any> => {
        return HttpService.axiosClient.put(`${url}/${id}`, data)
    },
    deleteQuestion: (id: any): Promise<any> => {
        return HttpService.axiosClient.delete(`${url}/${id}`)
    }
}
