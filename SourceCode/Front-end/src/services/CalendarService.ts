import { Student } from '../types';
import HttpService from './HttpService'
import { microservice, lmstrainingmanagement } from './customService'

const url = microservice.getEndPointService('notes', lmstrainingmanagement);
const url_contentt = microservice.getEndPointService('note-contents', lmstrainingmanagement);
export const CalendarService = {
    postEventCalendar: (data:any)=> {
        return HttpService.axiosClient.post(url, data)
    },
    getEventCalendar: (date:any):Promise<any> => {
        return HttpService.axiosClient.get(`${url}/currentLoginAndMonth?date=${date}`)
    },
    getNotesByid: (id:any):Promise<any> => {
        return HttpService.axiosClient.get(`${url}/${id}`);
    },
    deleteNoteById: (id:any)=> {
        return HttpService.axiosClient.delete(`${url_contentt}/${id}`);
    }
   
}
