import { API } from "../..";

export const UserApi = {
  postStudent: (id?: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/keycloak/add-user`,
  putUser : (id: string): string => 
  `${API.PUBLIC}services/lmsbackendtest/api/keycloak/update/${id}`,
  deleteUser : (): string => 
  `${API.PUBLIC}services/lmsbackendtest/api/keycloak/deletelist`,
  getUserById: (id: string , role : string): string => 
    `${API.PUBLIC}services/lmsbackendtest/api/admin/getUserDetail?id=${id}&rolename=${role}`
};
