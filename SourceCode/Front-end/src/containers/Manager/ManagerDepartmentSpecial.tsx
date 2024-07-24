import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { CheckOutlined } from '@ant-design/icons'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Paging from '../../components/Paging'
import HeaderManager from '../../components/HeaderManager'
import { CourseService } from '../../services/CourseService'
import { DepartmentService } from '../../services/DepartmentService'
import { NewsService } from '../../services/NewsService'
import { ContextLayout } from '../../layout/Layout'
import CalendarContainer from '../common/CalendarContainer'
import { ContextModal } from '../../Context/ModalContext'

type courseState = {
    id: number
    courseNotification: string
    courseName: string
    courseCode: string
    courseDescription: string | null
    courseTotalStudent: number
    courseCreatedDate: string
    courseSemester: string
    courseImage: string
    lecturer: { lecturer_fullname: string }
}
function ManagerDepartmentSpecial() {
    const [isShowAction, setIsShowAction] = useState<boolean>(false)
    const [listCourse, setListCourse] = useState<courseState[] | null>(null)
    const [currenPage, setCurrentPage] = useState<any | null>(1)
    const [totalPage, setTotlePages] = useState<number | null>(null)
    const { showModal } = useContext(ContextModal)
    const [searchParams] = useSearchParams()
    const IdParam = parseInt(useParams().id)
    const navigate = useNavigate()
    const { AttachChidrenSideRight } = useContext(ContextLayout)
    const [inputSearch, setInputSearch] = useState('')
    const TypingTimeOutRef = useRef(null)

    useEffect(() => {
        AttachChidrenSideRight(<CalendarContainer />)
        return () => {
            showModal(false)
        }
    }, [])

    useEffect(() => {
        if (searchParams.get('page')) {
            const page = searchParams.get('page')
            setCurrentPage(page)
        } else {
            setCurrentPage(1)
        }
    }, [searchParams])

    const handleAdd = () => {
        navigate(`/manager-department/${IdParam}/add-classes`)
    }
    const gotoCourseId = (id: number) => {
        navigate(`/manager-department/classes/${id}`)
    }

    const searchByKeyWord = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const value = event.target.value
        setInputSearch(value)
        navigate('')
    }

    const searchCourseInDepartment = async (id: number, query: string, page?: number, size?: number) => {
        console.log(query)
        const courses = await CourseService.searchCourseInDepartment(id, query, page, size, 'id,desc')
        if (courses) {
            const { totalPages, content, pageable, totalElements, size } = courses
            setListCourse(content)
            setTotlePages(totalPages)
        }
        // setListCourse([])
    }

    function goBack() {
        navigate(`/manager-department`)
    }

    // call api;
    const getCourseById = async (id: number, page?: number, size?: number) => {
        const courses = await CourseService.getCourseByDepartmentId(id, page, size, 'id,desc')
        if (courses) {
            const { totalPages, content, pageable, totalElements, size } = courses
            setListCourse(content)
            setTotlePages(totalPages)
        }

        return
    }
    useEffect(() => {
        const page = currenPage - 1

        if (inputSearch != '') {
            if (TypingTimeOutRef.current) {
                clearTimeout(TypingTimeOutRef.current)
            }
            TypingTimeOutRef.current = setTimeout(() => {
                searchCourseInDepartment(IdParam, inputSearch, page, 5)
            }, 500)
        } else {
            clearTimeout(TypingTimeOutRef.current)
            getCourseById(IdParam, page, 5)
        }
    }, [IdParam, currenPage, inputSearch])

    return (
        <>
            <div className="m-6 flex justify-start">
                <div className="flex items-center cursor-pointer" onClick={() => goBack()}>
                    <span>
                        <img src="\img\goback.png" />
                    </span>
                    <span className="ml-2 uppercase text-xl text-[#636363] font-bold">Quay lại</span>
                </div>
            </div>
            <div className="relative m-6 lg:h-auto rounded-lg flex border-[1px] border-solid border-[#D4D4D4] overflow-hidden">
                <div className="lg:w-[100%] rounded-lg">
                    <HeaderManager
                        isShowAction={isShowAction}
                        isShowAddAction={true}
                        handleAdd={handleAdd}
                        searchKeyWord={inputSearch}
                        searchByKeyWord={(event) => searchByKeyWord(event)}
                        title={'Khóa đào tạo của ngành'}
                    />

                    <div className="w-full">
                        <table className="manager_table w-full text-center text-__text_primary">
                            <thead>
                                <tr className="uppercase text-lg font-bold py-12">
                                    <td>STT</td>

                                    <td>TÊN KHÓA HỌC</td>

                                    <td>HỌC KÌ</td>

                                    <td>GIẢNG VIÊN HƯỚNG DẪN</td>

                                    <td>SĨ SỐ</td>
                                </tr>
                            </thead>

                            <tbody>
                                {listCourse && listCourse.length > 0 ? (
                                    listCourse.map((value, index) => {
                                        return (
                                            <tr
                                                onClick={() => gotoCourseId(value.id)}
                                                key={value.id || index}
                                                className="cursor-pointer"
                                            >
                                                <td>{index + 1}</td>
                                                <td>{value?.courseName}</td>
                                                <td>{value?.courseSemester}</td>
                                                <td>{value?.lecturer?.lecturer_fullname}</td>
                                                <td>{value?.courseTotalStudent}</td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-4">
                                            Không có khóa học nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {totalPage > 0 && (
                            <Paging currenPage={currenPage} setCurrentPage={setCurrentPage} total={totalPage} />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManagerDepartmentSpecial
