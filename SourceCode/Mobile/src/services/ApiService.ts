import AsyncStorage from "@react-native-async-storage/async-storage"
import axios, { AxiosRequestConfig } from "axios"
import { KEYS } from "../constants/key"
import { useNavigation } from "@react-navigation/native"


const logout = () => {
  const navigation = useNavigation()

  navigation.navigate("/login")
}
const axiosInstance = axios.create()

axiosInstance.interceptors.response.use(
  (response) => {
    // Nếu phản hồi thành công, trả về phản hồi
    return response
  },
  async (error) => {
    
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true
        const value = await AsyncStorage.getItem(KEYS.REMEMBER)
        const refreshToken = await AsyncStorage.getItem(KEYS.REFRESH_TOKEN)

        const params: any = {
          grant_type: "refresh_token",
          client_id: "hcm",
          client_secret: "hcm",
          refresh_token: refreshToken,
        }
        const data = Object.keys(params)
          .map((key) => `${key}=${encodeURIComponent(params[key])}`)
          .join("&")
        const res = await axiosInstance.post(
          "https://hanquochoc.edu.vn/auth/realms/jhipster/protocol/openid-connect/token",
          data,
          {
            headers: { "content-type": "application/x-www-form-urlencoded" },
          }
        )
        if (res.status === 200 || res.status === 201) {
          originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`
          await AsyncStorage.setItem(KEYS.TOKEN, res.data.access_token)
          await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, res.data.refresh_token)
          return axiosInstance(originalRequest)
        }
      } catch (e: any) {
      
        
        const status = e.response?.status
        if (status === 401) {
          logout()
        }
      }

    }
 
    throw error
  }
)

export const generateApiService = {
  getToken: async (data: any) => {
    const url =
      "https://aladintech.co/auth/realms/aladintechtest/protocol/openid-connect/token"
    const config: AxiosRequestConfig = {
      method: "post",
      url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    }
    try {
      const res = await axios(config)

      if (res.status === 200 || res.status === 201) {
        return res.data
      } else {
        throw new Error(res.statusText)
      }
    } catch (e: any) {
      console.log({ e })
      const status = e.response?.status
      if (status === 401) {
        logout()
      }
      throw new Error(e.message)
    }
  },

  postWithoutToken: async (url: string, data: any) => {
    const config: AxiosRequestConfig = {
      method: "post",
      url,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    try {
      const res = await axiosInstance(config)
      if (res.status === 200) {
        return res.data
      } else {
        throw new Error(res.statusText)
      }
    } catch (e: any) {
      console.log({ e })

      throw new Error(e.message)
    }
  },
  post: async (url: string, data: any) => {
    let token = await AsyncStorage.getItem(KEYS.TOKEN)
    const config: AxiosRequestConfig = {
      method: "post",
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data,
    }
    try {
      const res = await axiosInstance(config)

      if (res.status === 200 || res.status === 201) {
        return res.data
      } else {
        throw new Error(res.statusText)
      }
    } catch (e: any) {
     
      const status = e.response?.status
      if (status === 401) {
        logout()
      }   
      throw e.response.data
    }
  },
  get: async (url: string, getLoadmore?: boolean) => {
    let token = await AsyncStorage.getItem(KEYS.TOKEN)

    const config: AxiosRequestConfig = {
      method: "get",
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }

    try {
      const res = await axiosInstance(config)
      if (res.status === 200 || res.status === 201) {
        if (getLoadmore) {
          return {
            success: true,
            data: res.data,
          }
        } else {
          return res.data
        }
      } else {
        throw new Error(res.statusText)
      }
    } catch (e: any) {
      const status = e.response?.status
      if (status === 401) {
        logout()
      }
      throw new Error(e.message)
    }
  },
  getWithoutToken: async (url: string) => {
    const config: AxiosRequestConfig = {
      method: "get",
      url,
      headers: {
        "Content-Type": "application/json",
      },
    }
    try {
      const res = await axiosInstance(config)
      if (res.status === 200) {
        return res.data
      } else {
        return res.statusText
      }
    } catch (e: any) {
      throw new Error(e.message)
    }
  },
  put: async (url: string, data: any) => {
    const token = await AsyncStorage.getItem(KEYS.TOKEN)
    const config: AxiosRequestConfig = {
      method: "put",
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data,
    }
    try {
      const res = await axiosInstance(config)
      if (res.status === 200 || res.status === 201) {
        return res.data
      } else {
        return res
      }
    } catch (e: any) {
      const status = e.response?.status
      if (status === 400) {
        throw new Error(status)
      }
      if (status === 401) {
        logout()
      }
      throw new Error(e.message)
    }
  },
  delete: async (url: string, data?: any) => {
    const token = await AsyncStorage.getItem(KEYS.TOKEN)

    const config: AxiosRequestConfig = {
      method: "delete",
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data,
    }
    try {
      const res = await axiosInstance(config)
      if (res.status === 200 || res.status === 201 || res.status == 204) {
        return res.data
      } else {
        throw new Error(res.statusText)
      }
    } catch (e: any) {
      const status = e.response?.status
      if (status === 401) {
        logout()
      }
      throw new Error(e.message)
    }
  },
  postImage: async (url: string, data: any) => {
    const token = await AsyncStorage.getItem(KEYS.TOKEN)
    try {
      let res = await fetch(url, {
        method: "POST",
        body: data,
        headers: {
          Accept: "*/*",
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      let responseJson = await res.text()
      return responseJson
    } catch (e: any) {
      const status = e.response?.status
      if (status === 401) {
        logout()
      }
      throw new Error(e.message)
    }
  },
  postImageAndroid: async (url: string, data: any) => {
    const token = await AsyncStorage.getItem(KEYS.TOKEN)
    const config: AxiosRequestConfig = {
      method: "POST",
      url,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token,
      },
      data,
    }
    try {
      const res = await axiosInstance(config)
      if (res.status === 200 || res.status === 201) {
        return res.data
      } else {
        throw new Error(res.statusText)
      }
    } catch (e: any) {
      const status = e.response?.status
      if (status === 401) {
        logout()
      }
      throw new Error(e.message)
    }
  },
  deleteFileOfCourse: async (url: string) => {
    const token = await AsyncStorage.getItem(KEYS.TOKEN)

    const config: AxiosRequestConfig = {
      method: "delete",
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
    try {
      const res = await axiosInstance(config)
      if (res.status === 200 || res.status === 201) {
        return res.data
      } else {
        throw new Error(res.statusText)
      }
    } catch (e: any) {
      const status = e.response?.status
      if (status === 401) {
        logout()
      }
      throw new Error(e.message)
    }
  },
}
