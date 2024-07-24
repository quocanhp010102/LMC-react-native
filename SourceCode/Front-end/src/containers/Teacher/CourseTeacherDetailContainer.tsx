import React, { ChangeEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Paging from '../../components/Paging'
import { CourseService } from '../../services/CourseService/CourseService'
import { StudentService } from './../../services/StudentService'
import { useContext } from 'react'
import { ContextLayout } from '../../layout/Layout'

function CourseTeacherDetailContainer() {
    const [searchParams] = useSearchParams()
    const [currenPage, setCurrentPage] = useState<any | null>(searchParams.get('page') || 1)
    const [studentList, setStudentList] = useState<any[]>([])
    const [total, setTotal] = useState<number>(1)
    const [searchText, setSearchText] = useState<string | null>(null)
    const { id } = useParams()

    const { AttachChidrenSideRight } = useContext(ContextLayout)

    useEffect(() => {
        AttachChidrenSideRight(null)
    }, [])

    const navigate = useNavigate()

    useEffect(() => {
        if (searchParams.get('page')) {
            const page = searchParams.get('page')
            setCurrentPage(page)
        }
    }, [searchParams])

    useEffect(() => {
        if (searchText !== null && searchText !== '') {
            getBySearchText(searchText, currenPage)
        } else {
            getStudentCourse(currenPage)
        }
    }, [currenPage])

  
    const getStudentCourse = (page: any) => {
        StudentService.getSudentByCourse(id, {
            page: page - 1,
            size: 10,
        })
            .then((data) => {
                setStudentList(data.content)
                setTotal(data.totalPage)
            })
            .catch((error) => {})
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchText !== null) {
                if (searchText !== '') {
                    getBySearchText(searchText, 1)
                } else {
                    getStudentCourse(1)
                }
            }
        }, 1000)

        return () => {
            clearTimeout(timeout)
        }
    }, [searchText])

    const getBySearchText = async (text: string, page: any) => {
        const data = await StudentService.getStudentPercentCourse(id, text, {
            page: page - 1,
            size: 10,
        })
        setStudentList(data.content)
        setTotal(data.totalPage)
    }

    const goBack = () => {
        navigate(-1)
    }

    const searchByKeyWord = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.currentTarget.value.trim())
        setCurrentPage(1)
    }

    return (
        <div className="w-full h-auto">
            {/* Thanh tiêu đề và tìm kiếm */}
            <div className="flex mt-[29px] mb-[25px] ml-[27px] items-center cursor-pointer" onClick={goBack}>
                <span>
                    <img src="\img\goback.png" />
                </span>
                <span className="ml-2 uppercase text-[20px] text-[#636363] font-[700]">Quay lại</span>
            </div>

            <div className="flex flex-row mb-7 w-full ml-[27px] justify-between items-center">
                <div className="w-6/12 py-8">
                    <div className="pr-[25%] text-primary_blue">
                        <b className="text-2xl uppercase font-bold">{studentList.length > 0 && studentList[0].courseName}</b>
                    </div>
                </div>

                <Link
                    to={`/teacher-course/exam-course/${id}`}
                    className="h-[55px] w-[202px] ml-auto mr-[18px] border-solid border-2 rounded-[10px] border-slate-100 bg-primary_blue flex items-center justify-center"
                >
                    <span className="text-[18px] font-bold text-white">CHẤM ĐIỂM BÀI THI</span>
                </Link>

                <div className="relative flex grow items-center max-w-[532px] h-[55px] group mr-[99px]">
                    <svg
                        className="absolute left-0 z-20 hidden w-4 h-4 ml-[26px] text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                    </svg>
                    <input
                        type="text"
                        onChange={searchByKeyWord}
                        className="text-[18px] grow w-full h-full pl-[73px] focus:border-transparent focus:outline-none bg-[rgba(100,116,139,0.1)] focus:ring-2 ring-opacity-90 border-solid border-2 rounded-[10px]"
                        placeholder="Tìm kiếm Sinh viên"
                    />
                </div>
            </div>
            {/* Table hiển thị dữ liệu*/}
            <div className="w-full">
                <table className="manager_table w-full text-center border-2 border-solid border-[#6363631a]">
                    <thead className="uppercase text-[18px] font-[700]">
                        <tr>
                            <td className="w-[7%]">STT</td>

                            <td className="w-[25%]">MÃ SINH VIÊN</td>

                            <td className="w-auto">TÊN SINH VIÊN</td>

                            <td className="w-[22%]">TIẾN ĐỘ BUỔI HỌC (%)</td>
                        </tr>
                    </thead>
                    <tbody className="text-[18px] font-[500]">
                        {studentList &&
                            studentList.map((value: any, index: number) => {
                                return (
                                    <tr key={index}>
                                        <td> {(10)*(currenPage - 1) + index + 1}</td>
                                        <td> {value?.studentCode}</td>
                                        <td>
                                            <Link
                                                to={`/teacher-course/student-detail/${value?.courseId}/${value?.studentId}`}
                                            >
                                                {value?.studentName}
                                            </Link>
                                        </td>
                                        <td> {Math.round(value?.percent)}</td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>

                {<Paging currenPage={currenPage} setCurrentPage={setCurrentPage} total={total} />}
            </div>
        </div>
    )
}

export default CourseTeacherDetailContainer
