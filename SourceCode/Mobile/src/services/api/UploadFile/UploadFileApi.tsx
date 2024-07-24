import { API } from "../..";

export const UploadFileApi = {
  UploadFile: (size?: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/uploadImage`,
  UploadMultiFile: (id?: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/uploadMultipleFile`,
};
