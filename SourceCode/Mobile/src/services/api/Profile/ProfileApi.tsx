import { API } from "../..";
export const ProfileApi = {
  getInfoStudent: (id?: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/students/myself`,
  getInfoLecturer: (id?: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/lecturers/myself`,
  getInfoAdmin: (id?: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/admins/myself`,
  updateAvatar: (id?: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/updateAvatar`,
};
