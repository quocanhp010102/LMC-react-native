export const API = {
  PUBLIC: "http://101.99.6.31:28092/",
  LOCAL: "http://192.168.1.230:28088/",
  // PUBLIC: "http://192.168.1.250:28088/",
}

export const lmsbackend = "lmsbackendtest"
export const lmstrainingmanagement = "lmstrainingmanagementtest"
export const lmsbackendthanhnc = "lmsquestionbanktest"

class microserviceApi {
  getEndPointService(endpoint: string, service?: string | null) {
    if (!service) {
      service = lmsbackend
    }
    return `${API.PUBLIC}services/${service}/api/${endpoint}`
  }
  getEndPointServiceNotifycation() {
    return `${API.PUBLIC}services/${lmstrainingmanagement}/ws`
  }
}

export const microservice = new microserviceApi()

export interface IResponseApi<T> {
  success?: boolean
  data?: T
  message?: string
  status?: number | string
  page?: {
    current: number
    max: number
  }
  count?: number
}

export interface ApiResponse<T> extends IResponseApi<T> {
  cancel?: boolean
  code: number
}
