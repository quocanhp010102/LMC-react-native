import { API } from "../..";

export const NotificationApi = {
  getAllNotifications: (page?: number , size?: number): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/notifications?page=${page}&size=${size}`,
  getAllNotificationsReceiver: (page?: Number, size?: Number): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/notifications/getByReceiverId?page=${page}&size=${size}`,
  getNumberNotifycation: () =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/notifications/total-unread-notifications`,
  deleteNotification: (): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/notifications/deletes`,
  getNotificationById: (id: number): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/notifications/${id}`,
  updateNBotification: (id: number): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/notifications/updateStatus/${id}`,
  searchNotifications: (value: string , page : number , size : number): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/_search/notifications?query=${value}&page=${page}&size=${size}`,
  getNotificationUnRead: (page?: Number, size?: Number): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/notifications/receiver-unread?page=${page}&size=${size}`,
};
