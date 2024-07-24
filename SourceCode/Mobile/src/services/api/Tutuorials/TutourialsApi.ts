import { API } from "../..";

export const TutourialsApi = {
  getTutourials: (): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/tutorials`,
  deleteTutourials: (ids: string): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/tutorials/deletes?ids=${ids}`,
  searchTutourials: (query: string , page ?: number , size ?: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/_search/tutorials?query=${query}&page=${page}&size=${size}`,
  getTutourialsAuthen: (page : number , size: number): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/tutorials/authen?page=${page}&size=${size}`,
  getTutourialsByid: (id: number): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/tutorials/${id}`,
};
