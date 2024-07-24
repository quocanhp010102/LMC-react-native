import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UploadService } from '../../services/UploadService'
import { CourseService } from '../../services/CourseService'
import { LecturerService } from '../../services/LecturerService'
import { ContextMessage } from '../../Context/ShowMessage'
import { HistoryActivityService } from '../../services/HistoryActivityService'
import { ContextLayout } from '../../layout/Layout'
import CalendarContainer from '../common/CalendarContainer'
import { ContextModal } from './../../Context/ModalContext'

type courseState = {
    id?: number
    courseNotification: string
    courseName: string
    courseCode: string
    courseDescription: string | null
    courseTotalStudent: number
    courseCreatedDate: string
    courseSemester: string
    courseImage: string
    lecturer: { id: number | string }
    department: { id: number | string }
}

function ManagerClassesContainer() {
    const { pushMessage } = useContext(ContextMessage)
    const d = new Date()
    const navigate = useNavigate()
    const { departmentId } = useParams()
    const { AttachChidrenSideRight } = useContext(ContextLayout)
    const { showModal } = useContext(ContextModal)

    useEffect(() => {
        AttachChidrenSideRight(<CalendarContainer />)
        return () => {
            showModal(false)
        }
    }, [])

    const [courser, setCourse] = useState<courseState | null>({
        courseNotification: 'courseNotification',
        courseName: '',
        courseCode: '',
        courseDescription: 'courseDescription',
        courseTotalStudent: 0,
        courseCreatedDate: `${Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)}-${Intl.DateTimeFormat('en', {
            month: '2-digit',
        }).format(d)}-${Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)}`,
        courseSemester: '',
        courseImage: '',
        lecturer: { id: '' },
        department: { id: departmentId },
    })

    const [file, setFiles] = useState<File | null>()
    const [urlAvatar, setUrlAvatar] = useState<string | null>(null)

    const hanldeChangeFile = (events: ChangeEvent<HTMLInputElement>) => {
        const file: File = events.target.files![0]

        if (file.type.match('image/*')) {
            setUrlAvatar(URL.createObjectURL(file))
            setFiles(file)
        }
    }

    // xử lí input changes
    const handleChangeInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        event.preventDefault()
        const name = event.target.name
        const value = event.target.value
        if (name === 'lecturer') {
            setCourse({
                ...courser,
                [name]: { id: value },
            })
        } else {
            setCourse({
                ...courser,
                [name]: value,
            })
        }
    }

    // handle submit
    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (!(courser.courseName && courser.courseSemester && courser.lecturer.id && courser.department.id)) {
            pushMessage({ type: 'WARN', title: 'Cảnh báo', message: 'Nhập các trường còn trống' })
            return
        }
        if (!file) {
            pushMessage({ type: 'WARN', title: 'Cảnh báo', message: 'Chọn ảnh khóa học' })
            return
        }
        const formdata = new FormData()
        formdata.append('file', file)
        UploadService.uploadFile(formdata)
            .then((image) => {
                CourseService.postCourse({ ...courser, courseImage: image })
                    .then((res) => {
                        pushMessage({ type: 'SUCCESS', title: 'Thành công', message: 'Tạo khóa học thành công' })
                        HistoryActivityService.postHistoryActivity({
                            method: 'POST',
                            name: courser.courseName,
                            courses: { id: courser.id },
                        })
                            .then(() => {})
                            .catch((err) => {})
                        navigate(`/manager-department/classes/${res.id}`)
                    })
                    .catch((error) => {})
            })
            .catch((error) => {})
    }

    const [lecturerList, setLecturerList] = useState([])

    const getLecturer = async () => {
        LecturerService.getLecturers()
            .then((res) => {
                setLecturerList(res.content)
            })
            .catch((err) => {})
    }

    useEffect(() => {
        getLecturer()
    }, [])
    function goBack() {
        navigate(`/manager-department/${departmentId}`)
    }

    return (
        <>
            <div className="m-6 flex justify-start">
                <div className="flex items-center cursor-pointer" onClick={() => goBack()}>
                    <span>
                        <img src="\img\goback.png" />
                    </span>
                    <span className="ml-2 uppercase text-xl text-color63 font-bold">Quay lại</span>
                </div>
            </div>

            <div className="relative m-5 lg:h-auto rounded-lg flex border border-solid border-borderColor overflow-hidden">
                <div className="lg:w-[100%] rounded-lg">
                    <div className="p-[23px] flex border-b-[1px] border-solid border-borderColor justify-between items-center">
                        <h1 className="uppercase text-primary_blue font-bold text-xl">Thêm khóa học</h1>
                    </div>

                    <div className="p-[23px]">
                        <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex flex-col">
                                <label htmlFor="name" className="text-[18px] font-bold mb-2">
                                    Tên khoá học
                                </label>
                                <input
                                    name="courseName"
                                    onChange={(event) => handleChangeInput(event)}
                                    value={courser?.courseName}
                                    type="text"
                                    id="name"
                                    className="ml-auto px-2 grow w-full h-12 py-1.5 rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border text-black"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="courseSemester" className="text-[18px] font-bold mb-2">
                                    Học kỳ
                                </label>
                                <input
                                    onChange={(event) => handleChangeInput(event)}
                                    name="courseSemester"
                                    value={courser.courseSemester}
                                    type="text"
                                    id="courseSemester"
                                    className="ml-auto px-2 grow w-full h-12 py-1.5 rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border text-black"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 mt-6">
                            <div className="flex flex-col">
                                <label htmlFor="lecturer" className="text-[18px] font-bold mb-2">
                                    Giảng viên hướng dẫn
                                </label>
                                <select
                                    name="lecturer"
                                    className="ml-auto px-2 grow w-full h-12 py-1.5 bg-white rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border text-black"
                                    value={courser.lecturer.id}
                                    onChange={(event) => handleChangeInput(event)}
                                >
                                    <option key="" value={''}>
                                        Chọn giảng viên
                                    </option>

                                    {lecturerList &&
                                        lecturerList.map((value, index) => {
                                            return (
                                                <option key={index} value={value.id}>
                                                    {value.lecturer_fullname}
                                                </option>
                                            )
                                        })}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 mt-6"></div>
                        <div className="grid mt-6">
                            <div className="flex flex-col">
                                <label htmlFor="file" className="text-[18px] font-bold mb-2">
                                    Tải lên ảnh khóa học:
                                </label>
                                <div className="grid grid-cols-2 rounded-[10px]  border-[1px]  p-3 border-solid border-[#D0D0D0]">
                                    <div className="flex flex-col">
                                        <p>Tải lên ảnh định dạng PNG, JPEG. ( Tối đa ....mb)</p>
                                        <label
                                            htmlFor="upload_file"
                                            className="my-auto rounded-lg p-3 border-[1px] border-solid w-[120px] border-[#D0D0D0] text-lg   text-[#636363] flex items-center justify-center"
                                        >
                                            <img
                                                src="\img\PathUpload.png"
                                                className="w-[28px] h-[28px]"
                                                alt="upload file"
                                            />{' '}
                                            <span className="ml-1 text-primary">Tải lên</span>
                                            <input
                                                type="file"
                                                onChange={hanldeChangeFile}
                                                accept={'image/*'}
                                                hidden
                                                id="upload_file"
                                            />
                                        </label>
                                    </div>
                                    <div className="">
                                        <p>Xem trước ảnh tải lên:</p>

                                        <div className="w-[250px] h-[141px] flex items-center justify-center rounded-lg bg-[#E0E0E0]">
                                            <img
                                                className="max-w-full max-h-full object-contain"
                                                src={urlAvatar ? urlAvatar : courser.courseImage}
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <br className="my-[40px]" />

                        <div className="flex-1 py-5 flex justify-end items-end">
                            <button
                                onClick={(event) => handleSubmit(event)}
                                type="submit"
                                className="w-[180px] h-[50px] rounded-[10px] bg-light_blue text-[#fff] text-[18px] font-medium"
                            >
                                Thêm khóa học
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManagerClassesContainer
