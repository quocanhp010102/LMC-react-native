import { API } from "../..";

export const StudentApi = {
  getAllStudent: (): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/students`,
  deleteStudent: (id: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/files-of-courses/${id}`,
  postStudent: (id: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/files-of-courses/`,
  getStudentOfCourse: (id: number): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/exams-histories/student-point/exams/${id}`,
  searchStudent: (query: string): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/students/students/getStudentByNameCodeAndClass?param=${query}`,
  searchStudentNotInCourse: (id: number, query: string): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/students/getStudentNotInCourse/${id}?student_name=${query}`,
  getStudentNotInClass: (id: number): string => 
    `${API.PUBLIC}services/lmsbackendtest/api/students/getStudentNotInClassroom/${id}?student_name`,
  getStudentNotInCourse: (id: number, page?: number, size?: number , name?: string): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/students/getStudentNotInCourse/${id}?student_name=${name}`,
};
