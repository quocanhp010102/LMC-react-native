import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Paging from '../../components/Paging'
import { StudentService } from '../../services/StudentService'
import { ContextModal } from '../../Context/ModalContext'
import { ClassService } from '../../services/ClassService'
import { ContextMessage } from './../../Context/ShowMessage'
import DialogConfirm from '../common/DialogConfirm'
import { ContextLayout } from '../../layout/Layout'
import CalendarContainer from '../common/CalendarContainer'
import { HistoryActivityService } from '../../services/HistoryActivityService'

type _Class = {
    id?: number | string
    classroomCode: string
    classroomName: string
    classroomTotalStudent: string
    department: {
        id: string
        department_image: string
        department_name: string
        department_type: string
    }
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

function ManagerClassDetail() {
    const [classDetail, setClassDetail] = useState<_Class>(null)
    const [searchParams] = useSearchParams()

    const [currenPage, setCurrentPage] = useState<any>(searchParams.get('page') || 1)
    const [total, setTotal] = useState<number>(1)
    const params = useParams()
    const { AttachChidrenSideRight } = useContext(ContextLayout)

    const [listStudent, setListStudent] = useState<_StudentClass[]>([])
    const navigate = useNavigate()
    const { pushMessage } = useContext(ContextMessage)
    const { setModal, showModal } = useContext(ContextModal)

    useEffect(() => {
        if (searchParams.get('page')) {
            setCurrentPage(searchParams.get('page'))
        }
    }, [searchParams])

    useEffect(() => {
        getSudentByClass(currenPage)
    }, [currenPage])

    useEffect(() => {
        AttachChidrenSideRight(<CalendarContainer />)
        ;(async () => {
            const data: _Class = await ClassService.getClassDetail(params.id)
            setClassDetail(data)
        })()
        return () => {
            showModal(false)
        }
        // getCourseStudents()
    }, [])

    const getSudentByClass = async (page: any) => {
        const students = await StudentService.getStudentByClass(params.id, { page: page - 1, size: 10 })

        setListStudent(students.content)
        setTotal(students.totalElements)
    }

    const deleteClass = () => {
        showModal(false)
        ClassService.deleteClass([params.id])
            .then(() => {
                pushMessage({
                    type: 'SUCCESS',
                    message: 'Xóa lớp thành công',
                    title: 'Thành công',
                })
                HistoryActivityService.postHistoryActivity({
                    method: 'DELETE',
                    name: classDetail?.classroomName,
                })
                goBack()
            })
            .catch(() => {
                pushMessage({
                    type: 'ERROR',
                    message: 'Xóa lớp thất bại',
                    title: 'Thất bại',
                })
            })
    }

    const showModalDelete = () => {
        setModal(<DialogConfirm title="Xóa lớp học" onClick={deleteClass} />)
        showModal(true)
    }

    const goBack = () => {
        navigate(-1)
    }

    return (
        <>
            <div className="flex m-6  items-center cursor-pointer" onClick={goBack}>
                <span>
                    <img src="\img\goback.png" />
                </span>
                <span className="ml-2 uppercase text-xl text-[#636363] font-bold">Quay lại</span>
            </div>
            <div className="relative m-5  lg:h-auto rounded-lg border-[1px]  border-solid border-[#D4D4D4] overflow-hidden">
                <div className="lg:w-[100%] rounded-lg">
                    <div className="p-[23px] flex border-b-[1px] border-solid border-[#D4D4D4] justify-between items-center">
                        <h1 className="uppercase text-__text_primary font-bold text-xl">
                            Lớp {classDetail?.classroomCode}
                        </h1>
                    </div>

                    <div className="p-[23px]">
                        <div className="grid grid-cols-2 gap-x-4">
                            <div className="flex flex-col">
                                <label htmlFor="name" className="text-lg font-medium mb-2">
                                    Tên Lớp học
                                </label>
                                <p>{classDetail?.classroomName}</p>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="courseSemester" className="text-lg font-medium mb-2">
                                    Chuyên nghành
                                </label>
                                <p>{classDetail?.department.department_name}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 mt-6">
                            <div className="flex flex-col gap-x-4 mt-6">
                                <label htmlFor="lecturer" className="text-lg font-medium mb-2">
                                    Sĩ số
                                </label>
                                <p>{classDetail?.classroomTotalStudent ? classDetail?.classroomTotalStudent : 0}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 mt-6"></div>

                        {/* <div className="mt-[4px]">
                        <span className="text-green-700">{successNoti}</span>
                        <span className="text-red-700">{errorNoti}</span>
                    </div> */}
                        <br className="my-[30px]" />
                    </div>

                    <>
                        <div className="px-6 pt-6 pb-3">
                            <div className="px-6 pt-6 pb-3 flex  justify-between items-center">
                                <h1 className="uppercase text-__text_primary font-bold text-xl">Danh sách sinh viên</h1>
                            </div>
                        </div>

                        <div className="w-full px-6">
                            <table className="manager_table w-full text-center text-__text_primary border-t border-solid border-[#EFEFEF]">
                                <thead>
                                    <tr className="uppercase text-lg font-bold py-12">
                                        <td>STT</td>
                                        <td>Mã sinh viên</td>
                                        <td>Tên sinh viên</td>
                                        <td>Email</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listStudent.map((value, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{10 * (currenPage - 1) + index + 1}</td>
                                                {/* <td>ádsadasdsadas</td>
                                            <td>ádsadasdsadas</td> */}
                                                <td>{value.studentCode}</td>
                                                <td>{value.studentFullname}</td>
                                                <td>{value?.studentEmail}</td>
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
                            <div className="flex-1 py-5 flex justify-end items-end">
                                <button
                                    onClick={showModalDelete}
                                    className="w-[180px] h-[50px] mr-5 rounded-[10px] bg-[#fff] border-[1px] border-solid border-text_light_blue text-primary text-lg font-medium"
                                >
                                    Giải tán
                                </button>
                                <Link
                                    // onClick={(event) => handleSubmit(event)
                                    to={`/manager-classes/update/${params.id}`}
                                    className="w-[180px] h-[50px] flex justify-center items-center rounded-[10px] border-[1px] border-solid border-text_light_blue bg-text_light_blue text-[#fff] text-lg font-medium"
                                >
                                    Sửa Lớp học
                                </Link>
                            </div>
                        </div>
                    </>
                </div>
            </div>
        </>
    )
}

export default ManagerClassDetail
