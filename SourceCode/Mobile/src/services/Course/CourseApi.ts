import { API } from "..";

export const CourseApi = {
  getCoursesByLecturersId: (page : number , size : number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/coursesByLecturersId?size=${size}&page=${page}&sort=id,desc`,
  getDetailCourses: (courseId: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/students/getAllStudentCourse/${courseId}`,
  getExamCreated: (courseId: number): string =>
    `${API.PUBLIC}services/lmstrainingmanagementtest/api/exams/course/${courseId}`,
  deleteCourse: (ids: string) =>
    `${API.PUBLIC}services/lmsbackendtest/api/courses/${ids}`,
  getCourseById: (ids: string) =>
    `${API.PUBLIC}services/lmsbackendtest/api/courses/${ids}`,
  searchCourses: (query: string) =>
    `${API.PUBLIC}services/lmsbackendtest/api/coursesByLecturersIdAllField?query=${query}`,
  getAllStudentCourse: (courseId: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/students/getAllStudentCourse/${courseId}`,
  searchStudentInCourse: (
    id: number,
    query: string,
    page: number,
    size: number
  ) => `${API.PUBLIC}services/lmsbackendtest/api/students/getAllStudentCourseByStudentName/${id}?query=${query}&page=${page}&size=${size}`,
};