import { API } from "../..";
export const ActivityHistoriesApi = {
  postHistories: (): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/activity-histories`,
};
