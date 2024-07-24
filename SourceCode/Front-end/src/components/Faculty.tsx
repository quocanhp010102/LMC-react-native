import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { CourseByStudent } from '../types'
import UserService from '../services/UserService'

type Props = {
    course?: CourseByStudent
    percent?: number
    id: string | number
}

function Faculty(props: Props) {
    const { course, id, percent } = props

    return (
        <Link
            to={`/faculty/courseView/${id}`}
            className="sc1920:h-[212px] sc1536:h-[190px] sc1366:h-[176.5px] grid-flow-row text-inherit grid grid-rows-5 rounded-[10px] border-2 border-light_blue border-solid"
        >
            <div className="row-span-3 bg-slate-300 overflow-hidden rounded-t-[10px] ">
                <img src={course?.courseImage} alt="" className=" rounded-t-[10px] h-full w-full object-cover" />
            </div>
            <div className="row-span-2 flex flex-col justify-between p-2">
                <p
                    className={clsx({
                        'text-xs': UserService.hasRole(['ROLE_STUDENT']),
                        'text-[15px]': UserService.hasRole(['ROLE_TEACHER']),
                    }, "uppercase")}
                >
                    {course?.courseName.length > 60 ? course?.courseName.slice(0, 60) + '...' : course?.courseName}
                </p>
                {UserService.hasRole(['ROLE_STUDENT']) && (
                    <div>
                        <p className="text-right text-[9px]">
                            Hoàn thành:{' '}
                            <i
                                className={clsx('italic', {
                                    'text-[#00A717]': percent == 100,
                                    'text-[#D7A700]': +percent < 100 && +percent >= 50,
                                    'text-[#D70000]': +percent < 50,
                                })}
                            >
                                {+percent}%
                            </i>
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div
                                className={clsx('h-2.5 rounded-full', {
                                    'bg-[#00A717]': percent === 100,
                                    'bg-[#D7A700]': +percent < 100 && +percent >= 50,
                                    'bg-[#D70000]': +percent < 50,
                                })}
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    )
}

export default Faculty
