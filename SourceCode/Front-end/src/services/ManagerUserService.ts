import { News } from './../types/News';
import HttpService from "./HttpService";
import { microservice } from "./customService";

const url = microservice.getEndPointService("admin");
const urls = microservice.getEndPointService("admins");
export const ManagerUserService = {


  getUserSystem: (option:any):Promise<any> => {
    return HttpService.axiosClient.get(`${url}/UserByLecAndStudent?page=${option.page}&size=${option.size}`)
  },
  searchUserSystem: (text:any, option:any):Promise<any> => {

    return HttpService.axiosClient.get(`${url}/UserByLecAndStudentAllField?query=${text}&page=${option.page}&size=${option.size}`);
  },
  getUserDetaill: (id:any, role:any)=> {

    return HttpService.axiosClient.get(`${url}/getUserDetail?id=${id}&rolename=${role}`)
  },
  getProfileAdmin: ():Promise<any> => {
      return HttpService.axiosClient.get(`${urls}/myself`)
  }


}

