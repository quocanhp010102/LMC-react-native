import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { CheckOutlined } from '@ant-design/icons'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Paging from '../../components/Paging'
import Modal from '../../components/Modal'
import SearchStudentModal from './SearchStudentModal'
import { UploadService } from '../../services/UploadService'
import { CourseService } from '../../services/CourseService'
import { DepartmentService } from '../../services/DepartmentService'
import { LecturerService } from '../../services/LecturerService'
import { StudentService } from '../../services/StudentService'
import { ContextModal } from '../../Context/ModalContext'
import { Department, Student } from '../../types'
import { ClassService } from '../../services/ClassService'
import { ContextMessage } from '../../Context/ShowMessage'
import * as XLSX from 'xlsx'
import DialogConfirm from './../common/DialogConfirm'
import { ContextLayout } from '../../layout/Layout'
import CalendarContainer from '../common/CalendarContainer'
import SearchStudentToClassModal from './SearchStudentToClassModal'
import { NewsService } from '../../services/NewsService'

type _Class = {
    id?: number | string
    classroomName: string
    classroomCode: string
    department: { id: number | string }
}

type _StudentClass = {
    student_id: string | number
    studentCode: string
    studentFullname: string
    classroomID: string
    classroomName: string
    classroomCode: string
    studentBirthday: string
    studentEmail: string
    studentPhone: string
}

type ClassDepartment = {
    id?: string
    classroomName?: string
    classroomCode?: string
    classroomTotalStudent?: number
    department: {
        id: string
        department_name?: string
        department_type?: string
        department_image?: string
    }
}

function ManagerAddClass() {
    const [itemsCheck, setItemCheck] = useState<any[]>([])

    const { setModal, showModal } = useContext(ContextModal)
    const [messageCode, setMessageCode] = useState<{
        isMatch: boolean
        message: string
    }>({
        isMatch: false,
        message: '',
    })

    const [department, setDepartment] = useState<Department[]>([])
    const [classItem, setClassItem] = useState<_Class>({
        department: {
            id: '',
        },
        classroomName: '',
        classroomCode: '',
    })

    const { pushMessage } = useContext(ContextMessage)

    const [listStudents, setListStudent] = useState<_StudentClass[]>([])

    const [serachParam] = useSearchParams()
    const params = useParams()
    const navigate = useNavigate()

    const [currenPage, setCurrentPage] = useState<any>(serachParam.get('page') || 1)
    const [total, setTotal] = useState<number>(1)

    const refCheckboxs = useRef<HTMLInputElement[] | any[]>([])
    const refCheckboxAll = useRef<HTMLInputElement | null>(null)

    const { AttachChidrenSideRight } = useContext(ContextLayout)

    useEffect(() => {
        AttachChidrenSideRight(<CalendarContainer />)
        ;(async () => {
            const departments = await DepartmentService.getDepartment()
            setDepartment(departments.content)
        })()
        return () => {
            showModal(false)
        }
    }, [])

    useEffect(() => {
        if (params.id || classItem.id) {
            getSudentByClass(currenPage)
        }
    }, [currenPage])

    useEffect(() => {
        if (serachParam.get('page')) {
            setCurrentPage(serachParam.get('page'))
        }
    }, [serachParam])

    useEffect(() => {
        if (params.id) {
            ClassService.getClassDetail(params.id).then(async (data: any) => {
                setClassItem(data)
            })
        }
    }, [params])

    const getSudentByClass = async (page: any) => {
        const students = await StudentService.getStudentByClass(params.id || classItem.id, { page: page - 1, size: 10 })

        setListStudent(students.content)
        setTotal(students.totalElements)
    }

    useEffect(() => {
        if (refCheckboxAll.current) {
            const isCheckAll = itemsCheck.length === listStudents.length
            refCheckboxAll.current!.checked = isCheckAll
        }
    }, [itemsCheck, listStudents])

    const handleCheckAll = (e: ChangeEvent<HTMLInputElement>) => {
        const isCheckAll = e.target.checked
        refCheckboxs.current.forEach((item: HTMLInputElement, index) => {
            if (isCheckAll) {
                setItemCheck(listStudents.map((student) => student.student_id))
            } else {
                setItemCheck([])
            }
            item.checked = isCheckAll
        })
    }

    const handleCheckItems = (id: any) => {
        let i: number
        listStudents.forEach((student, index) => {
            if (student.student_id === id) {
                i = index
            }
        })

        const isChecked = refCheckboxs.current[i].checked
        if (isChecked) {
            setItemCheck([...itemsCheck, listStudents[i].student_id])
        } else {
            const tempArr = itemsCheck.filter((item) => {
                return item !== listStudents[i].student_id
            })
            setItemCheck([...tempArr])
        }
    }

    const subMitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!messageCode.isMatch) {
            if (params.id || classItem.id) {
                // Update Class
                ClassService.updateClass(params.id || classItem.id, classItem)
                    .then(async (data) => {
                        pushMessage({
                            type: 'SUCCESS',
                            message: 'Cập nhật lớp thành công',
                            title: 'Thành công',
                        })

                        const classHistory = await NewsService.postNewToHistory({
                            method: 'PUT',
                            name: data.classroomName
                            
                        })
                    })
                    .catch((error) => {
                        pushMessage({
                            type: 'ERROR',
                            message: 'Lỗi, cập nhật lớp thất bại',
                            title: 'Thất bại',
                        })
                    })
            } else {
                // add Class

                ClassService.addClass(classItem)
                    .then(async (data: _Class) => {
                        setClassItem({
                            ...classItem,
                            id: data.id,
                        })
                        pushMessage({
                            type: 'SUCCESS',
                            message: 'Thêm lớp thành công',
                            title: 'Thành công',
                        })

                        const classHistory = await NewsService.postNewToHistory({
                            method: 'POST',
                            name: data.classroomName
                            
                        })
                    })
                    .catch((error) => {
                        pushMessage({
                            type: 'ERROR',
                            message: 'Lỗi, thêm lớp thất bại',
                            title: 'Thất bại',
                        })
                    })
            }
        } else {
        }
    }

    const resetForm = () => {
        setClassItem({
            department: {
                id: '',
            },
            classroomName: '',
            classroomCode: '',
        })
        goClassList()
    }

    const showModalStudent = () => {
        setModal(<SearchStudentToClassModal id={classItem?.id} submitFunction={pushStudentToClass} />)
        showModal(true)
    }

    const pushStudentToClass = async (event: FormEvent<HTMLFormElement>, listStudentClass: Student[]) => {
        event.preventDefault()
        const listId = listStudentClass.map((student) => student.id)
        showModal(false)
        ClassService.addSudentsToClass(classItem?.id, listId)
            .then((data) => {
                pushMessage({
                    type: 'SUCCESS',
                    message: `Thêm sinh viên vào lớp ${classItem.classroomName}`,
                    title: 'Thành công',
                })
                getSudentByClass(1)
            })
            .catch((error) => {
                pushMessage({
                    type: 'ERROR',
                    message: `Thêm sinh viên vào lớp ${classItem.classroomName}`,
                    title: 'Thất bại',
                })
            })
    }

    const readingFile = (event: ChangeEvent<HTMLInputElement>) => {
        var f = event.currentTarget.files![0]

        var reader = new FileReader()
        reader.onload = function (e) {
            var data = e.target.result
            let readedData = XLSX.read(data, { type: 'binary' })
            const wsname = readedData.SheetNames[0]
            const ws = readedData.Sheets[wsname]

            /* Convert array to json*/
            const dataParse: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 })

            dataParse.forEach((clsx: any[], index) => {
                if (clsx.length === 0) {
                    return
                }
                if (index > 0) {
                    AddClass({
                        classroomCode: clsx[1],
                        classroomName: clsx[2],
                        department: {
                            id: clsx[3],
                        },
                    })
                }
            })
            // setFileUploaded(dataParse);
        }
        reader.readAsBinaryString(f)
    }

    const AddClass = async (classDe: ClassDepartment) => {
        const data = await ClassService.addClass(classDe)
    }

    const goClassList = () => {
        if (params.id || classItem.id) {
            navigate('/manager-classes')
        } else {
            navigate(-1)
        }
    }

    const showModalDeleteStudent = () => {
        setModal(<DialogConfirm title="Xóa Sinh viên Lớp học" onClick={deleteStudentClass} />)
        showModal(true)
    }

    const deleteStudentClass = () => {
        showModal(false)
        ClassService.deleteStudentClass(params.id || classItem.id, itemsCheck)
            .then(() => {
                pushMessage({
                    title: 'Thành công',
                    message: 'Xóa sinh viên thành công',
                    type: 'SUCCESS',
                })

                const students = listStudents
                const newList = students.filter((student, index) => {
                    refCheckboxs.current[index].checked = false

                    return itemsCheck.indexOf(student.student_id) === -1
                })

                setListStudent([...newList])
                if (newList.length === 0) {
                    setCurrentPage(1)
                    getSudentByClass(1)
                }

                setItemCheck([])
            })
            .catch(() => {
                pushMessage({
                    title: 'Thất bại',
                    message: 'Xóa sinh viên thất bại',
                    type: 'ERROR',
                })
            })
    }

    const handleChangeClassCode = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.value.trim() !== '') {
            ClassService.checkClassCode(event.currentTarget.value)
                .then(() => {
                    setMessageCode({
                        isMatch: false,
                        message: '',
                    })
                })
                .catch((error) => {
                    const er = error.response
                    if (er.data === 'ClassroomCode is exist') {
                        setMessageCode({
                            isMatch: true,
                            message: 'Mã lớp đã tồn tại!',
                        })
                    }
                })
        }
    }

    return (
        <>
            <div className="flex m-6  items-center cursor-pointer" onClick={goClassList}>
                <span>
                    <img src="\img\goback.png" />
                </span>
                <span className="ml-2 uppercase text-xl text-[#636363] font-bold">Quay lại</span>
            </div>

            <div className="relative m-5  lg:h-auto rounded-lg flex border-[1px]  border-solid border-[#D4D4D4] overflow-hidden">
                <div className="lg:w-[100%] rounded-lg">
                    <div className="p-[23px] flex border-b-[1px] border-solid border-[#D4D4D4] justify-between items-center">
                        <h1 className="uppercase text-__text_primary font-bold text-xl">
                            {params.id ? 'Sửa Lớp học' : 'Thêm Lớp học'}
                        </h1>
                    </div>

                    <form onSubmit={subMitForm} className="p-[23px]">
                        <div className="grid grid-cols-2 gap-x-4">
                            <div>
                                <div className="flex flex-col">
                                    <label htmlFor="name" className="text-lg font-medium mb-2">
                                        Mã lớp học
                                    </label>
                                    <input
                                        name="classroomCode"
                                        type="text"
                                        required
                                        id="name"
                                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                            setClassItem({
                                                ...classItem,
                                                classroomCode: event.target.value.trim(),
                                            })
                                            setMessageCode({
                                                isMatch: false,
                                                message: '',
                                            })
                                        }}
                                        onBlur={handleChangeClassCode}
                                        value={classItem?.classroomCode}
                                        className="ml-auto grow w-full h-12 max-h-12 py-1.5  leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2  text-black"
                                    />
                                </div>
                                {messageCode.isMatch && (
                                    <span className="text-base text-[#FF4D48]">{messageCode.message}</span>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="name" className="text-lg font-medium mb-2">
                                    Tên lớp học
                                </label>
                                <input
                                    name="classroomName"
                                    type="text"
                                    id="name"
                                    required
                                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                        setClassItem({
                                            ...classItem,
                                            classroomName:
                                                event.target.value.charAt(0).toLocaleUpperCase() +
                                                event.target.value.slice(1),
                                        })
                                    }
                                    value={classItem?.classroomName}
                                    className="ml-auto grow w-full h-12 max-h-12 py-1.5  leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2  text-black"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 mt-6">
                            <div className="flex flex-col">
                                <label htmlFor="lecturer" className="text-lg font-medium mb-2">
                                    Chuyên ngành
                                </label>
                                <select
                                    name="department"
                                    required
                                    className="grow text-primary_blue w-full h-12 py-1.5 bg-white leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2"
                                    defaultValue={classItem?.department.id}
                                    onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                                        setClassItem({
                                            ...classItem,
                                            department: {
                                                id: event.target.value,
                                            },
                                        })
                                    }
                                >
                                    <option value="" selected className="p-2 text-primary_blue" disabled>
                                        -- Chọn Chuyên Ngành --
                                    </option>
                                    {department.map((value, index) => {
                                        return (
                                            <option
                                                selected={classItem?.department.id === value.id}
                                                className="p-2 text-primary_blue"
                                                key={index}
                                                value={value.id}
                                            >
                                                {value.department_name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 mt-6"></div>
                        <br className="my-[30px]" />

                        <div className="flex-1 py-5 flex justify-end items-end">
                            <button
                                type="reset"
                                onClick={resetForm}
                                className="w-[180px] h-[50px] rounded-[10px] border-[1px] border-solid border-text_light_blue text-primary text-lg font-medium mx-3"
                            >
                                Hủy
                            </button>
                            <button
                                // onClick={(event) => handleSubmit(event)}
                                type="submit"
                                className="w-[180px] h-[50px] rounded-[10px] bg-text_light_blue text-[#fff] text-lg font-medium"
                            >
                                {params.id || classItem.id ? 'Sửa lớp học' : 'Thêm lớp học'}
                            </button>
                        </div>
                        {!params.id && (
                            <div className="flex flex-col">
                                <label htmlFor="addClass" className="text-lg font-medium mb-2">
                                    Thêm lớp bằng file Excel
                                </label>
                                <input type="file" id="addClass" onChange={readingFile} />
                            </div>
                        )}
                    </form>

                    {classItem?.id && (
                        <>
                            <div className="px-6 pt-6 pb-3">
                                <div className="px-6 pt-6 pb-3 flex  justify-between items-center">
                                    <h1 className="uppercase text-__text_primary font-bold text-xl">
                                        Danh sách sinh viên
                                    </h1>

                                    <div className="flex items-center text-xl">
                                        <div
                                            className="flex items-center font-medium text-primary_blue mr-6 cursor-pointer"
                                            onClick={showModalStudent}
                                        >
                                            <img src="\img\icon_add_blue.png" className="mr-2 w-7" alt="" /> Thêm
                                        </div>
                                        <div className="flex items-center text-xl" />

                                        {itemsCheck.length > 0 && (
                                            <div
                                                className="flex items-center mr-6 font-medium cursor-pointer text-primary"
                                                onClick={showModalDeleteStudent}
                                            >
                                                <img src="/img/lmsDelete.png" className="mr-2" alt="delete" /> Xoá
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
                                        {listStudents.map((value: _StudentClass, index: any) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{10 * (currenPage - 1) + index + 1}</td>
                                                    {/* <td>ádsadasdsadas</td>
                                                <td>ádsadasdsadas</td> */}
                                                    <td>{value?.studentCode}</td>
                                                    <td>{value?.studentFullname}</td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            name="user_item"
                                                            onChange={(event) => handleCheckItems(value?.student_id)}
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

                                {
                                    <Paging
                                        currenPage={currenPage}
                                        setCurrentPage={setCurrentPage}
                                        total={Math.ceil(total / 10)}
                                    />
                                }

                                {/* <div className="flex-1 py-5 flex justify-end items-end">
                                <button
                                    type="reset"
                                    className="w-[180px] h-[50px] rounded-[10px] border-[1px] border-solid border-[#636363] text-[#636363] text-lg font-medium mx-3"
                                >
                                    Huỷ
                                </button>
                                <button
                                    onClick={(event) => handleSubmit(event)}
                                    type="submit"
                                    className="w-[180px] h-[50px] rounded-[10px] bg-[#636363] text-[#fff] text-lg font-medium"
                                >
                                    Cập nhật
                                </button>
                            </div> */}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default ManagerAddClass
