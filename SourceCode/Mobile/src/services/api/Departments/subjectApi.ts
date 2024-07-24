import { API, microservice } from "../.."
import { IPrams, IResponseData, ISubject } from "../../../../types"
import { generateApiService } from "../../ApiService"

const url = microservice.getEndPointService("subject")
export const SubjectServices = {
  get: (params: IPrams): Promise<IResponseData<ISubject>> => {
    const url = microservice.getEndPointService("subject/by-department")
    const newSearchParams = new URLSearchParams(params)
    return generateApiService.get(`${url}?${newSearchParams}`)
  },
  getById: (id: number): Promise<ISubject> => {
    return generateApiService.get(`${url}/${id}`)
  },
  post: (data: ISubject): Promise<ISubject> => {
    return generateApiService.post(url, data)
  },
  put: (data: ISubject): Promise<ISubject> => {
    return generateApiService.put(url, data)
  },
  delete: (ids: any[]) => {
    const url = microservice.getEndPointService("subject/delete-list")
    return generateApiService.delete(url, ids)
  },
}
