import axios from 'axios'
import UserService from './UserService'
import { lmsbackend, lmstrainingmanagement } from './customService';

const axiosClient = axios.create()
const configure = () => {
  axiosClient.interceptors.request.use((config: any) => {

    const {url, method} = config;
    if(method.toLowerCase() === 'get') {
        if(url.indexOf(`/services/${lmsbackend}/api/departments/getHightLightDepartment`) >=0
        || url.indexOf(`/services/${lmstrainingmanagement}/api/tutorials/isDisplay`) >= 0
        || url.match(`/services/${lmstrainingmanagement}/api/news/*`)
        || url.match(`/services/${lmsbackend}/api/departments/*`)
        || url.match(`/services/${lmsbackend}/api/_search-all`)
        ){
          return config
        }
    }

    
    if (UserService.isLoggedIn()) {
      const cb = () => {
        config.headers.Authorization = `Bearer ${UserService.getToken()}`;
        return Promise.resolve(config);
      };
    
        return UserService.updateToken(cb);

      
    }
    
    return config;
  })
}

axiosClient.interceptors.response.use(
    async (response) => {
        return response.data
    },
    function (error) {
      const status = error?.response?.status
      if(status === 401) {
        UserService.doLogin();
      }


    //     // Any status codes that falls outside the range of 2xx cause this function to trigger
    //     // Do something with response error
        return Promise.reject(error)
    },
)

const HttpService = {
    configure,
    axiosClient,
}

export default HttpService
