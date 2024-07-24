
import HttpService from "./HttpService";
import { microservice, lmstrainingmanagement } from "./customService";

const urlTutorial = microservice.getEndPointService( "tutorials", lmstrainingmanagement);
const urlSearch = microservice.getEndPointService("_search/tutorials?query=");

export const UserManualService = {
    // tạo bài hướng dẫn
    postTutorial(data: any): Promise<any> {
        return  HttpService.axiosClient.post(`${urlTutorial}`, data);
    },
    // xóa bài hướng dẫn theo id

    deletToturialId(id:number): Promise<any>{
        return HttpService.axiosClient.delete(`${urlTutorial}/${id}`);
    },

    // get tutorials nổi bật
    getTutorialisDisplay ():Promise<any>{
        return HttpService.axiosClient.get(`${urlTutorial}/isDisplay`)
    },
    // get tutorials
     getTutorial(page?: number, size?: number): Promise<any | null> {
        const url = urlTutorial;
        let result = null;
        if (page >=0) {
            result = HttpService.axiosClient.get(`${url}/authen?page=${page}&size=${size}&sort=id,desc`);
        } else {
            result = HttpService.axiosClient.get(`${url}`);
        }
        return result;
    },
    putTutorialById(id:number, data:any): Promise<any>{
        return HttpService.axiosClient.put(`${urlTutorial}/${id}`, data)
    },
    searchTutorial(query: string|number, page?:number,size?:number): Promise<any>{
        return HttpService.axiosClient.get(`${urlSearch}${query}&page=${page}&size=${size}`)
    }
}

