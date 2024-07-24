import { API } from "../..";

export const FeedBackApi = {
  getAllFeedBack: (page: number, size: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/question-and-answers?page=${page}&size=${size}&sort=id,desc`,
  updateFeedBack: (id: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/question-and-answers/${id}`,
};
