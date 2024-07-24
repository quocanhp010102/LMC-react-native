import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {AxiosRequestConfig} from "axios";
import {KEYS} from "../constants/key";

var jwtDecode = require("jwt-decode");

const logout = () => {
}; // Alert.alert("Hết phiên đăng nhập!", "Vui lòng đăng nhập lại", [
//   { text: "OK", onPress: () => console.log("click") },
// ]);
const axiosInstance = axios.create()

// axiosInstance.interceptors.response.use(
//   response => {
//     // Nếu phản hồi thành công, trả về phản hồi 
//     return response;
//   },
//   async error => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const refresh_token = await AsyncStorage.getItem(KEYS.REFRESH_TOKEN);
//       const params = {
//         grant_type: "refresh_token",
//         client_id: "web_app",
//         client_secret: "web_app",
//         refresh_token: refresh_token,
//       };
//       const data = Object.keys(params)
//         .map((key) => `${key}=${encodeURIComponent(params[key])}`)
//         .join("&");
//       // Gọi API để refresh token và lưu trữ token mới vào AsyncStorage hoặc nơi lưu trữ tương tự
//       try {
//         const res = await axiosInstance.post(
//           "https://hanquochoc.edu.vn/auth/realms/jhipster/protocol/openid-connect/token",
//           data,
//           {
//             headers: { "content-type": "application/x-www-form-urlencoded" },
//           }
//         );
//         if (res.status === 200 || res.status === 201) {
//           originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
//           await AsyncStorage.setItem(KEYS.TOKEN, res.data.access_token);
//           await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, res.data.refresh_token);
//           return axiosInstance(originalRequest);
//         }
//       } catch (e) {
//         const status = e.response?.status;
//         if (status === 401) {
//           logout();
//         }
//       }

//       // Cập nhật token mới vào header của originalRequest


//       // Thực hiện lại request ban đầu với token mới

//     }

//     // Nếu không phải lỗi 401 hoặc refresh token không thành công, throw error
//     throw error;
//   }
// );

axiosInstance.interceptors.response.use(
    response => {
        // Nếu phản hồi thành công, trả về phản hồi
        return response;
    },
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            try {
                originalRequest._retry = true;
                const value = await AsyncStorage.getItem(KEYS.REMEMBER);
                const dataJson = JSON.parse(value || "");
                const params: any = {
                    grant_type: "password",
                    client_id: "web_app",
                    client_secret: "web_app",
                    username: dataJson.username?.trim(),
                    password: dataJson.password?.trim(),
                };
                const data = Object.keys(params)
                    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
                    .join("&");
                // Gọi API để refresh token và lưu trữ token mới vào AsyncStorage hoặc nơi lưu trữ tương tự

                const res = await axiosInstance.post(
                    "https://hanquochoc.edu.vn/auth/realms/jhipster/protocol/openid-connect/token",
                    data,
                    {
                        headers: {"content-type": "application/x-www-form-urlencoded"},
                    }
                );
                if (res.status === 200 || res.status === 201) {

                    originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
                    await AsyncStorage.setItem(KEYS.TOKEN, res.data.access_token);
                    await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, res.data.refresh_token);
                    return axiosInstance(originalRequest);
                }
            } catch (e: any) {
                const status = e.response?.status;
                if (status === 401) {
                    logout();
                }
            }

            // Cập nhật token mới vào header của originalRequest


            // Thực hiện lại request ban đầu với token mới

        }

        // Nếu không phải lỗi 401 hoặc refresh token không thành công, throw error
        throw error;
    }
);

const getTokenByRefresh = async () => {
    const refresh_token = await AsyncStorage.getItem(KEYS.REFRESH_TOKEN);
    const params: any = {
        grant_type: "refresh_token",
        client_id: "web_app",
        client_secret: "web_app",
        refresh_token: refresh_token,
    };
    const data = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&");
    // => format=json&option=value
    const options: any = {
        method: "POST",
        headers: {"content-type": "application/x-www-form-urlencoded"},
        data,
        url: "https://hanquochoc.edu.vn/auth/realms/jhipster/protocol/openid-connect/token",
    };
    try {
        const res = await axios(options);
        if (res.status === 200 || res.status === 201) {
            await AsyncStorage.setItem(KEYS.TOKEN, res.data.access_token);
            await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, res.data.refresh_token);

            return res.data.access_token;
        } else {

        }
    } catch (e: any) {
        const status = e.response?.status;
        if (status === 401) {
            logout();
        }
    }
};

export const generateApiService = {
    getToken: async (data: any) => {
        const url =
            "https://aladintech.co/auth/realms/aladintechtest/protocol/openid-connect/token";
        const config: AxiosRequestConfig = {
            method: "post",
            url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
        };
        try {
            const res = await axios(config);
            if (res.status === 200 || res.status === 201) {
                return res.data;
            } else {
                return res.statusText;
            }
        } catch (e: any) {
            console.log({e});
            const status = e.response?.status;
            if (status === 401) {
                logout();
            }
            throw new Error(e.message);
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
        };
        try {
            const res = await axios(config);
            if (res.status === 200) {
                return res.data;
            } else {
                return res.statusText;
            }
        } catch (e: any) {
            console.log({e});
            //   Alert.alert(
            //     e.response.data.error ? e.response.data.error : e.response.data.message,
            //   );
            throw new Error(e.message);
        }
    },
    post: async (url: string, data: any) => {
        let token = await AsyncStorage.getItem(KEYS.TOKEN);

        const config: AxiosRequestConfig = {
            method: "post",
            url,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            data,
        };
        try {
            const res = await axios(config);
            if (res.status === 200 || res.status === 201) {
                return res.data;
            } else {
                return res.statusText;
            }
        } catch (e: any) {
            const status = e.response?.status;
            if (status === 401) {
                logout();
            }
            throw new Error(e.message);
        }
    },
    get: async (url: string, getLoadmore?: boolean) => {
        let token = await AsyncStorage.getItem(KEYS.TOKEN);
        var decoded = await jwtDecode(token);
        if (new Date().getTime() / 1000 > decoded.exp) {
            token = await getTokenByRefresh();
        }
        const config: AxiosRequestConfig = {
            method: "get",
            url,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };


        try {
            const res = await axios(config);

            if (res.status === 200 || res.status === 201) {
                if (getLoadmore) {
                    return {
                        success: true,
                        data: res.data,
                    };
                } else {
                    return res.data
                }
            } else {
                return res.statusText;
            }
        } catch (e: any) {
            const status = e.response?.status;
            if (status === 401) {
                logout();
            }
            throw new Error(e.message);
        }
    },
    getWithoutToken: async (url: string) => {
        const config: AxiosRequestConfig = {
            method: "get",
            url,
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const res = await axios(config);
            if (res.status === 200) {
                return res.data;
            } else {
                return res.statusText;
            }
        } catch (e: any) {
            throw new Error(e.message);
        }
    },
    put: async (url: string, data: any) => {
        let token = await AsyncStorage.getItem(KEYS.TOKEN);
        var decoded = await jwtDecode(token);
        if (new Date().getTime() / 1000 > decoded.exp) {
            token = await getTokenByRefresh();
        }
        const config: AxiosRequestConfig = {
            method: "put",
            url,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            data,
        };
        try {
            const res = await axios(config);
            if (res.status === 200) {
                return res.data;
            } else {
                return res.statusText;
            }
        } catch (e: any) {
            const status = e.response?.status;
            if (status === 400) {
                return status;
            }
            if (status === 401) {
                logout();
            }
            throw new Error(e.message);
        }
    },
    delete: async (url: string, data?: any) => {
        let token = await AsyncStorage.getItem(KEYS.TOKEN);
        var decoded = await jwtDecode(token);
        if (new Date().getTime() / 1000 > decoded.exp) {
            token = await getTokenByRefresh();
        }
        const config: AxiosRequestConfig = {
            method: "delete",
            url,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            data,
        };
        try {
            const res = await axios(config);
            if (res.status === 200) {
                return res.data;
            } else {
                return res.statusText;
            }
        } catch (e: any) {
            const status = e.response?.status;
            if (status === 401) {
                logout();
            }
            throw new Error(e.message);
        }
    },
    postImage: async (url: string, data: any) => {
        let token = await AsyncStorage.getItem(KEYS.TOKEN);
        var decoded = await jwtDecode(token);
        if (new Date().getTime() / 1000 > decoded.exp) {
            token = await getTokenByRefresh();
        }
        try {
            let res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "multipart/form-data",
                },
                body: data,
            });
            let responseJson = await res.text();
            return responseJson;
        } catch (e: any) {
            const status = e.response?.status;
            if (status === 401) {
                logout();
            }
            throw new Error(e.message);
        }
    },
    postImageAndroid: async (url: string, data: any) => {
        let token = await AsyncStorage.getItem(KEYS.TOKEN);
        var decoded = await jwtDecode(token);
        if (new Date().getTime() / 1000 > decoded.exp) {
            token = await getTokenByRefresh();
        }

        const config: AxiosRequestConfig = {
            method: "POST",
            url,
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + token,
            },
            // @ts-ignore
            body: data,
        };
        try {
            const res = await axios(config);
            if (res.status === 200) {
                return res.data;
            } else {
                return res.statusText;
            }
        } catch (e: any) {
            const status = e.response?.status;
            if (status === 401) {
                logout();
            }
            throw new Error(e.message);
        }
    },
    deleteFileOfCourse: async (url: string) => {
        let token = await AsyncStorage.getItem(KEYS.TOKEN);
        var decoded = await jwtDecode(token);
        if (new Date().getTime() / 1000 > decoded.exp) {
            token = await getTokenByRefresh();
        }
        const config: AxiosRequestConfig = {
            method: "delete",
            url,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        try {
            const res = await axios(config);
            if (res.status === 200) {
                return res.data;
            } else {
                return res.statusText;
            }
        } catch (e: any) {
            const status = e.response?.status;
            if (status === 401) {
                logout();
            }
            throw new Error(e.message);
        }
    },
};
