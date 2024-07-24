import { ChangeEvent, ChangeEventHandler, FormEvent, useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ContextLayout } from '../../layout/Layout'
import { CourseService } from '../../services/CourseService'
import ListMemberCourseContainer from '../common/ListMemberCourseContainer'
import { Course, LECTURER, STUDENT, Student } from '../../types'
import { UploadService } from '../../services/UploadService'
import UserService from '../../services/UserService'
import { StudentService } from './../../services/StudentService'
import { ContextMessage } from '../../Context/ShowMessage'
import { ExamService } from '../../services/ExamService'
import { ContextModal } from './../../Context/ModalContext'
import DialogConfirm from './../common/DialogConfirm'
import { DContextProfile } from '../../Context/MyselfContext'
import { NewsService } from '../../services/NewsService'
import { FileImageOutlined } from '@ant-design/icons'
import Loading from '../../components/Loading'
import { HistoryActivityService } from '../../services/HistoryActivityService'

const CourseDetailContainer = () => {
    const slug = useParams()
    const [lessons, setLessons] = useState<Course>()
    const { AttachChidrenSideRight } = useContext(ContextLayout)
    const { pushMessage } = useContext(ContextMessage)
    const { showModal, setModal } = useContext(ContextModal)
    const { User } = useContext(DContextProfile)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        window.scrollBy(0, -document.documentElement.scrollTop)

        return () => {
            cancelRequest()
        }
    }, [])

    const cancelRequest = () => {
        const cancel = new AbortController()
        cancel.abort()
    }

    useEffect(() => {
        if (User) {
            CourseService.getCourseById(slug.id)
                .then((data: Course) => {
                    let currentStudent: any
                    data.courseStudents.forEach((student, index) => {
                        if (student?.student?.id === User?.id) {
                            currentStudent = data.courseStudents.splice(index, 1)
                            return
                        }
                    })
                    if (currentStudent) data.courseStudents = [...currentStudent].concat(data.courseStudents)
                    setLessons(data)
                    setIsLoading(false)

                    NewsService.postNewToHistory({
                        method: 'GET',
                        name: data.courseName,
                        course: {
                            id: data.id,
                        },
                    })
                })
                .catch(() => {
                    setIsLoading(false)
                })
        }
    }, [slug.id, User])

    useEffect(() => {
        if (lessons) {
            AttachChidrenSideRight(
                <ListMemberCourseContainer
                    total={+lessons.courseTotalStudent + 1}
                    lecturer={lessons.lecturer}
                    students={lessons.courseStudents}
                    currentStudent={User?.id}
                    onClick={showInfoStudent}
                />,
            )
        }
    }, [lessons])

    const showInfoStudent = (id: any) => {}

    const handlePushFileOfCourse = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files![0]?.size <= 100000000) {
            const formData = new FormData()
            formData.append('file', event.target.files![0])

            const data = await UploadService.uploadFile(formData)
            if (data) {
                const fileOfcourse = await CourseService.postFileOfCourse({
                    fileOfCoursePath: data,
                    fileOfCourseName: event.target.files![0].name,
                    course: {
                        id: slug.id,
                    },
                })

                const newCourse: Course = lessons
                newCourse.filesOfCourses = [...newCourse.filesOfCourses, fileOfcourse]
                setLessons({ ...newCourse })
                pushMessage({
                    title: 'Thành Công',
                    message: 'Thêm tệp cho khóa học thành công',
                    type: 'SUCCESS',
                })
            }
        } else {
            pushMessage({
                title: 'Cảnh báo',
                message: 'Định dạng file không quá 100M',
                type: 'WARN',
            })
        }
    }

    const deleteFileOfcourse = async (id: any) => {
        CourseService.deleteFileOfCourse(id)
            .then(() => {
                const newCourse: Course = lessons

                newCourse.filesOfCourses.forEach((file, index) => {
                    if (file.id === +id) {
                        newCourse.filesOfCourses.splice(index, 1)

                        return
                    }
                })

                setLessons({
                    ...newCourse,
                })

                pushMessage({
                    title: 'Thành Công',
                    message: 'Xóa tệp khóa học',
                    type: 'SUCCESS',
                })
            })
            .catch((error) => {
                pushMessage({
                    title: 'Thất bại',
                    message: 'Xóa tệp khóa học thất bại',
                    type: 'ERROR',
                })
            })
    }

    const deleteExamOfcourse = (id: any, name: string) => {
        ExamService.deleteExam(id)
            .then(() => {
                const newCourse: Course = lessons

                newCourse.exams.forEach((file, index) => {
                    if (file.id === id) {
                        newCourse.exams.splice(index, 1)
                        return
                    }
                })

                setLessons({
                    ...newCourse,
                })

                pushMessage({
                    title: 'Thành Công',
                    message: 'Xoá bài thi thành công',
                    type: 'SUCCESS',
                })
                HistoryActivityService.postHistoryActivity({
                    method: 'DELETE',
                    name: name,
                })
            })
            .catch((error) => {
                pushMessage({
                    title: 'Thất bại',
                    message: 'Xóa bài thi thất bại',
                    type: 'ERROR',
                })
            })

        showModal(false)
    }

    const showModalConfirm = (id: any, name: string) => {
        setModal(<DialogConfirm title="Xóa bài thi" onClick={() => deleteExamOfcourse(id, name)} />)
        showModal(true)
    }

    const goBack = () => {
        navigate('/faculty')
    }

    return (
        <div>
            <div className="w-full py-5 px-4">
                <div className="flex m-6  items-center cursor-pointer" onClick={goBack}>
                    <span>
                        <img src="\img\goback.png" />
                    </span>
                    <span className="ml-2 uppercase text-xl text-[#636363] font-bold">Quay lại</span>
                </div>
                {/* header card */}
                <div className="course-header card">
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <>
                            <h4 className="text-blue_bg uppercase font-[700] sc1920:text-[40px] sc1536:text-[40px] sc1366:text-[32px] leading-[48px] mb-[32px]">
                                {lessons?.courseName}
                            </h4>

                            <p className="text-[14px] font-medium">
                                <Link to="/faculty" className="text-color63">
                                    {UserService.hasRole([LECTURER]) ? 'Trung tâm kiểm soát' : 'Khóa học của tôi'}
                                </Link>{' '}
                                / <span className="text-color63"> {lessons?.courseName}</span>
                            </p>
                        </>
                    )}
                </div>

                <div className="course-notification card bg-lightpink">
                    <h4 className="flex items-center font-[500] text-[24px] leading-[29px] mb-[16px]">
                        <img src="/img/error_outline_24px.png" className="mr-[17px]" width={24} height={24} />
                        Thông báo chung
                    </h4>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <p className="text-[18px] leading-[22px] mb-[10px] text-justify">
                            {lessons?.courseNotification}
                        </p>
                    )}
                </div>

                <div className="course-resources card bg-lightgray">
                    <h4 className="flex items-center font-[500] text-[24px] leading-[29px] mb-[16px]">
                        <img src="\img\file_copy_24px.png" className="mr-[17px]" width={24} height={24} />
                        File đính kèm
                    </h4>
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <Loading />
                        </div>
                    ) : (
                        <div className="grid sc1920:grid-cols-6 sc1366:grid-cols-4 sc1536:grid-cols-5 gap-[21px]">
                            {/* <div className="grid grid-cols-6 gap-[21px] sc1920:w-[150px] sc1920:h-[150px] sc1536:w-[150px] sc1536:h-[150px] sc1366:w-[140px] sc1366:h-[140px]"> */}
                            {UserService.hasRole([LECTURER]) && (
                                <label
                                    htmlFor="file_of_course"
                                    className="card p-[10px] sc1366:w-[150px] sc1366:h-[150px] sc1536:w-[150px] sc1536:h-[150px] sc1920:w-[150px] sc1920:h-[150px] flex flex-col justify-between aspect-square rounded-[15px] shadow hover:shadow-lg overflow-hidden"
                                >
                                    <div className="h-4/6 flex justify-center items-center">
                                        <img src="\img\upload_24px.png" width={'40%'} />
                                    </div>
                                    <div className="h-2/6 flex items-center justify-center">
                                        <p className="text-center text-[14px] leading-[17px] overflow-hidden">
                                            Tải lên tài liệu đính kèm
                                        </p>
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handlePushFileOfCourse}
                                            id="file_of_course"
                                        />
                                    </div>
                                </label>
                            )}
                            {lessons?.filesOfCourses &&
                                lessons?.filesOfCourses.map((value: any, index: number) => {
                                    return (
                                        <div
                                            key={value?.id}
                                            className="card p-[10px]  sc1366:w-[150px] sc1366:h-[150px] sc1536:w-[150px] sc1536:h-[150px] sc1920:w-[150px] sc1920:h-[150px] relative flex flex-col justify-between aspect-square rounded-[15px] shadow hover:shadow-lg file_group"
                                        >
                                            <div className="h-4/6 flex justify-center items-center">
                                                <div className="w-[30%]"></div>
                                                <a
                                                    href={`${value?.fileOfCoursePath}`}
                                                    className="w-full flex justify-center"
                                                    target="_blank"
                                                >
                                                    {value?.fileOfCoursePath.slice(-3) === 'pdf' ? (
                                                        <img src="\img\pdf.png" width={'60%'} />
                                                    ) : value?.fileOfCoursePath.slice(-4) === 'xlsx' ? (
                                                        <img src="\img\file_excel.png" width={'60%'} />
                                                    ) : value?.fileOfCoursePath.slice(-4) === 'docx' ||
                                                      value?.fileOfCoursePath.slice(-3) === 'doc' ? (
                                                        <img src="\img\file_docx.png" width={'60%'} />
                                                    ) : value?.fileOfCoursePath.slice(-4) === 'pptx' ? (
                                                        <img src="\img\file_pp.png" width={'60%'} />
                                                    ) : (
                                                        <FileImageOutlined
                                                            className="sc1920:text-[60px] sc1366:text-[40px] sc1536:text-[50px]"
                                                            style={{ fontSize: 60, color: 'blue' }}
                                                        />
                                                    )}

                                                    {}
                                                    {}

                                                    {}
                                                </a>
                                                <div className="w-[30%] h-full flex justify-end items-start">
                                                    <a
                                                        download={`${value?.fileOfCoursePath}`}
                                                        href={`${value?.fileOfCoursePath}`}
                                                        className="relative z-10"
                                                    >
                                                        <img src="\img\upload_reverse.png" width={'100%'} />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="h-2/6 flex items-center text-ellipsis overflow-hidden ...">
                                                <p className="text-[14px] leading-[17px]">
                                                    {value.fileOfCourseName !== null &&
                                                        (value?.fileOfCourseName.length <= 32
                                                            ? value?.fileOfCourseName
                                                            : `${value?.fileOfCourseName.slice(0, 29) + '...'}`)}
                                                </p>
                                            </div>
                                            {UserService.hasRole([LECTURER]) && (
                                                <div
                                                    className="absolute cursor-pointer z-10 top-2 right-2"
                                                    onClick={() => deleteFileOfcourse(value?.id)}
                                                >
                                                    <img src="\img\delete_file.png" />
                                                </div>
                                            )}
                                            <p className="absolute bottom-[-20px] w-max file_item border-[1px] border-solid border-[#ccc] left-[50%] translate-x-[-50%]">
                                                {value.fileOfCourseName}
                                            </p>
                                        </div>
                                    )
                                })}
                        </div>
                    )}
                </div>

                {/* lesson card */}
                <div className="course-lessons card">
                    <h4 className="flex items-center font-[500] text-[24px] leading-[29px] mb-[16px]">
                        <img src="\img\class_24px.png" className="mr-[17px]" width={24} height={24} />
                        Bài giảng
                    </h4>

                    <div className="flex flex-col">
                        {UserService.hasRole([LECTURER]) && (
                            <>
                                <div className="grid grid-cols-6 gap-[21px]">
                                    <div
                                        className="relative flex flex-col items-center justify-end sc1920:w-[150px] sc1920:h-[200px] sc1536:w-[150px] sc1536:h-[200px] sc1366:w-[150px] sc1366:h-[200px]"
                                        style={{
                                            backgroundImage: 'url(/img/lesson.png)',
                                            backgroundSize: '100% 100%',
                                            aspectRatio: '3/4',
                                            backgroundRepeat: 'no-repeat',
                                        }}
                                    >
                                        <Link to={`/faculty/createLesson/${slug.id}`} className="stretched-link" />
                                        <div className="h-1/3" />
                                        <div className="h-1/3 w-full flex justify-center items-center">
                                            <img src="/img/control_point_24px.png" width={'40%'} />
                                        </div>
                                        <p className="h-1/3 flex items-center text-center text-[18px] leading-[22px]  ">
                                            Tạo bài giảng
                                        </p>
                                    </div>
                                </div>

                                <br className="my-4" />
                            </>
                        )}

                        {isLoading ? (
                            <Loading />
                        ) : (
                            <div className="grid grid-cols-4 gap-[46px]">
                                {lessons?.lessons &&
                                    lessons?.lessons.map((value: any, index: number) => {
                                        return (
                                            <Link
                                                to={`/faculty/lesson-detail/${value.id}`}
                                                className="relative flex flex-col p-[10px] text-inherit file_group"
                                                style={{
                                                    backgroundImage: 'url(/img/lesson.png)',
                                                    backgroundSize: '100% 100%',
                                                    aspectRatio: '3/4',
                                                    backgroundRepeat: 'no-repeat',
                                                }}
                                                key={value.id}
                                            >
                                                {/* <Link to="/" className="stretched-link" /> */}
                                                <div className="h-1/5 w-full flex items-start justify-start">
                                                    <span className="relative z-10 w-[8%]">
                                                        <img src="/img/error_outline_24px.png" width={'100%'} />
                                                    </span>
                                                </div>
                                                <div className="h-2/5 w-full flex justify-center items-end text-[36px] text-green text-center leading-[43px] p-[10px] text-ellipsis overflow-hidden ...">
                                                    Bài {index + 1}
                                                </div>
                                                <p className="h-2/5 flex items-center text-center text-[18px] text-[#727272] leading-[22px] p-[10px] text-ellipsis overflow-hidden ...">
                                                    {value?.lesson_name.length <= 32
                                                        ? value?.lesson_name
                                                        : value?.lesson_name.slice(0, 29) + '...'}
                                                </p>
                                                <p className="absolute bottom-[-20px] w-max rounded-lg file_item border-[1px] border-solid border-[#ccc] left-[50%] translate-x-[-50%]">
                                                    {value.lesson_name}
                                                </p>
                                            </Link>
                                        )
                                    })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="course-lessons card">
                    <h4 className="flex items-center font-[500] text-[24px] leading-[29px] mb-[16px]">
                        <img src="\img\assignment_24px.png" className="mr-[17px]" width={24} height={24} />
                        Bài thi
                    </h4>
                    <div className="flex flex-col">
                        {UserService.hasRole([LECTURER]) && (
                            <>
                                <div className="grid sc1920:grid-cols-6 sc1536:grid-cols-4 sc1366:grid-cols-4 gap-[21px]">
                                    <div
                                        className="relative flex flex-col items-center justify-end sc1920:w-[150px] sc1920:h-[200px] sc1536:w-[150px] sc1536:h-[200px] sc1366:w-[150px] sc1366:h-[200px]"
                                        style={{
                                            backgroundImage: 'url(/img/lesson.png)',
                                            backgroundSize: '100% 100%',
                                            aspectRatio: '3/4',
                                            backgroundRepeat: 'no-repeat',
                                        }}
                                    >
                                        <Link to={`/${slug.id}/create-quiz`} className="stretched-link text-inherit" />
                                        <div className="h-1/3" />
                                        <div className="h-1/3 w-full flex justify-center items-center">
                                            <img src="/img/control_point_24px.png" width={'40%'} />
                                        </div>
                                        <p className="h-1/3 flex items-center text-center text-[18px] leading-[22px]  ">
                                            Tạo bài thi trắc nghiệm
                                        </p>
                                    </div>

                                    <div
                                        className="relative flex flex-col items-center justify-end sc1920:w-[150px] sc1920:h-[200px] sc1536:w-[150px] sc1536:h-[200px] sc1366:w-[150px] sc1366:h-[200px]"
                                        style={{
                                            backgroundImage: 'url(/img/lesson.png)',
                                            backgroundSize: '100% 100%',
                                            aspectRatio: '3/4',
                                            backgroundRepeat: 'no-repeat',
                                        }}
                                    >
                                        <Link
                                            to={`/create-essay-exam/${lessons?.id}`}
                                            className="stretched-link text-inherit"
                                        />
                                        <div className="h-1/3" />
                                        <div className="h-1/3 w-full flex justify-center items-center">
                                            <img src="/img/control_point_24px.png" width={'40%'} />
                                        </div>
                                        <p className="h-1/3 flex items-center text-center text-[18px] leading-[22px]  ">
                                            Tạo bài thi tự luận
                                        </p>
                                    </div>
                                </div>

                                <br className="my-4" />
                            </>
                        )}

                        <div className="grid sc1920:grid-cols-4 sc1536:grid-cols-4 sc1366:grid-cols-3 sc1920:gap-[40px] sc1536:gap-[20px]">
                            {lessons?.exams &&
                                lessons?.exams.map((value, index) => {
                                    //   to={`/student-do-essay-exam/${value?.id}`}
                                    return (
                                        <div
                                            className="relative sc1920:w-[240px] sc1536:w-[185px] sc1366:w-[195px] pb-3"
                                            key={value?.id}
                                        >
                                            <Link
                                                className="relative flex flex-col text-inherit file_group"
                                                style={{
                                                    backgroundImage: 'url(/img/lesson.png)',
                                                    backgroundSize: '100% 100%',
                                                    aspectRatio: '3/4',
                                                    backgroundRepeat: 'no-repeat',
                                                }}
                                                to={
                                                    UserService.hasRole([STUDENT])
                                                        ? `/student-exam/${value?.id}/${slug.id}`
                                                        : value?.typeOfExams?.id == 2
                                                        ? `/edit-essay-exam/${slug.id}/${value?.id}`
                                                        : `/${slug.id}/edit-quiz/${value?.id}`
                                                }
                                            >
                                                {/* <Link to="/" className="stretched-link" /> */}
                                                <div className="h-1/5 w-full flex items-start justify-start">
                                                    <span className="relative left-2 top-2 z-10 w-[8%]">
                                                        <img src="/img/error_outline_24px.png" width={'100%'} />
                                                    </span>
                                                </div>
                                                <div className="h-2/5 w-full flex justify-center items-end text-[30px] text-green text-center leading-[43px] p-[10px] text-ellipsis overflow-hidden ...">
                                                    {value?.typeOfExams?.id === 2 ? 'Tự Luận' : 'Trắc nghiệm'}
                                                </div>
                                                <p className="h-2/5 flex items-center text-center text-[18px] leading-[22px] p-[10px] text-ellipsis overflow-hidden ...">
                                                    {value?.examName !== null &&
                                                        (value?.examName?.length <= 32
                                                            ? value?.examName
                                                            : value?.examName?.slice(0, 29) + '...')}
                                                </p>
                                                <p className="absolute bottom-[-20px] w-max rounded-lg file_item border-[1px] border-solid border-[#ccc] left-[50%] translate-x-[-50%]">
                                                    {value?.examName}
                                                </p>
                                            </Link>
                                            {UserService.hasRole([LECTURER]) && (
                                                <div
                                                    className="absolute cursor-pointer z-20 top-2 right-2"
                                                    onClick={() => showModalConfirm(value?.id, value.examName)}
                                                >
                                                    <img src="\img\delete_file.png" />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseDetailContainer
