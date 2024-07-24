import { FileImageOutlined, PercentageOutlined } from '@ant-design/icons'
import { title } from 'process'
import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loading from '../../components/Loading'
import { ContextModal } from '../../Context/ModalContext'
import { DContextProfile } from '../../Context/MyselfContext'
import { ContextMessage } from '../../Context/ShowMessage'
import { ContextLayout } from '../../layout/Layout'
import { CourseService } from '../../services/CourseService'
import { CourseStudentsService } from '../../services/CourseStudentsService'
import { HistoryActivityService } from '../../services/HistoryActivityService'
import { LessonService } from '../../services/LessonService'
import { NewsService } from '../../services/NewsService'
import { UploadService } from '../../services/UploadService'
import UserService from '../../services/UserService'
import { LECTURER, Lesson, STUDENT, CourseStudent } from '../../types'
import DialogConfirm from '../common/DialogConfirm'
import ListMemberCourseContainer from '../common/ListMemberCourseContainer'

function LessonDetail() {
    const slug = useParams()
    const [lessons, setLessons] = useState<Lesson>()
    const navigate = useNavigate()
    const [listStudent, setListStudent] = useState<CourseStudent[]>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    // const {setChildrenSideRight} = useContext(ContextLayout);
    const { pushMessage } = useContext(ContextMessage)
    const { showModal, setModal } = useContext(ContextModal)
    const { User } = useContext(DContextProfile)
    const [percentLesson, setPercentLesson] = useState<number>(0)
    const [percent, setPercent] = useState<{
        id: string | number
        isDone: string | number
        percent: string | number
        lesson: {
            id: string
        }
        student: {
            id: string
        }
    }>()

    const { AttachChidrenSideRight } = useContext(ContextLayout)

    useEffect(() => {
        window.scrollBy(0, -document.documentElement.scrollTop)
    }, [])

    const handlePushFileOfLesson = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files![0].size <= 100000000) {
            const formData = new FormData()
            formData.append('file', event.target.files![0])
            const data = await UploadService.uploadFile(formData)
            if (data) {
                const fileOfLesson = await LessonService.postFileOfLesson({
                    files_path: data,
                    files_name: event.target.files![0].name,
                    lesson: {
                        id: slug.id,
                    },
                })

                const newCourse: Lesson = lessons
                newCourse.filesOfLessons.push(fileOfLesson)
                setLessons({ ...newCourse })
            }
        } else {
            pushMessage({
                title: 'Cảnh báo',
                message: 'Tệp đính kèm không quá 100MB',
                type: 'WARN',
            })
        }
    }

    const deleteFileOfcourse = async (id: any) => {
        LessonService.deleteFileOfLesson(id).then(() => {
            const newCourse: Lesson = lessons

            newCourse.filesOfLessons.forEach((file, index) => {
                if (file.id === +id) {
                    newCourse.filesOfLessons.splice(index, 1)
                    return
                }
            })
            setLessons({ ...newCourse })
        })
    }

    useEffect(() => {
        if (User) {
            ;(async () => {
                LessonService.getLessonById(slug.id).then(async (data) => {
                    setLessons(data)
                    setIsLoading(false)
                    const listStudent: any = await CourseStudentsService.getStudentsByCourse(data?.course.id)
                    let currentStudent: any
                    if (listStudent) {
                        listStudent.content.forEach((student: any, index: any) => {
                            if (student?.student?.id === User?.id) {
                                currentStudent = listStudent.content.splice(index, 1)
                                return
                            }
                        })
                    }
                    if (currentStudent) listStudent.content = [...currentStudent].concat(listStudent.content)

                    setListStudent(listStudent.content)

                    if (UserService.hasRole([STUDENT])) {
                        const ps = await LessonService.getPercentLesson(slug.id)
                        setPercentLesson(+ps?.content[0].percent)
                        setPercent({
                            id: ps?.content[0].id,
                            percent: ps?.content[0].percent,
                            isDone: 0,
                            lesson: {
                                id: ps?.content[0].lesson.id,
                            },
                            student: {
                                id: ps?.content[0].student.id,
                            },
                        })
                    }

                    NewsService.postNewToHistory({
                        method: 'GET',
                        name: data.lesson_name,
                        lesson: {
                            id: data.id,
                        },
                    })
                })
            })()
        }
    }, [slug.id, User])

    useEffect(() => {
        if (listStudent) {
            AttachChidrenSideRight(
                <ListMemberCourseContainer
                    total={listStudent.length + 1}
                    lecturer={lessons.course.lecturer}
                    students={listStudent}
                    currentStudent={User?.id}
                />,
            )
        }
    }, [listStudent])

    const deleteLesson = async () => {
        LessonService.deleteLesson(slug.id)
            .then(() => {
                showModal(false)
                pushMessage({
                    title: 'Thành công',
                    type: 'SUCCESS',
                    message: `Bài giảng đã được xóa`,
                })
                HistoryActivityService.postHistoryActivity({
                    method: 'DELETE',
                    name: lessons.lesson_name,
                })
                goBack()
            })
            .catch((error) => {
                showModal(false)
                pushMessage({
                    title: 'Thất bại',
                    type: 'ERROR',
                    message: 'Lỗi hệ thống',
                })
            })
    }

    const updateLessons = () => {
        navigate(`/faculty/update-lesson/${slug.id}`)
    }

    const confirmDelete = () => {
        setModal(<DialogConfirm title="Bạn có chắc chắn muốn xóa bài giảng này không?" onClick={deleteLesson} />)
        showModal(true)
    }

    const goBack = () => {
        navigate(`/faculty/courseView/${lessons.course.id}`)
    }

    const putPercent = () => {
        if (+percentLesson >= 0 && +percentLesson <= 100) {
            LessonService.postPercentLesson(percent?.id, {
                ...percent,
                percent: percentLesson,
            })
                .then((data) => {
                    pushMessage({
                        type: 'SUCCESS',
                        message: `Bạn đã hoàn thành ${percentLesson}% bài giảng`,
                        title: 'Thành công',
                    })

                    goBack()
                })
                .catch(() => {
                    pushMessage({
                        type: 'ERROR',
                        message: 'Lỗi hệ thống, vui lòng thử lại!',
                        title: 'Thất bại',
                    })
                })
        } else {
            pushMessage({
                type: 'WARN',
                message: 'Phần trăm bài giảng không hợp lệ!',
                title: 'Cảnh báo',
            })
        }
    }

    return (
        <div className="w-full py-5 px-4">
            <div className="flex m-6  items-center cursor-pointer" onClick={goBack}>
                <span>
                    <img src="\img\goback.png" />
                </span>
                <span className="ml-2 uppercase text-xl text-[#636363] font-bold">Quay lại</span>
            </div>
            {/* header card */}
            <div className="course-header card">
                <h4 className="text-blue_bg uppercase font-[700] text-[40px] leading-[48px] mb-[32px]">
                    {lessons?.lesson_name}
                </h4>
                <div className="font-[500] text-[14px] leading-[17px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center">
                            <Loading size={32} />
                        </div>
                    ) : (
                        <p className="text-[14px] font-medium">
                            <Link to="/faculty" className="text-color63">
                                {UserService.hasRole([LECTURER]) ? 'Trung tâm kiểm soát' : 'Khóa học của tôi'}
                            </Link>{' '}
                            /{' '}
                            <Link className="text-color63" to={`/faculty/courseView/${lessons?.course.id}`}>
                                {lessons?.course.courseName}
                            </Link>{' '}
                            / <span className="text-color63"> {lessons?.lesson_name}</span>
                        </p>
                    )}
                </div>
            </div>
            <div className="course-resources card bg-lightgray">
                <h4 className="flex items-center font-[500] text-[24px] leading-[29px] mb-[16px]">
                    <img src="\img\file_copy_24px.png" className="mr-[17px]" width={24} height={24} />
                    File đính kèm
                </h4>
                <div className="grid grid-cols-6 gap-[21px]">
                    {UserService.hasRole([LECTURER]) && (
                        <label
                            htmlFor="file_of_lesson"
                            className="card p-[10px] flex flex-col justify-between aspect-square rounded-[15px] shadow hover:shadow-lg overflow-hidden"
                        >
                            <div className="h-4/6 flex justify-center items-center">
                                <img src="\img\upload_24px.png" width={'40%'} />
                            </div>
                            <div className="h-2/6 flex items-center justify-center">
                                <p className="text-center text-[14px] leading-[17px] overflow-hidden">
                                    Tải lên tài liệu đính kèm
                                </p>
                                <input type="file" hidden onChange={handlePushFileOfLesson} id="file_of_lesson" />
                            </div>
                        </label>
                    )}
                    {isLoading ? (
                        <div className="flex w-full justify-center items-center">
                            <Loading size={32} />
                        </div>
                    ) : (
                        lessons?.filesOfLessons.map((value: any, index: number) => {
                            return (
                                <div
                                    key={index}
                                    className="card p-[10px] relative file_group flex flex-col justify-between aspect-square rounded-[15px] shadow hover:shadow-lg"
                                >
                                    {/* <div
                                                className="stretched-link"  > */}
                                    <div className="h-4/6 flex justify-center items-center">
                                        <div className="w-[30%] h-full flex justify-end items-start">
                                            <a
                                                download="FileBaigiang.png"
                                                href={`${value?.files_path}`}
                                                target="_blank"
                                                className="relative z-10"
                                            >
                                                <img src="\img\upload_reverse.png" width={'100%'} />
                                            </a>
                                        </div>
                                        <a
                                            href={`${value?.files_path}`}
                                            className="w-full flex justify-center items-center"
                                            target="_blank"
                                        >
                                            {value?.files_path.slice(-3) === 'pdf' ? (
                                                <img src="\img\pdf.png" width={'60%'} />
                                            ) : value?.files_path.slice(-4) === 'xlsx' ? (
                                                <img src="\img\file_excel.png" width={'60%'} />
                                            ) : value?.files_path.slice(-4) === 'docx' ||
                                              value?.files_path.slice(-3) === 'doc' ? (
                                                <img src="\img\file_docx.png" width={'60%'} />
                                            ) : value?.files_path.slice(-4) === 'pptx' ? (
                                                <img src="\img\file_pp.png" width={'60%'} />
                                            ) : (
                                                <FileImageOutlined style={{ fontSize: 60, color: 'blue' }} />
                                            )}
                                        </a>
                                        <div className="w-[30%]"></div>
                                    </div>
                                    <div className="h-2/6 overflow-hidden">
                                        <p className=" text-[14px] leading-[17px]">
                                            {value.files_name !== null &&
                                                (value?.files_name <= 38
                                                    ? value
                                                    : `${value?.files_name.slice(0, 38)}...`)}
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

                                    <p className="absolute bottom-[-20px] file_item border-[1px] border-solid border-[#ccc] left-[50%] translate-x-[-50%]">
                                        {value.files_name}
                                    </p>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
            <div className="course-notification card bg-lightpink">
                <h4 className="flex items-center font-[500] text-[24px] leading-[29px] mb-[16px]">
                    <img src="/img/error_outline_24px.png" className="mr-[17px]" width={24} height={24} />
                    Thông báo chung
                </h4>
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <Loading size={32} />
                    </div>
                ) : (
                    <p className="text-[18px] leading-[22px] mb-[10px] text-justify">{lessons?.lesson_notification}</p>
                )}
            </div>

            {/* lesson card */}
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <Loading size={32} />
                </div>
            ) : (
                lessons &&
                lessons.lesson_content && (
                    <div className="course-lessons card">
                        <pre className="whitespace-pre-wrap">
                            <div
                                className="jsx-parser"
                                dangerouslySetInnerHTML={{ __html: lessons?.lesson_content }}
                            ></div>
                        </pre>
                    </div>
                )
            )}
            {lessons && lessons.lesson_file && (
                <div className="card p-[10px] w-[200px] h-[150px ] relative file_group flex flex-col items-center justify-between aspect-square rounded-[15px] shadow hover:shadow-lg">
                    <a
                        href={`${lessons.lesson_file}`}
                        className="w-[100px] mt-4 flex justify-center items-center"
                        target="_blank"
                    >
                        {lessons.lesson_file.slice(-3) === 'pdf' ? (
                            <img src="\img\pdf.png" width={'60%'} />
                        ) : lessons.lesson_file.slice(-4) === 'xlsx' ? (
                            <img src="\img\file_excel.png" width={'60%'} />
                        ) : lessons.lesson_file.slice(-4) === 'docx' || lessons.lesson_file.slice(-3) === 'doc' ? (
                            <img src="\img\file_docx.png" width={'60%'} />
                        ) : lessons.lesson_file.slice(-4) === 'pptx' || lessons.lesson_file.slice(-3) === 'ppt' ? (
                            <img src="\img\file_pp.png" width={'60%'} />
                        ) : (
                            <FileImageOutlined style={{ fontSize: 60, color: 'blue' }} />
                        )}
                    </a>

                    <div className="h-2/6 mt-2 overflow-hidden">
                        <p className=" text-[14px] leading-[17px]">Tệp bài giảng</p>
                    </div>
                </div>
            )}

            {UserService.hasRole([STUDENT]) && (
                <div className="flex mt-[50px] justify-between  items-baseline">
                    <div className="flex items-baseline">
                        <p className="mr-2 text-xl text-[#636363] font-bold">
                            Bạn học xong chưa, bạn hiểu bài bao nhiêu phần trăm:{' '}
                        </p>
                        <input
                            type="number"
                            className="w-[50px] leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2"
                            value={percentLesson}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setPercentLesson(+event.target.value)}
                        />
                        <p className="ml-2 text-xl text-[#636363] font-bold">%</p>
                    </div>

                    {PercentageOutlined !== undefined && percentLesson !== 0 && (
                        <div className="px-6 py-[7px] rounded-[8px] bg-text_light_blue text-[#fff] text-lg font-medium">
                            <button onClick={putPercent}>Submit</button>
                        </div>
                    )}
                </div>
            )}

            {UserService.hasRole([LECTURER]) && (
                <div className="flex justify-end">
                    <button
                        className="px-6 py-[14px] rounded-[10px] border-[1px] border-solid border-[#636363] text-[#636363] text-lg font-medium mx-3"
                        onClick={confirmDelete}
                    >
                        Xóa
                    </button>
                    <button
                        onClick={updateLessons}
                        className="px-6 py-[14px] rounded-[10px] bg-primary_blue text-[#fff] text-lg font-medium"
                    >
                        Sửa
                    </button>
                </div>
            )}
        </div>
    )
}

export default LessonDetail
