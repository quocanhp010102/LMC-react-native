import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BannerHome from '../../components/BannerHome'
import Title from '../../components/Homecomponent/Title'
import { DepartmentService } from '../../services/DepartmentService'
import { NewsService } from '../../services/NewsService'
import UserService from '../../services/UserService'
import LineBreack from './LineBreack'

type listCourse = any[]

const ListCourseMajors = () => {
    const { isLoggedIn, doLogin, doLogout } = UserService
    const [ListCourse, setlistCourse] = useState<listCourse>([])
    const [nameDepartment, setNameDepartment] = useState<string>('DANH SÁCH CÁC KHÓA HỌC')
    const param = useParams()
    const id = parseInt(param?.id)

    const handleLogin = () => {
        if (!isLoggedIn()) {
            doLogin()
        } else {
            doLogout()
        }
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
        })
        const getListMajors = async (id: number) => {
            const result = await DepartmentService.getDepatmentId(id)
            const newName = nameDepartment + ' ' + result.department_name.toUpperCase()
            setNameDepartment(newName)
            if (result?.courses) {
                setlistCourse(result?.courses)
            }
            if (isLoggedIn() && result) {
                NewsService.postNewToHistory({
                    method: 'GET',
                    name: result.department_name,
                })
            }
        }
        getListMajors(id)
    }, [id])

    return (
        <div>
            <BannerHome />

            <div className="container-or md:px-0 m-auto w-[68.75%]">
                <div className="home__body-item mt-28 mb-28">
                    <Title title={nameDepartment} />

                    <div className="mt-28 mb-20">
                        {ListCourse.length > 0 ? (
                            ListCourse.map((course, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="w-full border border-solid px-6 py-5 rounded-[10px]  border-[#D4D4D4] mb-5 max-w-[100%]"
                                    >
                                        <p className="sc1920:text-[40px] sc1536:text-[40px] sc1366:text-[36px] text-primary_blue font-medium">
                                            {course?.courseName}
                                        </p>
                                        <div className="mt-9 flex md:justify-between md:flex-row flex-col md:pr-20 text-2xl">
                                            <p className="md:mb-0 mb-3 sc1920:text-[24px] sc1536:text-[24px] sc1366:text-[20px]">
                                                Giảng viên:
                                                <span className="text-primary_blue ml-2">
                                                    {course?.lecturer?.lecturer_fullname}
                                                </span>
                                            </p>

                                            <p>
                                                Học kỳ:
                                                <span className="text-primary_blue ml-2 sc1920:text-[24px] sc1536:text-[24px] sc1366:text-[20px]">
                                                    {course?.courseSemester}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="w-full border border-solid p-6 rounded-[10px]  border-[#D4D4D4] mb-5 max-w-[100%] max-h-[154px]">
                                <p className="text-4xl text-blue_bg">Không có khóa học nào !</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <LineBreack />
        </div>
    )
}

export default ListCourseMajors
