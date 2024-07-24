import { API } from "../..";
export const AuthApi = {
  getToken: (size: number): string =>
    `http://192.168.1.247:19080/auth/realms/jhipster/protocol/openid-connect/token`,
};
