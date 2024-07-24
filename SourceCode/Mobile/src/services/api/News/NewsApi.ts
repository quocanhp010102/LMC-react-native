import { API } from "../..";
export const NewsApi = {
  getNews: (page : number , size : number): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/news?page=${page}&size=${size}`,
  getNewById: (id: number): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/news/${id}`,
  getNewsDisplay: (): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/news/isDisplay`,
  deleteNews: (ids: string): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/news/deletes?ids=${ids}`,
  updateNews: (ids: string): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/news/updateDisplay/${ids}`,
  searchNews: (query: string , page : number , size : number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/_search/news?query=${query}&page=${page}&size=${size}`,
  getAllNewSortDateAndDisplay: (page : number , size : number): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/news/getAllSortDateAndDisplay?page=${page}&size=${size}`,
};
