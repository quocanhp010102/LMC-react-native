import { microservice } from "./customService";
import HttpService from "./HttpService";

const url = microservice.getEndPointService("_search-all");

export const SearchAllService = {
    searchAll(query: number | string, page?:number, size?: number) : Promise<any>{
        if( page >= 0 && size >= 0){
            return HttpService.axiosClient.get(`${url}?query=${query}&page=${page}&size=${size}`)
        }else{
            return HttpService.axiosClient.get(`${url}?query=${query}`)
        }
    }
}