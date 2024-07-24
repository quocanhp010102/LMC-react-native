import { API } from "../..";
export const ClassApi = {
  getAllClass: (page?: number ,size?: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/classrooms?page=${page}&size=${size}&sort=id,desc`,
  getClassById: (id: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/classrooms/${id}`,
  searchClassroom: (value: string): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/classrooms/searchClassroomByCodeNameAndDepartment?param=${value}`,
  checkExistClassroom: (value: string): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/classrooms/checkExistClassroom?classCode=${value}`,
};
