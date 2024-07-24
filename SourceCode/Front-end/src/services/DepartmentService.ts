
import HttpService from "./HttpService";
import { microservice } from "./customService";
import { Department, stateType } from "../types";

const url = microservice.getEndPointService('courses')
const urlLessons = microservice.getEndPointService('lessons')

const urlDeparment = microservice.getEndPointService("departments");
const urlTutorial = microservice.getEndPointService("tutorials");
const urlSearchDepartment = microservice.getEndPointService("departments/searchDepartmentByName");

export const DepartmentService = {
    // get danh sách các department 
     getDepartmentByType(type?: number, page?: number, size?: number): Promise<[] | any> {
        let url = urlDeparment;
        if (type || type >= 0) {
            if(page || page >=0 && size){
                url = `${urlDeparment}/getByType/${type}?page=${page}&size=${size}`
            }
            else{
                url=`${urlDeparment}/getByType/${type}`
            }
            const resultData =  HttpService.axiosClient.get(url);
            return resultData;
        }
    },
    // get departments
    getDepartment(page?:number, size?:number): Promise<any>{
        let url= urlDeparment;
        if(page || page>=0 && size){
            url = `${url}/?page=${page}&size=${size}&sort=id,desc`;
        }
        return HttpService.axiosClient.get(url);
    },
    // get các khóa đào tạo nổi bật
    getFeatureDepartments(): Promise<any>{
        return HttpService.axiosClient.get(`${urlDeparment}/getHightLightDepartment`);
    },

    async getDepatmentId(id: number): Promise<Object | any> {
        const url = urlDeparment;
        return await HttpService.axiosClient.get(`${url}/${id}`);
    },
    // delete one department 
    async deleteDepartment(id:number): Promise<any>{
        return await HttpService.axiosClient.delete(`${urlDeparment}/${id}`);
    },
    // tìm kiếm deparment 

    searchDeparment(query: string, page?:number,size?:number): Promise<any> {
        if(page>=0&&size>=0)
            return HttpService.axiosClient.get(`${urlSearchDepartment}?department_name=${query}&page=${page}&size=${size}`)
        
       return HttpService.axiosClient.get(`${urlSearchDepartment}?department_name=${query}`)
    },

    async postImg(data: any): Promise<any> {
        const url = microservice.getEndPointService("lmsbackenddung", "uploadImage");
        return await HttpService.axiosClient.post(`${url}`, data);
    },


    async postDeparment(data: {
        department_name: string,
        department_type: string,
        department_image: string
    }): Promise<any> {
        const url = urlDeparment;

        const a = await HttpService.axiosClient.post(`${url}`, data);
        return a;
    },
    putDepartment(data:Department, id:number) : Promise<any>{
        return HttpService.axiosClient.put(`${urlDeparment}/${id}`, data)
    }
}

