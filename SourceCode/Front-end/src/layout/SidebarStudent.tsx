import React, { ReactNode, useContext, useState } from 'react'
import clsx from 'clsx'
import { SidebarContext } from '../App'

import CustomLink from '../components/ActiveLink'

type Props = { children: ReactNode }

const SidebarStudent = () => {
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
                    <img src="\img\faculty.png" />
                </span>
                <span className="unactive_child pl-7 pr-4">
                    <img src="\img\Faculty_unactive.png" />
                </span>
                <span
                    className={clsx('md:text-base xl:text-xl ml-[12px]', {
                        'side-bar-item': !collapsed,
                        'side-bar-item_show': collapsed,
                    })}
                >
                    Khoá học của tôi
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
                    className={clsx('md:text-base xl:text-xl ml-[13px]', {
                        'side-bar-item': !collapsed,
                        'side-bar-item_show': collapsed,
                    })}
                >
                    HDSD TUU - LMS
                </span>
                {/* <span
                    className={clsx('unactive_child active_child md:text-base xl:text-xl ml-2', {
                        'side-bar-item': !collapsed,
                        'side-bar-item_show': collapsed,
                    })}
                >
                    HDSD SDU - LMS
                </span> */}
            </CustomLink>

            <CustomLink
                to="/history-activity"
                className={clsx('text-lg h-[80px] px-2  flex flex-nowrap items-center overflow-hidden w-full py-7', {
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
                    className={clsx('md:text-base xl:text-xl ml-[13px]', {
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
export default SidebarStudent
