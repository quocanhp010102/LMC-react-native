import { API } from "../..";
export const LessonApi = {
  getLesson: (id?: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/lessons/${id}`,
  deleteLesson: (id: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/lessons/${id}`,
  postLesson: (): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/lessons`,
  getLessonOfCourse: (id: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/lessons/getByCourse/${id}`,
  getPercentOfLesson: (id: number): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/student-lessons-by-studentId-and-lessonId/${id}`,
  submitPercentOfLesson: (id: number | string): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/student-lessons/${id}`,
  filesOfLessons: (id: number | string): string =>
    `${API.PUBLIC}services/lmsbackendtest/api/files-of-lessons/${id}`,
};
