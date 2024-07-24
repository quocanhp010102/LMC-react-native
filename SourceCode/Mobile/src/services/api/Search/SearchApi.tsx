import { API } from "../..";

export const SearchApi = {
  getAllSearch: (query: string): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/_search-all?query=${query}`,
};
