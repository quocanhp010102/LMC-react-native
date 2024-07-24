import {API} from "../..";

export const QuestionsBankApi = {
    getAllQuestionsBank: (page: number, size: number): string =>
        `${API.PUBLIC}services/lmsquestionbanktest/api/question-banks?page=${page}&size=${size}&sort=id,desc`,
    questionsBank: (): string =>
        `${API.PUBLIC}services/lmsquestionbanktest/api/question-banks`,
    getQuestionsBankById: (id: number): string =>
        `${API.PUBLIC}services/lmsquestionbanktest/api/question-banks/${id}`,
    filterQuestionsBank: (
        departmentId: any,
        courseId: any,
        type: number,
        questionName: string,
        page: number,
        size: number
    ): string =>
        `${API.PUBLIC}services/lmsquestionbanktest/api/question-banks-by-filter?${
            questionName ? "questionName=" + questionName + "&" : ""
        }${departmentId ? "departmentId=" + departmentId + "&" : ""}${
            courseId ? "courseId=" + courseId + "&" : ""
        }${
            typeof type == "number" ? "questionType=" + type + "&" : ""
        }page=${page}&size=${size}&sort=id,desc`,
};
