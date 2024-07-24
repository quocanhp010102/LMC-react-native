import { FileProtectOutlined } from '@ant-design/icons'
import React, { ChangeEvent, FormEvent, useContext, useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TextEditor from '../../components/TextEditor'
import { ContextMessage } from '../../Context/ShowMessage'
import { ContextLayout } from '../../layout/Layout'
import { CourseService } from '../../services/CourseService'
import { LessonService } from '../../services/LessonService'
import { NewsService } from '../../services/NewsService'
import { UploadService } from '../../services/UploadService'
import { Course, Lesson } from '../../types'
import ListMemberCourseContainer from '../common/ListMemberCourseContainer'

type LessonType = {
    lesson_name: string
    lesson_notification: string
    lesson_content: string
    lesson_file?: string
    timeStart?: string
    timeEnd?: string
    course: {
        id: string | number
    }
}

const LessonCreateContainer: React.FC = (props) => {
    const [inputData, setInputData] = useState<Lesson>({
        lesson_name: '',
        lesson_notification: '',
        lesson_content: null,
        lesson_file: null,
        timeStart: null,
        timeEnd: null,
        course: {
            id: '',
        },
    })

    const [courseByLesson, setCourse] = useState<Course>()

    const params = useParams()
    const navigate = useNavigate()

    const [isShowModal, setShowModal] = useState<boolean>(false)

    const [lessonFile, setlessonFile] = useState<File>()
    const { pushMessage } = useContext(ContextMessage)
    const [fileUpdate, setFileUpdate] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const {AttachChidrenSideRight} = useContext(ContextLayout);

    useEffect(() => {
        window.scrollBy(0, -document.documentElement.scrollTop)
    }, [])

    useEffect(() => {
        if (params.course) {
            setInputData({
                ...inputData,
                course: {
                    id: params.course,
                },
            })
            getCourse(params.course);
        }
    }, [params.course])

    const getCourse =  async (id)=> {
        const course: Course = await CourseService.getCourseById(id)
        setCourse(course)
    }

    useEffect(() => {
      if(courseByLesson) {
          AttachChidrenSideRight(
              <ListMemberCourseContainer
                  onClick={()=>{}}
                  students={courseByLesson?.courseStudents}
                  lecturer={courseByLesson?.lecturer}
                  total={courseByLesson?.courseTotalStudent}
              />,
          )
      }
    }, [courseByLesson])

    useEffect(() => {
        if (params.lessonId) {
            ;(async () => {
                const lessonUpdate: any = await LessonService.getLessonById(params.lessonId)

                setInputData({
                    id: lessonUpdate.id,
                    lesson_name: lessonUpdate.lesson_name,
                    lesson_notification: lessonUpdate.lesson_notification,
                    lesson_content: lessonUpdate.lesson_content,
                    timeEnd: lessonUpdate.lesson_timeStart,
                    timeStart: lessonUpdate.timeStart,
                    lesson_file: lessonUpdate.lesson_file,
                    course: {
                        id: lessonUpdate.course.id,
                    },
                })

                

                setCourse(lessonUpdate.course)
                setContent(lessonUpdate.lesson_content)
                setFileUpdate(lessonUpdate.lesson_file)
                getCourse(lessonUpdate.course.id);
            })()
        }
    }, [params.lessonId])

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value })
    }
    const handleChangeFiles = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target
        if(files![0].size <= 100000000) {
            setlessonFile(files[0])
            setFileUpdate("")

        }else {
            pushMessage({
                title: "Cảnh bảo",
                message: "Tệp bài giảng không quá 100MB",
                type: "WARN"
            })
        }

        setlessonFile(files[0])
    }

    const handleCancel = () => {
        navigate(-1)
    }
    const handleSubmit = async () => {
        let urlFile
        if (lessonFile) {
            const formData = new FormData()
            formData.append('file', lessonFile)
            urlFile = await UploadService.uploadFile(formData)
            setlessonFile(null)
        }
        let data: Lesson

        if (params.lessonId) {
            LessonService.updateLesson(params.lessonId, {
                ...inputData,
                lesson_content: content,
                lesson_file: urlFile ? urlFile : inputData.lesson_file,
            })
                .then((lesson) => {
                    pushMessage({
                        type: 'SUCCESS',
                        title: 'Thành công',
                        message: 'Sửa bài giảng thành công',
                    })

                    NewsService.postNewToHistory({
                        method: 'PUT',
                        name: lesson.lesson_name,
                        lesson: {
                            id: lesson.id,
                        },
                    })
                    navigate(`/faculty/lesson-detail/${lesson.id}`)
                })
                .catch(() => {
                    pushMessage({
                        type: 'ERROR',
                        title: 'Thất bại',
                        message: 'Lỗi hệ thống',
                    })
                })
        } else {
            LessonService.postLessons({
                ...inputData,
                lesson_content: content,
                lesson_file: urlFile ? urlFile : null,
            })
                .then((lesson) => {
                    data = lesson
                    pushMessage({
                        type: 'SUCCESS',
                        title: 'Thành công',
                        message: 'Thêm bài giảng thành công',
                    })

                    NewsService.postNewToHistory({
                        method: 'POST',
                        name: lesson.lesson_name,
                        lesson: {
                            id: lesson.id,
                        },
                    })
                    navigate(`/faculty/lesson-detail/${lesson.id}`)
                })
                .catch(() => {
                    pushMessage({
                        type: 'ERROR',
                        title: 'Thất bại',
                        message: 'Lỗi hệ thống',
                    })
                })
        }

        setInputData(null)
    }

    const showModal = () => {
        setShowModal(!isShowModal)
    }

    const goBack = () => {
        navigate(-1)
    }

    const getSourceIconFile = (fileType: string) => {
        let sourceIcon = ''
        switch (fileType) {
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                sourceIcon = '/img/file_docx.png'
                break
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                sourceIcon = '/img/file_excel.png'
                break
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                sourceIcon = '/img/file_pp.png'
                break
            case 'application/pdf':
                sourceIcon = '/img/pdf.png'
                break
            default:
                sourceIcon = '/img/file.png'
        }
        return sourceIcon
    }
    

    return (
        <div className="w-full p-[23px]">
            <div className="flex items-center cursor-pointer mb-[23px]" onClick={goBack}>
                <span>
                    <img src="\img\goback.png" />
                </span>
                <span className="ml-2 uppercase text-[20px] text-[#636363] font-bold">Quay lại</span>
            </div>
            {/* header card */}
            <div className="course-header card">
                <h4 className="text-blue_bg uppercase font-[700] text-[32px] sc1536:text-[38px] sc1920:text-[40px] mb-[32px]">
                    {courseByLesson?.courseName}
                </h4>
                <p className="text-[14px] font-medium">
                <Link to="/faculty" className='text-color63'>Trung tâm kiểm soát</Link>  / <Link to={`/faculty/courseView/${params.course ? params.course : inputData?.course.id}`}  className='text-color63'>{courseByLesson?.courseName}</Link> 

                </p>
            </div>

            {/* create card */}
            <div className="course-create card">
                <div className="mb-[34px]">
                    <label htmlFor="name" className="input-title">
                        Tên bài giảng <span>*</span>
                    </label>
                    <input
                        className="text-input w-full focus:border-transparent focus:outline-none focus:ring-2"
                        type={'text'}
                        id="name"
                        name="lesson_name"
                        value={inputData?.lesson_name}
                        onChange={handleChangeInput}
                    />
                </div>
                <div className="mb-[34px]">
                    <label htmlFor="notification" className="input-title">
                        Thông báo chung <span>*</span>
                    </label>
                    <input
                        className="text-input w-full focus:border-transparent focus:outline-none focus:ring-2"
                        type={'text'}
                        id="notification"
                        name="lesson_notification"
                        value={inputData?.lesson_notification}
                        onChange={handleChangeInput}
                    />
                </div>
                <div className="mb-[34px]">
                    <label htmlFor="content" className="input-title">
                        Nội dung bài giảng <span>*</span>
                    </label>
                    <TextEditor
                        value={content || ''}
                        onChange={(value) =>
                           setContent(value)
                        }
                    />
                </div>

                <div className="mb-[34px]">
                    <p className="input-title">Đính kèm bài giảng có sẵn</p>
                    <div className="card">
                        <div className="flex items-baseline mb-[22px]">
                            <input
                                id="filesInput"
                                accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf"
                                type={'file'}
                                onChange={handleChangeFiles}
                                hidden
                            />
                            <label
                                htmlFor="filesInput"
                                onClick={showModal}
                                className="w-[124px] h-[42px] flex items-center justify-center border border-solid border-[rgba(125,125,125,0.5)] rounded-[10px] shadow-[0_2px_2px_rgba(0,0,0,0.15)]"
                            >
                                 <img src="\img\PathUpload.png" className='w-[20px] h-[20px]' alt="upload file" />{' '}
                                <span className="text-[18px] font-[500] ml-[12px] text-primary">Tải lên</span>
                            </label>
                            <span className="text-[14px] ml-[12px]">Tải lên bài giảng, video bài giảng.</span>
                        </div>
                        {fileUpdate !== "" ? (
                                    <div className="w-[150px] flex flex-col p-[10px] pt-[22px] border aspect-square rounded-[15px] shadow-[0_2px_2px_rgba(0,0,0,0.15)] overflow-hidden">
                                    <div className="flex justify-center items-center mb-[8px]">
                                                 <FileProtectOutlined style={{ fontSize: 70, color: "blue" }} />
                                    </div>
                                    <div className="flex items-center justify-center overflow-hidden">
                                    <p className="text-center break-all text-[14px]">Tệp bài giảng</p>
                                </div>
                                    </div>
                        ) : (lessonFile ? (
                            <div className="w-[150px] flex flex-col p-[10px] pt-[22px] border aspect-square rounded-[15px] shadow-[0_2px_2px_rgba(0,0,0,0.15)] overflow-hidden">
                                <div className="flex justify-center items-center mb-[8px]">
                                    <img src={getSourceIconFile(lessonFile.type)} width={'53px'} height={'60px'} />
                                </div>
                                <div className="flex items-center justify-center overflow-hidden">
                                    <p className="text-center break-all text-[14px]">{lessonFile.name.slice(0, 30)}</p>
                                </div>
                            </div>
                        ) : (
                            ''
                        ))}
                    </div>
                </div>

                <div className="flex justify-end mb-[34px]">
                    <button
                        className="border border-solid px-[25px] rounded-[10px] py-[14px] text-[18px] mr-[13px] border-text_light_blue text-primary"
                        onClick={handleCancel}
                    >
                        Hủy bài giảng
                    </button>
                    <button
                        className="border border-solid px-[25px] rounded-[10px] py-[14px] text-[18px] mr-[13px] bg-text_light_blue text-white"
                        onClick={handleSubmit}
                    >
                       {params.lessonId ? "Sửa bài giảng" : "Lưu bài giảng"}  
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LessonCreateContainer
