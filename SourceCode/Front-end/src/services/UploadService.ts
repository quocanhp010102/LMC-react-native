
import HttpService from "./HttpService";
import { microservice } from "./customService";

const url = microservice.getEndPointService('uploadImage')
const urlMultifile = microservice.getEndPointService('uploadMultipleFile')
export const UploadService = {
         uploadFile :(data:any):Promise<any> => {      
                 return HttpService.axiosClient.post(`${url}`, data);
          },

          uploadMultiFile: (data:any):Promise<any> => {
            return HttpService.axiosClient.post(`${urlMultifile}`, data);
          }
}

