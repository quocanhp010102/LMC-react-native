import { API } from "../..";
export const DepartmentApi = {
  getAllDepartments: (page : number , size? : number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/departments/?sort=id,desc&page=${page}&size=${size || 20}`,
  getHighlightDepartments: (): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/departments/getHighLightDepartment`,
  getBasicDepartments: (): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/departments/getByType/0`,
  getEnglishDepartments: (): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/departments/getByType/1`,
  getCoursesByDepartments: (id: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/courses/getBySubject/${id}`,
  searchDepartment: (query: string , page : number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/departments/searchDepartmentByName?department_name=${query}&page=${page}`,
  getDetailDepartment: (id: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/departments/${id}`,
  editDepartment: (id: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/departments/${id}`,
  getLecturer: (page: number, size: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/lecturers?page=${page}&size=${size}`,
  searchCourseInDepartment: (id: number, query: string): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/courses/getDetailByDepartmentAndName/${id}?name=${query}&sort=id,desc`,
  getCourseByDepartment: (id: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/courses/getByDepartment/${id}`,
};
