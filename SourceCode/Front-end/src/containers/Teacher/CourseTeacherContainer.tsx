import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckOutlined } from '@ant-design/icons'
import Paging from '../../components/Paging'
import { ContextLayout } from '../../layout/Layout'
import { CourseService } from './../../services/CourseService'
import SekeletonTable from '../../components/SekeletonTable'
import Loading from '../../components/Loading'

const SIZE = 10
function CourseTeacherContainer() {
    const [searchParams] = useSearchParams()
    const [courses, setCourses] = useState([])
    const [currenPage, setCurrentPage] = useState<any | null>(searchParams.get('page') || 1)
    const [settingModal, setSettingModal] = useState(false)
    const [total, setTotal] = useState<number>(1)
    const [searchText, setSearchText] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)


    const navigate = useNavigate()
    const { AttachChidrenSideRight } = useContext(ContextLayout)
    useEffect(() => {
        AttachChidrenSideRight(null)
    }, [])

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchText !== null) {
                if (searchText !== '') {
                    getBySearchText(searchText, 1)
                } else {
                    getCourseByPage(+currenPage)
                }
            }
        }, 1000)

        return () => {
            clearTimeout(timeout)
        }
    }, [searchText])

    useEffect(() => {
        if (searchParams.get('page')) {
            const page = searchParams.get('page')
            setCurrentPage(+page)
        }
    }, [searchParams])

    useEffect(() => {
        if (searchText !== null && searchText !== '') {
            getBySearchText(searchText, +currenPage)
        } else {
            getCourseByPage(+currenPage)
        }
    }, [currenPage])

    const getCourseByPage = async (page: any) => {
        setIsLoading(true)
        CourseService.getCourseByLecture({ page: page - 1, size: SIZE, sort: 'id,desc' })
            .then((data) => {
                setCourses(data.content)
                setTotal(data.totalElements)
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
            })
    }

    const getBySearchText = async (text: string, page: any) => {
        setIsLoading(true)
        CourseService.searchCourseByLecturer(text, {
            page: page - 1,
            size: SIZE,
            sort: 'id,desc',
        })
            .then((data) => {
                setCourses(data.content)
                setTotal(data.totalElements)
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
            })
    }


    const searchByKeyWord = (event:ChangeEvent<HTMLInputElement>)=> {
        setIsLoading(true);
        setSearchText(event.currentTarget.value.trim());
}

    return (
        <div className="w-full h-auto">
            {/* Thanh tiêu đề và tìm kiếm */}
            <div className="my-[29px] flex flex-row w-full justify-between items-center relative">
                <div className="ml-[18px]">
                    <h1 className="text-[28px] font-[700] text-primary_blue"> DANH SÁCH KHÓA HỌC</h1>
                </div>

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
                        placeholder="Tìm kiếm khóa học"
                    />
                </div>
            </div>
            {/* Table hiển thị dữ liệu*/}
            <div className="w-full">
                <table className="manager_table w-full text-center border-2 border-solid border-[#6363631a]">
                    <thead className="uppercase text-[18px] font-[700]">
                        <tr>
                            <td className="w-[5%]   ">STT</td>

                            <td className="w-auto">Tên khóa học</td>

                            <td className="w-[11%]">Ngày tạo lập</td>

                            <td className="w-[14%]">Giảng viên</td>

                            <td className="w-[10%]">Sĩ số</td>

                            <td className="w-[13%]">Số bài giảng</td>

                            <td className="w-[13%]">Số bài thi</td>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={7}>
                                    <Loading size={26} />
                                </td>
                            </tr>
                        ) : (
                            courses &&
                            courses.map((value: any, index: number) => {
                                return (
                                    <tr key={value?.id}>
                                        <td>{(SIZE)*(currenPage - 1) + index + 1}</td>
                                        <td>
                                            <Link to={`/teacher-course/${value.id}`}>{value?.courseName}</Link>{' '}
                                        </td>
                                        <td>{value?.courseCreatedDate}</td>
                                        <td>{value?.lectureName}</td>
                                        <td>{value?.totalStudent}</td>
                                        <td>{value?.courseToTalLesson}</td>
                                        <td>{value?.courseTotalExams}</td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>

                {<Paging currenPage={currenPage} setCurrentPage={setCurrentPage} total={Math.ceil(total / SIZE)} />}
            </div>
        </div>
    )
}

export default CourseTeacherContainer
