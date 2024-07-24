import {API} from "../..";

export const ExamsApi = {
    getExamById: (id: number): string =>
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/exams/${id}`,
    postExam: (): string =>
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/exams`,
    getExamsOfCourse: (id: number): string =>
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/exams/course/${id}`,
    postSubmit: (id: number): string =>
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/exams-histories`,
    getExamSubmit: (id: number): string =>
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/exams-histories/exams/${id}`,
    putSubmitStudent: (id?: number): string =>
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/student/exams-histories/${id}`,
    putSubmit: (id: number): string =>
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/lecturer/exams-histories/${id}`,
    getAllExamStudentInCourse: (idCourse: number, idStudent: number): string =>
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/exams-histories/course-student?courseId=${idCourse}&studentId=${idStudent}`,
    getExamStudentById: (idExam: number, idStudent: number): string =>
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/exams-histories/exams-student?examsId=${idExam}&studentId=${idStudent}`,
    getExamsBeforePass: (id: number): string =>
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/exams/beforePass/${id}`,
    getExamsHistory: (id: number): string =>
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/exams-histories/course-student`,
    deleteExams: (id: number): string =>
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/exams/${id}`,
    getTranscriptOfExam: (id: number): string =>
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/exams-histories/student-point/exams/${id}?sort=student_fullname,asc`,
    postExamHistory: (): string =>
        `${API.PUBLIC}services/lmstrainingmanagementtest/api/create-exams-histories`,
};
