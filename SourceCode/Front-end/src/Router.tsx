// import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import CoursePage from './pages/Student/CoursePage'
import CreateLessonPage from './pages/Teacher/CreateLessonPage'
import Homepage from './pages/Homepage'
import DashboardManagerUser from './pages/Manager/DashboardManagerUserPage'
import DashboardManagerClasses from './pages/Manager/DashboardManagerClassesPage'
import DashboardStudentCentral from './pages/Student/DashboardUserCentralPage'
import StudentFacultyPage from './pages/Student/StudentFacultyPage'
import ManagerNoticationPage from './pages/Manager/ManagerNoticationPage'
import ManagerNewsPage from './pages/Manager/ManagerNewsPage'
import ManagerAddNewsPage from './pages/Manager/ManagerAddNewsPage'
import CreateQuizPage from './pages/Teacher/CreateQuizPage'
import TeacherFacultyPage from './pages/Teacher/TeacherFacultyPage'
import CourseTeacherDetailPage from './pages/Teacher/CourseTeacherDetailPage'
import CourseTeacherPage from './pages/Teacher/CourseTeacherPage'
import CourseTeacherDetailStudentPage from './pages/Teacher/CourseTeacherDetailStudentPage'
import EssayExamPage from './pages/Teacher/EssayExamPage'
import EditQuizPage from './pages/Manager/EditQuizPage'
import QuizTestPage from './pages/Student/QuizTestPage'
import MarkingTestPage from './pages/Teacher/MarkingTestPage'
import EssayExamStudentPage from './pages/Student/EssayExamStudentPage'
import MultipleChoiceStudentPage from './pages/Student/MultipleChoiceStudentPage'
import UserManualPage from './pages/Manager/UserManualPage'
import ManagerRequestsPage from './pages/Manager/ManagerRequestsPage'
import DoEssayExamPage from './pages/Student/DoEssayExamPage'
import StudentUserManualPage from './pages/Student/StudentUserManualPage'
import Layout from './layout/Layout'
import ListTrainningSimple from './pages/ListTrainningSimple'
import LessonDetail from './containers/Student/LessonDetail'
import ListCourseMajors from './containers/HomeContainer/ListCourseMajors'
import ManagerDepartment from './containers/Manager/ManagerDepartment'
import ManagerUpdateClassCotainer from './containers/Manager/ManagerUpdateClassCotainer'
import ManagerClassesContainer from './containers/Manager/ManagerClassesContainer'
import CreateEssayExam from './containers/Teacher/CreateEssayExam'
import ActivityHistory from './containers/common/HistoryActivityContainer'
import NotFound from './components/Notfound'
import UserService from './services/UserService'
import { ADMIN, LECTURER, STUDENT } from './types'
import ExamsCourseContainer from './containers/Teacher/ExamsCourseContainer'
import HomeNewpage from './pages/HomeNewpage'
import TestFile from './containers/TestFile'
import ViewNews from './pages/ViewNews'
import SearchPage from './pages/SearchPage'
import ManagerClassDepartment from './containers/Manager/ManagerClassDepartment'
import ManagerClassDetail from './containers/Manager/ManagerClassDetail'
import ViewFile from './components/ViewFile'
import ManagerAddClass from './containers/Manager/ManagerAddClass'
import EssayExamStudentDetail from './containers/Student/EssayExamStudentDetail'
import ViewScoresExam from './containers/Teacher/ViewScoresExam'
import { QuestionsBank } from './containers/Teacher/QuestionsBank'

const AppRouter = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/home-new" element={<HomeNewpage />} />
                <Route path="/home-new/view/:id" element={<ViewNews />} />
                <Route path="/home-list-training" element={<ListTrainningSimple />} />
                <Route path="/home-departments/:id" element={<ListCourseMajors />} />
                <Route path="/history-activity" element={<ActivityHistory />} />

                {/* manager */}
                <Route
                    path="/manager-users"
                    element={UserService.hasRole([ADMIN]) ? <DashboardManagerUser /> : <NotFound />}
                />
                <Route
                    path="/manager-classes"
                    element={UserService.hasRole([ADMIN]) ? <ManagerClassDepartment /> : <NotFound />}
                />

                <Route
                    path="/manager-classes/add"
                    element={UserService.hasRole([ADMIN]) ? <ManagerAddClass /> : <NotFound />}
                />
                <Route
                    path="/manager-classes/update/:id"
                    element={UserService.hasRole([ADMIN]) ? <ManagerAddClass /> : <NotFound />}
                />

                <Route
                    path="/manager-classes/:id"
                    element={UserService.hasRole([ADMIN]) ? <ManagerClassDetail /> : <NotFound />}
                />
                <Route path="/search" element={<SearchPage />} />
                {/* manager */}
                <Route
                    path="/manager-users"
                    element={UserService.hasRole([ADMIN]) ? <DashboardManagerUser /> : <NotFound />}
                />

                <Route
                    path="/manager-notify"
                    element={UserService.hasRole([ADMIN]) ? <ManagerNoticationPage /> : <NotFound />}
                />
                <Route
                    path="/manager-news"
                    element={UserService.hasRole([ADMIN]) ? <ManagerNewsPage /> : <NotFound />}
                />
                <Route
                    path="/manager-news/add"
                    element={UserService.hasRole([ADMIN]) ? <ManagerAddNewsPage /> : <NotFound />}
                />
                <Route
                    path="/manager-news/edit/:id"
                    element={UserService.hasRole([ADMIN]) ? <ManagerAddNewsPage /> : <NotFound />}
                />

                <Route
                    path="/manager-request"
                    element={UserService.hasRole([ADMIN]) ? <ManagerRequestsPage /> : <NotFound />}
                />

                <Route path="/user-manual" element={UserService.hasRole([ADMIN]) ? <UserManualPage /> : <NotFound />} />
                <Route
                    path="/manager-department/*"
                    element={UserService.hasRole([ADMIN]) ? <ManagerDepartment /> : <NotFound />}
                />
                <Route
                    path="/manager-department/:id"
                    element={UserService.hasRole([ADMIN]) ? <DashboardManagerClasses /> : <NotFound />}
                />
                <Route
                    path="/manager-department/:departmentId/add-classes"
                    element={UserService.hasRole([ADMIN]) ? <ManagerClassesContainer /> : <NotFound />}
                />
                <Route
                    path="/manager-department/classes/:courseId"
                    element={UserService.hasRole([ADMIN]) ? <ManagerUpdateClassCotainer /> : <NotFound />}
                />
                {/* student */}

                <Route
                    path="/faculty/*"
                    element={
                        UserService.hasRole([STUDENT]) ? (
                            <StudentFacultyPage />
                        ) : UserService.hasRole([LECTURER]) ? (
                            <TeacherFacultyPage />
                        ) : (
                            <NotFound />
                        )
                    }
                />
                <Route path="/student-essay-exam" element={<EssayExamStudentPage />} />
                <Route path="/student-multiple-choice-exam" element={<MultipleChoiceStudentPage />} />
                <Route
                    path="/student-do-essay-exam/:id"
                    element={UserService.hasRole([STUDENT, LECTURER]) ? <DoEssayExamPage /> : <NotFound />}
                />
                <Route
                    path="/faculty/lesson-detail/:id"
                    element={UserService.hasRole([STUDENT, LECTURER, ADMIN]) ? <LessonDetail /> : <NotFound />}
                />

                <Route path="/student-exam/:id/:idCourse" element={<EssayExamStudentDetail />} />

                {/* <Route path="/student-essay-exam" element={<EssayExamStudentPage />} /> */}
                <Route
                    path="/student-do-essay-exam/:id"
                    element={UserService.hasRole([STUDENT]) ? <DoEssayExamPage /> : <NotFound />}
                />
                {/* <Route path="/student-multiple-choice-exam" element={<MultipleChoiceStudentPage />} /> */}

                <Route
                    path="/lms-help"
                    element={UserService.hasRole([STUDENT, LECTURER]) ? <StudentUserManualPage /> : <NotFound />}
                />
                <Route
                    path="/teacher-lsm-help"
                    element={UserService.hasRole([LECTURER]) ? <StudentUserManualPage /> : <NotFound />}
                />
                <Route
                    path="/questions-list"
                    element={UserService.hasRole([LECTURER]) ? <QuestionsBank /> : <NotFound />}
                />

                <Route
                    path="/faculty/courseView/:id"
                    element={UserService.hasRole([STUDENT, LECTURER, ADMIN]) ? <CoursePage /> : <NotFound />}
                />
                {/* <Route
                    path="/marking-test"
                    element={UserService.hasRole([LECTURER]) ? <MarkingTestPage /> : <NotFound />}
                /> */}

                <Route path="/test-file" element={<ViewFile url="" />} />
                {/* teacher */}
                <Route
                    path="/faculty/createLesson/:course"
                    element={UserService.hasRole([LECTURER]) ? <CreateLessonPage /> : <NotFound />}
                />
                <Route
                    path="/faculty/update-lesson/:lessonId"
                    element={UserService.hasRole([LECTURER]) ? <CreateLessonPage /> : <NotFound />}
                />

                <Route
                    path="/teacher-course"
                    element={UserService.hasRole([LECTURER]) ? <CourseTeacherPage /> : <NotFound />}
                />
                <Route
                    path="/teacher-course/:id"
                    element={UserService.hasRole([LECTURER]) ? <CourseTeacherDetailPage /> : <NotFound />}
                />
                <Route
                    path="/teacher-course/student-detail/:idCourse/:idStudent"
                    element={UserService.hasRole([LECTURER]) ? <CourseTeacherDetailStudentPage /> : <NotFound />}
                />
                <Route
                    path="/teacher-essay-exam/:id"
                    element={UserService.hasRole([LECTURER]) ? <DoEssayExamPage /> : <NotFound />}
                />
                <Route path="/create-essay-exam/:id" element={true ? <CreateEssayExam /> : <NotFound />} />
                <Route path="/edit-essay-exam/:id/:idExam" element={true ? <CreateEssayExam /> : <NotFound />} />
                <Route
                    path="/student-view-exam/:examId/:courseId"
                    element={UserService.hasRole([LECTURER, STUDENT]) ? <EssayExamPage /> : <NotFound />}
                />

                <Route path="/teacher-course/view-scores/:id" element={<ViewScoresExam />} />

                <Route
                    path="/student-exam/detail/:courseId/:examId/:studentId"
                    element={UserService.hasRole([LECTURER]) ? <EssayExamPage /> : <NotFound />}
                />

                <Route
                    path="/teacher-course/exam-course/:courseId"
                    element={UserService.hasRole([LECTURER]) ? <ExamsCourseContainer /> : <NotFound />}
                />

                <Route
                    path="/faculty/courseView/:id"
                    element={UserService.hasRole([STUDENT, LECTURER, ADMIN]) ? <CoursePage /> : <NotFound />}
                />
                <Route
                    path="/:courseId/create-quiz"
                    element={UserService.hasRole([LECTURER]) ? <CreateQuizPage /> : <NotFound />}
                />
                <Route
                    path="/:courseId/edit-quiz/:quizId"
                    element={UserService.hasRole([LECTURER]) ? <EditQuizPage /> : <NotFound />}
                />
                <Route
                    path="/:courseId/quiz-test/:quizId"
                    element={UserService.hasRole([STUDENT]) ? <QuizTestPage /> : <NotFound />}
                />

                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Layout>
    )
}
export default AppRouter
