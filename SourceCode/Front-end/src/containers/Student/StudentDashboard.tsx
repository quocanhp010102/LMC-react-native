import clsx from 'clsx'
import { useContext, useEffect, useState } from 'react'
import { SidebarContext } from '../../App'
import Faculty from '../../components/Faculty'
import { ContextLayout } from '../../layout/Layout'
import { CourseService } from '../../services/CourseService'
import CalendarContainer from '../common/CalendarContainer'

type props = {}

function Dashboard({}: props) {
    const { collapsed } = useContext(SidebarContext)
    const { AttachChidrenSideRight } = useContext(ContextLayout)
    const [courses, setCouses] = useState<any[]>([])
    useEffect(() => {
        ;(async () => {
            const data = await CourseService.getCoursesByStudent()
            setCouses(data)
        })()

        AttachChidrenSideRight(<CalendarContainer />)
    }, [])

    return (
        <div
            className={clsx('w-full lg:pl-[44px]  lg:h-auto flex transition-all duration-500', {
                'md:pr-[44px] xl:pr-[206px]': collapsed,
                'md:pr-[44px] xl:pr-[106px]': !collapsed,
            })}
        >
            <div className="dashboard-content lg:w-[100%] pb-[123px]">
                <h1 className="text-3xl font-semibold my-6">TRUY CẬP GẦN ĐÂY</h1>

                <div>
                    <p className="text-xl my-6">Đầu tuần này</p>
                    <div
                        className={clsx('grid  gap-4', {
                            'grid-cols-3': collapsed,
                            'grid-cols-4': !collapsed,
                        })}
                    ></div>
                </div>

                <div>
                    <p className="text-xl my-6">Đầu tháng này</p>
                    <div
                        className={clsx('grid  gap-4', {
                            'grid-cols-3': collapsed,
                            'grid-cols-4': !collapsed,
                        })}
                    >
                        {/* {courses.map((course: any, index) => {
                            return <Faculty key={index} course={course} roles="STUDENT" />
                        })} */}

                        {/* <Faculty roles='STUDENT' />
                        <Faculty roles='STUDENT' />
                        <Faculty roles='STUDENT' />
                        <Faculty roles='STUDENT' />
                        <Faculty roles='STUDENT' /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
