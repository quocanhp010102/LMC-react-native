import { News } from './../types/News';
import HttpService from "./HttpService";
import { microservice, lmstrainingmanagement } from "./customService";

const url = microservice.getEndPointService("news",lmstrainingmanagement);
const urlNewSort = microservice.getEndPointService("news/getAllSortDateAndDisplay", lmstrainingmanagement);
const urlSearch = microservice.getEndPointService("_search/news");
const urlNewsHistory = microservice.getEndPointService("activity-histories", lmstrainingmanagement)

export const NewsService = {

     // getall new
     getAllNews(page?: number, size?: number) : Promise<any>{
          return HttpService.axiosClient.get(`${url}/?${page}&${size}`)
     },
     getNewsBySortDate(page?: number, size?: number):Promise<any>{
          return HttpService.axiosClient.get(`${urlNewSort}?page=${page}&size=${size}`)
     },
  // get tin tức (news)
     getNewsHome(_option: {page: number, size?: 7}): Promise<any> {
        return  HttpService.axiosClient.get(`${url}/getAllSortDateAndDisplay?page=${_option.page}&size=${_option.size}`)
    },

     //     get tin tức nổi bật
     getFeaturedNews():Promise<any>{
          return HttpService.axiosClient.get(`${url}/isDisplay`)
     },

    // get tutorials

   getNewsById: (id:any):Promise<any>=> {
    return HttpService.axiosClient.get(`${url}/${id}`)
   },

   postNews: (data: News):Promise<any>=> {
        return HttpService.axiosClient.post(`${url}`, data);
   },
   updateNews: (id:any, data:News):Promise<any> => {
        return HttpService.axiosClient.put(`${url}/${id}`, data);
   },
   deleteNews: (id:any)=> {
     return HttpService.axiosClient.delete(`${url}/deletes?ids=${id}`);
   },
   updateDisplay: (id:any):Promise<any>=> {
        return HttpService.axiosClient.put(`${url}/updateDisplay/${id}`);
   },
   searchNews: (keyword:string, option:any):Promise<any> => {
     return HttpService.axiosClient.get(`${urlSearch}?query=${keyword}&page=${option.page}&size=${option.size}`);
   },
   postNewToHistory:(data:any):Promise<any> => {

     return HttpService.axiosClient.post(urlNewsHistory, data);
   }
}

