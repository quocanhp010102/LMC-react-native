export  const lmsbackend = "lmsbackendtest";
export  const lmstrainingmanagement = "lmstrainingmanagementtest";
export const lmsbackendthanhnc = "lmsquestionbanktest";



class microserviceApi{

    getEndPointService(endpoint:string, service?:string | null){
        if(!service) {
            service = lmsbackend;
        }
        return `/services/${service}/api/${endpoint}`
    }
    getEndPointServiceNotifycation(){
        return `/services/${lmstrainingmanagement}/ws`
    }
}

export const microservice =  new microserviceApi();