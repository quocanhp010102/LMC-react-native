import { NotifyType } from '../types/NotifyType'
import { microservice, lmstrainingmanagement } from './customService'
import HttpService from './HttpService'

const url = microservice.getEndPointService('notifications', lmstrainingmanagement)
const urlNotifycation = microservice.getEndPointService('notifications/updateStatus', lmstrainingmanagement)
const urlSearch = microservice.getEndPointService('_search', lmstrainingmanagement)
export const NotifycationService = {
    getNotification(page?: any, size?: any): Promise<any> {
        return HttpService.axiosClient.get(`${url}?page=${page}&size=${size}`)
    },
    searchNotification(keyWord: string, page?: any, size?: any): Promise<any> {
        return HttpService.axiosClient.get(`${urlSearch}/notifications?query=${keyWord}&page=${page}&size=${size}`)
    },
    getNotifycation(page?:Number, size?:Number): Promise<any> {
        if(page>=0 && size>=0){
            return HttpService.axiosClient.get(`${url}/getByReceiverId?page=${page}&size=${size}`)
        }else{
            return HttpService.axiosClient.get(`${url}/getByReceiverId`)
        }
    },

    getNotifycationunRead(page?:Number, size?:Number): Promise<any> {
        if(page>=0 && size>=0){
            return HttpService.axiosClient.get(`${url}/receiver-unread?page=${page}&size=${size}`)
        }else{
            return HttpService.axiosClient.get(`${url}/receiver-unread`)
        }
    },
    
    getNumberNotifycation(): Promise<any> {
            return HttpService.axiosClient.get(`${url}/total-unread-notifications`)
    },

    postNotification(data: any): Promise<any> {
        return HttpService.axiosClient.post(url, data)
    },
    putNotification(id: number, data: any): Promise<any> {
        return HttpService.axiosClient.put(`${url}/${id}`, data)
    },
    putNotifycation(id: number, data: NotifyType): Promise<any> {
        return HttpService.axiosClient.put(`${urlNotifycation}/${id}`, data)
    },
    delNotification(data: any[]): Promise<any> {
        return HttpService.axiosClient.delete(`${url}/deletes`, { data })
    },
}
