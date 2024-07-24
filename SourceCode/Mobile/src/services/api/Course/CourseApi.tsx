import {API} from "../..";

export const CourseApi = {
    getAllCourse: (): string =>
        `${API.PUBLIC}services/lmsbackendtest/api/courses`,
    deleteFileOfCourse: (id: number): string =>
        `${API.PUBLIC}services/lmsbackendtest/api/files-of-courses/${id}`,
    postFileOfCourse: (): string =>
        `${API.PUBLIC}services/lmsbackendtest/api/files-of-courses/`,
    getFileOfCourse: (id: number): string =>
        `${API.PUBLIC}services/lmsbackendtest/api/files-of-courses/getByCourse/${id}`,
    getLessonsOfCourse: (id: number): string =>
        `${API.PUBLIC}services/lmsbackendtest/api/lessons/getByCourse/${id}`,
    getTestOfCourse: (id: number): string =>
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/exams/course/${id}`,
    getCourseById: (id: number): string =>
        `${API.PUBLIC}services/lmsbackendtest/api/courses/${id}`,
    getCourseStudent: (page: number, size: number): string =>
        `${API.PUBLIC}services/lmsbackendtest/api/course-students-percent?page=${page}&size=${size}`,
    getCourseLecturer: (page: number, size: number): string =>
        `${API.PUBLIC}services/lmsbackendtest/api/coursesByLecturersId?page=${page}&size=${size}&sort=id,desc`,
    getHistoryStudent: (): string =>
        `${API.PUBLIC}services/lmsbackendtest/api/course-students-percent-history`,
    getHistoryLecturer: (): string =>
        `${API.PUBLIC}services/lmsbackendtest/api/course-lecture-history`,
    getStudentByCourse: (id: number, page?: number, size?: number) =>
        `${API.PUBLIC}services/lmsbackendtest/api/students/getByCourse/${id}?page=${page}&size=${size}`,
    addStudent: (id: number): string =>
        `${API.PUBLIC}services/lmsbackendtest/api/course-students/insertStudent/${id}`,
    deleteStudent: (id: number) =>
        `${API.PUBLIC}services/lmsbackendtest/api/course-students/deleteStudent/${id}`,
    studentSearch: (value: number | string) =>
        `${API.PUBLIC}services/lmsbackendtest/api/course-students/searchCourseByCurrentUser?param=${value}`,
    teacherSearch: (value: number | string) =>
        `${API.PUBLIC}services/lmsbackendtest/api/coursesByLecturersIdAllField?query=${value}`,
    getAllStudentCourse: (courseId: number): string =>
        `${API.PUBLIC}services/lmsbackendtest/api/students/getAllByCourse/${courseId}`,
    getCourseInfo: (courseId: number): string =>
        `${API.PUBLIC}services/lmsbackendtest/api/courses-info/${courseId}`,
};
