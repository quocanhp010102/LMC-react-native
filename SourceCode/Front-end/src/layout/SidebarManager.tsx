import clsx from 'clsx'
import { ReactNode, useContext } from 'react'
import { SidebarContext } from '../App'
import CustomLink from '../components/ActiveLink'

type Props = { children: ReactNode }

const SidebarManager = () => {
    const { collapsed } = useContext(SidebarContext)
    return (
        <>
            <CustomLink
                to="/manager-users"
                className={clsx('text-lg  h-[80px] px-2  flex flex-nowrap items-center overflow-hidden w-full py-7', {
                    'justify-center': !collapsed,
                    'justify-start': collapsed,
                    'pl-6': collapsed,
                })}
            >
                <span className="md:contents  unactive_child pl-7 pr-4 h-full">
                    <img src="\img\manager_user_unactive.png" />
                </span>
                <span className="active_child pl-7 pr-4 h-full">
                    <img src="\img\manager_user.png" />
                </span>
                <span
                    className={clsx('sc1366:text-base font-medium sc1920:text-lg ml-[14px]', {
                        'side-bar-item': !collapsed,
                        'side-bar-item_show': collapsed,
                    })}
                >
                    Quản lý người dùng
                </span>
            </CustomLink>

            <CustomLink
                to="/manager-department"
                className={clsx('text-lg  h-[80px] px-2  flex flex-nowrap items-center overflow-hidden w-full py-7', {
                    'justify-center': !collapsed,
                    'justify-start': collapsed,
                    'pl-6': collapsed,
                })}
            >
                <span className="md:contents  unactive_child pl-7 pr-4 h-full">
                    <img src="\img\manager_class.png" />
                </span>
                <span className="active_child pl-7 pr-4 h-full">
                    <img src="\img\manager_class_active.png" />
                </span>
                <span
                    className={clsx('sc1366:text-base font-medium sc1920:text-lg ml-[10px]', {
                        'side-bar-item': !collapsed,
                        'side-bar-item_show': collapsed,
                    })}
                >
                    Quản lý chuyên ngành
                </span>
            </CustomLink>

            <CustomLink
                to="/manager-classes"
                className={clsx('text-lg  h-[80px] px-2  flex flex-nowrap items-center overflow-hidden w-full py-7', {
                    'justify-center': !collapsed,
                    'justify-start': collapsed,
                    'pl-6': collapsed,
                })}
            >
                <span className="md:contents  unactive_child pl-7 pr-4 h-full">
                    <img src="\img\manager_class.png" />
                </span>
                <span className="active_child pl-7 pr-4 h-full">
                    <img src="\img\manager_class_active.png" />
                </span>
                <span
                    className={clsx('sc1366:text-base font-medium sc1920:text-lg ml-[10px]', {
                        'side-bar-item': !collapsed,
                        'side-bar-item_show': collapsed,
                    })}
                >
                    Quản lý Lớp
                </span>
            </CustomLink>

            <CustomLink
                to="/manager-notify"
                className={clsx('text-lg  h-[80px] px-2  flex flex-nowrap items-center overflow-hidden w-full py-7', {
                    'justify-center': !collapsed,
                    'justify-start': collapsed,
                    'pl-6': collapsed,
                })}
            >
                <span className="md:contents unactive_child pl-7 pr-4 h-full">
                    <img className='ml-[2px]' src="\img\manager_notify.png" />
                </span>
                <span className="active_child pl-7 ml-1 pr-4 h-full">
                    <img src="\img\notify_active.png" />
                </span>
                <span
                    className={clsx('sc1366:text-base font-medium sc1920:text-lg ml-3', {
                        'side-bar-item': !collapsed,
                        'side-bar-item_show': collapsed,
                    })}
                >
                    Quản lý thông báo
                </span>
            </CustomLink>
            <CustomLink
                to="/manager-news"
                className={clsx('text-lg  h-[80px] px-2  flex flex-nowrap items-center overflow-hidden w-full py-7', {
                    'justify-center': !collapsed,
                    'justify-start': collapsed,
                    'pl-6': collapsed,
                })}
            >
                <span className="md:contents  unactive_child pl-7 pr-4 h-full">
                    <img src="\img\manager_news.png" />
                </span>
                <span className="active_child pl-7 pr-4 h-full">
                    <img src="\img\manager_news_active.png" />
                </span>
                <span
                    className={clsx('sc1366:text-base font-medium sc1920:text-lg ml-3', {
                        'side-bar-item': !collapsed,
                        'side-bar-item_show': collapsed,
                    })}
                >
                    Quản lý tin tức
                </span>
            </CustomLink>
            <CustomLink
                to="/manager-request"
                className={clsx('text-lg  h-[80px] px-2  flex flex-nowrap items-center overflow-hidden w-full py-7', {
                    'justify-center': !collapsed,
                    'justify-start': collapsed,
                    'pl-6': collapsed,
                })}
            >
                <span className="md:contents  unactive_child pl-7 pr-4 h-full">
                    <img src="\img\help_outline_24px.png" />
                </span>
                <span className="active_child pl-7 pr-4 h-full">
                    <img src="\img\question_active.png" />
                </span>
                <span
                    className={clsx('sc1366:text-base font-medium sc1920:text-lg ml-3', {
                        'side-bar-item': !collapsed,
                        'side-bar-item_show': collapsed,
                    })}
                >
                    Quản lý phản hồi
                </span>
            </CustomLink>
            <CustomLink
                to="/user-manual"
                className={clsx('text-lg  h-[80px] px-2  flex flex-nowrap items-center overflow-hidden w-full py-7', {
                    'justify-center': !collapsed,
                    'justify-start': collapsed,
                    'pl-6': collapsed,
                })}
            >
                <span className="md:contents  unactive_child pl-7 pr-4 h-full">
                    <img src="\img\manual_unavtive.png" />
                </span>
                <span className="active_child pl-7 pr-4 h-full">
                    <img src="\img\manual.png" />
                </span>
                <span
                    className={clsx('sc1366:text-base font-medium sc1920:text-lg ml-3', {
                        'side-bar-item': !collapsed,
                        'side-bar-item_show': collapsed,
                    })}
                >
                    Hướng dẫn sử dụng
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
                <span className="md:contents  unactive_child pl-7 pr-4 h-full">
                    <img src="\img\action_history.png" />
                </span>

                <span className="active_child pl-7 pr-4">
                    <img src="\img\history_active.png" />
                </span>
                <span
                    className={clsx('sc1366:text-base font-medium sc1920:text-lg ml-[14px]', {
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
export default SidebarManager
