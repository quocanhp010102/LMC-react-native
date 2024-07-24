import clsx from 'clsx'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { SidebarContext } from '../../App'
import Faculty from '../../components/Faculty'
import { ContextLayout } from '../../layout/Layout'
import { CourseStudentsService } from '../../services/CourseStudentsService'
import CalendarContainer from '../common/CalendarContainer'
import { CourseByStudent } from '../../types'
import Paging from '../../components/Paging'
import { useSearchParams } from 'react-router-dom'
import Loading from '../../components/Loading'
import { ContextModal } from '../../Context/ModalContext'

type props = {}
const SIZE = 12

function StudentFaculty({}: props) {
    const { AttachChidrenSideRight } = useContext(ContextLayout)
    const [courses, setCourses] = useState<CourseByStudent[]>([])
    const [searchText, setSearchText] = useState<string>(null)
    const [searchParam] = useSearchParams()
    const [currenPage, setCurrenPage] = useState<any>(searchParam.get('page') || 1)
    const [total, setTotal] = useState<number>(1)
    const [isShowLoadingHistory, setIsShowLoadingHistory] = useState<boolean>(true)
    const [isShowLoadingCourse, setIsShowLoadingCourse] = useState<boolean>(true)

    const [courseHistory, setCourseHistory] = useState<any[]>([])

    const { collapsed } = useContext(SidebarContext)
    const {showModal} = useContext(ContextModal)

    useEffect(() => {
        ;(async () => {
            CourseStudentsService.getCourseStudentHistory()
                .then((data) => {
                    setCourseHistory(data)
                    setIsShowLoadingHistory(false)
                })
                .catch(() => {
                    setIsShowLoadingHistory(false)
                })
        })()

        AttachChidrenSideRight(<CalendarContainer />)
        return ()=> {
            showModal(false);
        }
    }, [])

    useEffect(() => {
        const page = searchParam.get('page')
        if (page) {
            setCurrenPage(page)
        }
    }, [searchParam])

    useEffect(() => {
        setIsShowLoadingCourse(true)
        if (searchText !== null && searchText !== '') {
            searchByText(searchText, currenPage)
        } else {      
            getCourseStudent(currenPage)
        }
    }, [currenPage])

    const getCourseStudent = async (page: any) => {
        CourseStudentsService.getCourseStudents({ page: page - 1, size: SIZE }).then((data) => {
            setCourses(data.content)
            setTotal(data.totalElements)
        })
        setIsShowLoadingCourse(false)
    }

    useEffect(() => {
        let timeOut: any
        if (searchText !== null) {
            if (searchText !== '') {
                timeOut = setTimeout(() => {
                    searchByText(searchText, 1)
                }, 1000)
            } else {
                getCourseStudent(currenPage)
            }
        }

        return () => {
            clearTimeout(timeOut)
        }
    }, [searchText])

    const searchByText = async (text: any, page: any) => {
        CourseStudentsService.searchCourseByStudent(text, {
            page: page - 1,
            size: SIZE,
        })
            .then((data) => {
                setCourses(data.content)
                setTotal(data.totalElements)
                setIsShowLoadingCourse(false)
            })
            .catch(() => {
                setIsShowLoadingCourse(false)
            })
    }

    const searchByKeyWord = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value.trim())
        setIsShowLoadingCourse(true)
    }

    return (
        <div
            className={clsx(
                'w-full sc1920:pl-[44px] sc1536:pl-[27px] sc1366:pl-[10px] sc1920:pr-[10px] sc1536:pr-[20px] sc1366:pr-[15px] lg:h-auto flex transition-all duration-500',
                {
                    'sc1920:pr-[23px] sc1536:pr-[23px] sc1366:pr-[10px]': collapsed,
                },
            )}
        >
            <div className="dashboard-content lg:w-[100%] pb-[123px]">
                <div className="flex justify-between items-center">
                    <h1 className="sc1920:text-[28px] sc1536:text-[28px] sc1366:text-[24px] font-semibold text-blue_bg my-6">
                        TRUY CẬP GẦN ĐÂY
                    </h1>
                </div>

                {isShowLoadingHistory ? (
                    <div className="flex my-10 justify-center">
                        <Loading color="red" size={38} />
                    </div>
                ) : (
                    <div className="sc1920:pb-[38px] sc1536:pb-[31px] sc1366:pb-[34px]">
                        <div
                            className={clsx('grid  gap-4', {
                                'grid-cols-3': collapsed,
                                'grid-cols-4': !collapsed,
                            })}
                        >
                            {courseHistory.map((course, index) => {
                                return (
                                    <Faculty
                                        id={course?.courseId}
                                        percent={course?.percent}
                                        course={course}
                                        key={course?.courseId}
                                    />
                                )
                            })}
                        </div>
                    </div>
                )}

                <div>
                    <div className="flex justify-between items-center">
                        <p className="sc1920:text-[28px] sc1536:text-[28px] sc1366:text-[24px] font-semibold text-blue_bg my-6">
                            DANH SÁCH KHÓA HỌC
                        </p>
                        <div className="relative flex grow items-center max-w-[336px]  h-[38px] group">
                            <svg
                                className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                            </svg>
                            <input
                                type="text"
                                onChange={searchByKeyWord}
                                className="ml-auto text-xl grow w-full h-[38px] py-1.5 pl-10 pr-4 leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 focus:bg-gray-100 ring-opacity-90 border-solid border-2"
                                placeholder="Tìm kiếm khóa học của bạn..."
                            />
                        </div>
                    </div>
                    {isShowLoadingCourse ? (
                        <div className="flex justify-center my-9">
                            <Loading size={36} color="red" />
                        </div>
                    ) : (
                        <div
                            className={clsx('grid  gap-4', {
                                'grid-cols-3': collapsed,
                                'grid-cols-4': !collapsed,
                            })}
                        >
                            {courses.map((course: any, index) => {
                                return (
                                    <Faculty
                                        id={course?.courseId}
                                        percent={course?.percent}
                                        key={index}
                                        course={course}
                                    />
                                )
                            })}
                        </div>
                    )}

                    <Paging total={Math.ceil(total / SIZE)} currenPage={currenPage} setCurrentPage={setCurrenPage} />
                </div>
            </div>
        </div>
    )
}

export default StudentFaculty
