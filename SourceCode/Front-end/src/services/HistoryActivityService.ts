import { microservice, lmstrainingmanagement } from './customService'
import HttpService from './HttpService'

export type HistoryType = {
    id?: number | string
    historyName: string
    historyTime: string
    user: {
        id: number | string
    }
    lesson: {
        id: number | string
    }
}

type PostHistoryActivityType = {
    method: string
    name: string
    courses?: {
        id: any
    }
}

const url = microservice.getEndPointService('activity-histories', lmstrainingmanagement)
export const HistoryActivityService = {
    getHistoryActivities: (): Promise<any> => {
        return HttpService.axiosClient.get(`${url}`)
    },
    getHistoryActivityById: (id: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url}/${id}`)
    },
    getCurrentDateHistoryActivity: (page?: any, size?: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url}/getBycurrentDate?page=${page}&size=${size}`)
    },
    getCurrentMonthHistoryActivity: (page?: any, size?: any): Promise<any> => {
        return HttpService.axiosClient.get(`${url}/getBycurrentMonth?page=${page}&size=${size}`)
    },
    postHistoryActivity: (data: PostHistoryActivityType): Promise<any> => {
        return HttpService.axiosClient.post(url, data)
    },
    // putHistoryActivity: (id: any, data: any): Promise<any> => {
    //     return HttpService.axiosClient.put(`${url}/${id}`, data)
    // },
    // deleteHistoryActivity: (id: any): Promise<any> => {
    //     return HttpService.axiosClient.delete(`${url}/${id}`)
    // },
}
