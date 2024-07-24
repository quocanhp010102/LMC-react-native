import clsx from 'clsx'
import { ReactNode, useContext, useState } from 'react'
import { SidebarContext } from '../App'

import CustomLink from '../components/ActiveLink'

type Props = { children: ReactNode }

const SidebarTeacher = () => {
    const { collapsed } = useContext(SidebarContext)

    return (
        <>
            <CustomLink
                to="/faculty"
                className={clsx('text-lg  h-[80px] px-2  flex flex-nowrap items-center overflow-hidden w-full py-7', {
                    'justify-center': !collapsed,
                    'justify-start': collapsed,
                    'pl-6': collapsed,
                })}
            >
                <span className="active_child pl-7 pr-4">
                    <img src="\img\central.png" />
                </span>
                <span className="unactive_child pl-7 pr-4 h-full">
                    <img src="\img\central_unactive.png" />
                </span>

                <span
                    className={clsx('md:text-base xl:text-xl ml-[14px]', {
                        'side-bar-item': !collapsed,
                        'side-bar-item_show': collapsed,
                    })}
                >
                    Trung tâm kiểm soát
                </span>
            </CustomLink>

            <CustomLink
                to="/teacher-course"
                className={clsx('text-lg  h-[80px] px-2  flex flex-nowrap items-center overflow-hidden w-full py-7', {
                    'justify-center': !collapsed,
                    'justify-start': collapsed,
                    'pl-6': collapsed,
                })}
            >
                <span className="active_child pl-7 pr-4">
                    <img src="\img\faculty.png" />
                </span>
                <span className="unactive_child pl-7 pr-4">
                    <img src="\img\Faculty_unactive.png" />
                </span>
                <span
                    className={clsx('md:text-base xl:text-xl ml-3', {
                        'side-bar-item': !collapsed,
                        'side-bar-item_show': collapsed,
                    })}
                >
                    Quản lý khoá học
                </span>
            </CustomLink>

            <CustomLink
                to="/questions-list"
                className={clsx('text-lg  h-[80px] px-2  flex flex-nowrap items-center overflow-hidden w-full py-7', {
                    'justify-center': !collapsed,
                    'justify-start': collapsed,
                    'pl-6': collapsed,
                })}
            >
                <span className="active_child pl-7 pr-4">
                    <img src="\img\bank_active.png" />
                </span>
                <span className="unactive_child pl-7 pr-4">
                    <img src="\img\bank.png" />
                </span>
                <span
                    className={clsx('md:text-base xl:text-xl ml-3', {
                        'side-bar-item': !collapsed,
                        'side-bar-item_show': collapsed,
                    })}
                >
                    Ngân hàng câu hỏi
                </span>
            </CustomLink>

            <CustomLink
                to="/lms-help"
                className={clsx('text-lg  h-[80px] px-2  flex flex-nowrap items-center overflow-hidden w-full py-7', {
                    'justify-center': !collapsed,
                    'justify-start': collapsed,
                    'pl-6': collapsed,
                })}
            >
                <span className="active_child pl-7 pr-4">
                    <img src="\img\question_active.png" />
                </span>

                <span className="unactive_child pl-7 pr-4">
                    <img src="\img\help_outline_24px.png" />
                </span>
                <span
                    className={clsx('md:text-base xl:text-xl ml-3', {
                        'side-bar-item': !collapsed,
                        'side-bar-item_show': collapsed,
                    })}
                >
                    HDSD TUU - LMS
                </span>
            </CustomLink>

            <CustomLink
                to="/history-activity"
                className={clsx('text-lg  h-[80px] px-2  flex flex-nowrap items-center overflow-hidden w-full py-7', {
                    'justify-center': !collapsed,
                    'justify-start': collapsed,
                    'pl-6': collapsed,
                })}
            >
                <span className="unactive_child pl-7 pr-4">
                    <img src="\img\action_history.png" />
                </span>

                <span className="active_child pl-7 pr-4">
                    <img src="\img\history_active.png" />
                </span>
                <span
                    className={clsx('md:text-base xl:text-xl ml-[14px]', {
                        'side-bar-item': !collapsed,
                        'side-bar-item_show': collapsed,
                    })}
                >
                    Lịch sử hoạt động
                </span>
            </CustomLink>
        </>
    )
}

export default SidebarTeacher
