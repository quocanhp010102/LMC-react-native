import { API } from "../..";
export const ManageUserManualApi = {
  getAllUser: (page : number , size : number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/admin/UserByLecAndStudent?page=${page}&size=${size}`,
  searchUser: (query: string , page : number , size : number ) =>
    `${API.PUBLIC}services/lmsbackendtest/api/admin/UserByLecAndStudentAllField?query=${query}&page=${page}&size=${size}`,
};
