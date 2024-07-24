import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { CheckOutlined } from '@ant-design/icons'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Paging from '../../components/Paging'
import SearchStudentModal from './SearchStudentModal'
import { UploadService } from '../../services/UploadService'
import { CourseService } from '../../services/CourseService'
import { LecturerService } from '../../services/LecturerService'
import { ContextModal } from '../../Context/ModalContext'
import { StudentService } from '../../services/StudentService'
import { ContextMessage } from '../../Context/ShowMessage'
import DialogConfirm from '../common/DialogConfirm'
import { HistoryActivityService } from '../../services/HistoryActivityService'

type courseState = {
    id?: number | string
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

const PAGE_SIZE = 5 //PM HieuTM set
function ManagerUpdateClassCotainer() {
    const { pushMessage } = useContext(ContextMessage)
    const navigate = useNavigate()

    const [itemsCheck, setItemCheck] = useState<any[]>([])

    const [currentPage, setCurrentPage] = useState<any | null>(1)
    const [totalPage, setTotalPage] = useState<any>(10)
    const [searchParams] = useSearchParams()
    useEffect(() => {
        setCurrentPage(searchParams.get('page') ? searchParams.get('page') : 1)
    }, [searchParams.get('page')])
    useEffect(() => {
        if (currentPage > totalPage) {
            setCurrentPage(1)
        }
    }, [totalPage])

    const { setModal, showModal } = useContext(ContextModal)

    const d = new Date()
    const [courser, setCourse] = useState<courseState | null>({
        id: '0',
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
        department: { id: '' },
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

    const params = useParams()
    const getCourseData = async () => {
        CourseService.getCourseById(params.courseId)
            .then((res) => {
                setCourse({
                    ...courser,
                    id: res.id,
                    courseNotification: res.courseNotification,
                    courseName: res.courseName,
                    courseCode: res.courseCode,
                    courseDescription: res.courseDescription,
                    courseTotalStudent: res.courseTotalStudent,
                    courseCreatedDate: res.courseCreatedDate,
                    courseSemester: res.courseSemester,
                    courseImage: res.courseImage,
                    lecturer: { id: res.lecturer.id },
                    department: { id: res.department.id },
                })
            })
            .catch((er) => {})
    }

    const [listStudent, setListStudent] = useState<any[]>([])
    const getCourseStudents = async () => {
        StudentService.getStudentsByCourseId(params.courseId, currentPage - 1, PAGE_SIZE)
            .then((res) => {
                setListStudent(res.content)
                setTotalPage(res.totalPages)
            })
            .catch((error) => {})
    }

    useEffect(() => {
        getCourseData()
        // getCourseStudents()
    }, [])
    useEffect(() => {
        getCourseStudents()
    }, [currentPage])

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

    // handle submit
    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (!(courser.courseName && courser.courseSemester && courser.lecturer.id && courser.department.id)) {
            pushMessage({ type: 'WARN', title: 'Cảnh báo', message: 'Nhập các trường còn thiếu' })
            return
        }
        if (file) {
            const formdata = new FormData()
            formdata.append('file', file)
            UploadService.uploadFile(formdata)
                .then((image) => {
                    CourseService.putCourse(courser.id, { ...courser, courseImage: image })
                        .then(() => {
                            pushMessage({ type: 'SUCCESS', title: 'Thành công', message: 'Sửa khóa học thành công' })
                            getCourseData()
                            setFiles(null)
                            setUrlAvatar(null)
                        })
                        .catch((error) => {
                            pushMessage({ type: 'ERROR', title: 'Lỗi', message: 'Sửa khóa học thất bại' })
                        })
                })
                .catch((error) => {})
        } else {
            CourseService.putCourse(courser.id, courser)
                .then(() => {
                    pushMessage({ type: 'SUCCESS', title: 'Thành công', message: 'Sửa khóa học thành công' })
                    HistoryActivityService.postHistoryActivity({
                        method: 'PUT',
                        name: courser.courseName,
                        courses: { id: courser.id },
                    })
                        .then(() => {})
                        .catch((err) => {})
                })
                .catch((error) => {})
        }
    }

    const delCourseModal = () => {
        setModal(<DialogConfirm title="Xóa khóa học" onClick={delCourse} />)
        showModal(true)
    }

    const delCourse = () => {
        CourseService.deleteCourse(params.courseId)
            .then(() => {
                pushMessage({ type: 'SUCCESS', title: 'Thành công', message: 'Xóa khóa học thành công' })
                HistoryActivityService.postHistoryActivity({
                    method: 'DELETE',
                    name: courser.courseName,
                    // courses: {},
                })
                    .then(() => {})
                    .catch((err) => {})

                showModal(false)
                navigate(`/manager-department/${courser.department.id}`)
            })
            .catch((err) => {})
    }

    const refCheckboxs = useRef<HTMLInputElement[] | any[]>([])
    const refCheckboxAll = useRef<HTMLInputElement | null>(null)

    const listenCheckAll = () => {
        const isCheckAll = itemsCheck.length === listStudent.length
        refCheckboxAll.current!.checked = isCheckAll
    }

    useEffect(() => {
        listenCheckAll()
    }, [itemsCheck, listStudent])

    const handleCheckAll = (e: ChangeEvent<HTMLInputElement>) => {
        const isCheckAll = e.target.checked
        refCheckboxs.current.forEach((item: HTMLInputElement, index) => {
            if (isCheckAll) {
                setItemCheck([...listStudent])
            } else {
                setItemCheck([])
            }
            item.checked = isCheckAll
        })
    }

    const handleCheckItems = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const isChecked = refCheckboxs.current[index].checked
        if (isChecked) {
            setItemCheck([...itemsCheck, listStudent[index]])
        } else {
            const tempArr = itemsCheck.filter((item) => {
                return item !== listStudent[index]
            })
            setItemCheck([...tempArr])
        }
    }

    const addStudentToClass = (event: React.FormEvent<HTMLFormElement>, arrayStudent: any[]) => {
        event.preventDefault()
        const tempArr = arrayStudent.map((value) => {
            return value.id
        })

        CourseService.addStudentToCourse(params.courseId, tempArr)
            .then(() => {
                getCourseStudents()
                pushMessage({ type: 'SUCCESS', title: 'Thành công', message: 'Thêm sinh viên thành công' })
                showModal(false)
            })
            .catch((err) => {})
    }

    const refreshCourseStudentData = () => {
        refCheckboxAll.current.checked = false
        refCheckboxs.current.forEach((item) => {
            item.checked = false
        })
        setItemCheck([])
        getCourseStudents()
    }

    const delStudentModal = () => {
        setModal(<DialogConfirm title="Xóa học viên" onClick={delStudentOfCourse} />)
        showModal(true)
    }

    const delStudentOfCourse = () => {
        const tempArr = itemsCheck.map((value) => {
            return value.id
        })
        CourseService.deleteStudentOfCourse(params.courseId, tempArr)
            .then(() => {
                refreshCourseStudentData()
                showModal(false)
                pushMessage({ title: 'Thành công', type: 'SUCCESS', message: 'Xóa sinh viên thành công' })
            })
            .catch((err) => {})
    }
    const addStudent = () => {
        setModal(<SearchStudentModal courseId={params.courseId} submitFunction={addStudentToClass} />)

        showModal(true)
    }
    function goBack() {
        navigate(`/manager-department/${courser.department.id}`)
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
                <div className="w-[100%] rounded-lg">
                    <div className="p-[23px] flex border-b-[1px] border-solid border-borderColor justify-between items-center">
                        <h1 className="uppercase text-primary_blue font-bold text-xl">Khóa học</h1>
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
                                    value={courser === null ? '' : courser?.courseName}
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
                                <div className="grid grid-cols-2 rounded-[10px]  border-[1px]  p-3 border-solid border-borderColor">
                                    <div className="flex flex-col">
                                        <p>Tải lên ảnh định dạng PNG, JPEG. ( Tối đa ....mb)</p>
                                        <label
                                            htmlFor="upload_file"
                                            className="my-auto rounded-lg p-3 border-[1px] border-solid w-[120px] border-borderColor text-lg text-color63 flex items-center justify-center"
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
                                        <p>Ảnh khóa học:</p>

                                        <div className="w-[250px] h-[141px] flex items-center justify-center rounded-lg bg-[#E0E0E0]">
                                            <img
                                                className="max-w-full max-h-full object-contain"
                                                src={
                                                    urlAvatar
                                                        ? urlAvatar
                                                        : courser?.courseImage
                                                        ? courser?.courseImage
                                                        : ' '
                                                }
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br className="my-[30px]" />

                        <div className="flex-1 py-5 flex justify-end items-end">
                            <button
                                className="w-[180px] h-[50px] rounded-[10px] border border-solid border-primary text-primary text-[18px] font-medium mx-3"
                                onClick={() => {
                                    delCourseModal()
                                }}
                            >
                                Xóa khóa học
                            </button>
                            <button
                                onClick={(event) => handleSubmit(event)}
                                type="submit"
                                className="w-[180px] h-[50px] rounded-[10px] bg-light_blue text-[#fff] text-[18px] font-medium"
                            >
                                Sửa khóa học
                            </button>
                        </div>
                    </div>

                    <>
                        <div className="px-6 pt-6 pb-3">
                            <div className="pt-6 pb-3 flex justify-between items-center">
                                <h1 className="uppercase text-primary_blue font-bold text-[28px]">
                                    Danh sách sinh viên
                                </h1>

                                <div className="flex items-center text-xl">
                                    <div
                                        className="flex items-center mr-6 cursor-pointer font-medium text-primary_blue"
                                        onClick={addStudent}
                                    >
                                        <img src="\img\add_circle_outline_24px.png" className="mr-2 w-7" alt="" /> Thêm
                                    </div>
                                    <div className="flex items-center text-xl" />
                                    {itemsCheck.length > 0 && (
                                        <div
                                            className="flex items-center text-primary cursor-pointer"
                                            onClick={delStudentModal}
                                        >
                                            <img src="\img\red_delete_24px.png" className="mr-2" alt="" /> Xoá
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="w-full px-6">
                            <table className="manager_table w-full text-center text-__text_primary border-t border-solid border-[#EFEFEF]">
                                <thead>
                                    <tr className="uppercase text-lg font-bold py-12">
                                        <td>STT</td>
                                        <td>Mã sinh viên</td>
                                        <td>Tên sinh viên</td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                ref={refCheckboxAll}
                                                onChange={handleCheckAll}
                                                name=""
                                                hidden
                                                id="all_user"
                                            />
                                            <label htmlFor="all_user" className="checkbox-item">
                                                <CheckOutlined />
                                            </label>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listStudent.map((value, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                                                <td>{value.student_code}</td>
                                                <td>{value.student_fullname}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        name="user_item"
                                                        onChange={(event) => handleCheckItems(event, index)}
                                                        ref={(element) => {
                                                            refCheckboxs.current[index] = element
                                                        }}
                                                        hidden
                                                        id={`userItem_${index}`}
                                                    />
                                                    <label htmlFor={`userItem_${index}`} className="checkbox-item">
                                                        <CheckOutlined />
                                                    </label>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            {<Paging currenPage={currentPage} setCurrentPage={setCurrentPage} total={totalPage} />}
                        </div>
                    </>
                </div>
            </div>
        </>
    )
}

export default ManagerUpdateClassCotainer
