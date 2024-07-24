import { ArrowDown2 } from 'iconsax-react'
import React, { ChangeEvent, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ContextLayout } from './Layout'
import UserService from '../services/UserService'
import Notifycation from '../components/Notification'
import { SearchAllService } from '../services/SearchAllService'
import { DContextProfile } from '../Context/MyselfContext'
import { ADMIN, LECTURER, NewsSearch, STUDENT } from '../types'
import { NotifyType } from '../types/NotifyType'
import { NotifycationService } from '../services/NotifycationService'
import { microservice } from '../services/customService'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import Loading from '../components/Loading'
import { DateContext } from '../Context/DateContext'

type Props = { children: ReactNode }

const Navbar = () => {
    // const Navbar = ({ children }: Props) => {
    const { User, isLoading } = useContext(DContextProfile)
    const { setShowProfile, isShowProfile } = useContext(ContextLayout)
    const enpont = microservice.getEndPointServiceNotifycation()
    const [height, setHeight] = useState<number>(118)
    const [isShowNotify, setShowNotify] = useState<boolean>(false)
    const [searchValue, setSearchValue] = useState<string>('')
    const [notifyList, setNotifyList] = useState<NotifyType | null>(null)
    const [notifyListUnred, setNotifyListUnred] = useState<number | null>(null)
    const [newsSearch, setNewsSearch] = useState<NewsSearch[]>([])
    const inputChandRef = useRef(null)
    const iloggined = UserService.isLoggedIn()
    const [eventCalen, setEventCarlen] = useState<any>(null)
    const navigate = useNavigate()
    const { pushNodeId, pushNotesContent, datePicker } = useContext(DateContext)

    let location = useLocation()
    const showNotify = () => {
        setShowNotify(!isShowNotify)
    }

    const search = location.pathname.indexOf('/search')

    const headRef: React.MutableRefObject<HTMLDivElement> = useRef()
    const divRef: React.MutableRefObject<HTMLImageElement> = useRef()
    const notyRef: React.MutableRefObject<HTMLDivElement> = useRef()

    const a = (event: Event) => {
        const target = event.target as HTMLElement
        const divNotify = notyRef.current
        if (target !== divRef.current && divNotify && !divNotify.contains(target)) {
            setShowNotify(false)
        }
    }
    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const value = event.target.value
        setSearchValue(value)
        if (value == '') {
            setNewsSearch([])
        }
        if (inputChandRef.current) {
            clearTimeout(inputChandRef.current)
        }
        inputChandRef.current = setTimeout(async () => {
            if (value != '') {
                const responsedSearch = await SearchAllService.searchAll(value, 0, 5)
                if (responsedSearch && responsedSearch.content.length > 0) {
                    const { totalPages, content, pageable, totalElements, size } = responsedSearch
                    setNewsSearch(content)
                } else {
                    setNewsSearch([])
                }
            }
        }, 500)
    }
    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault()
        if (searchValue != '' && event.keyCode === 13) {
            setNewsSearch([])
            navigate(`search?search=${searchValue}`)
            setSearchValue('')
        }
    }
    const viewPageSearch = (event: React.MouseEvent<HTMLParagraphElement>, id: number) => {
        navigate(`/home-new/view/${id}`)

        setNewsSearch([])
        setSearchValue('')
    }
    const resizeWindow = (headerHeight: number) => {
        setHeight(headerHeight)
    }
    const handleClickNotify = async (notify: NotifyType) => {
        if (notify) {
            setNotifyListUnred((prevState) => prevState - 1)
        }
    }
    const getNumberNotifycaition = async () => {
        const result = await NotifycationService.getNumberNotifycation()
        if (result) {
            setNotifyListUnred(result)
        } else {
            return
        }
    }

    useEffect(() => {
        const headerHeight = headRef?.current?.offsetHeight
        // resizeWindow(headerHeight)
        window.addEventListener('click', a)
        window.addEventListener('resize', () => resizeWindow(headRef?.current?.offsetHeight))
        return () => {
            window.removeEventListener('click', a)
            window.removeEventListener('resize', () => resizeWindow)
        }
    }, [height])

    useEffect(() => {
        if (eventCalen !== null) {
            const { noteDate, noteId, carlenderData } = eventCalen
            if (noteDate === `${datePicker.year}-${datePicker.month}-${datePicker.day}`) {
                pushNotesContent(noteId, noteDate, carlenderData)
                setEventCarlen(null)
            }
        }
    }, [datePicker, eventCalen])
    useEffect(() => {
        if (User) {
            getNumberNotifycaition()
            const sock = new SockJS('http://101.99.6.31:28092/services/lmstrainingmanagementtest/ws')
            let stompClient = Stomp.over(sock)
            sock.onopen = function () {}
            stompClient.connect({}, function (frame) {
                stompClient.subscribe(`/topic/notificaiton/${User.user.id}`, function (greeting) {
                    const response = JSON.parse(greeting.body)
                    if (response) {
                        if (response.noteId) {
                            const {
                                noteId,
                                noteContentId,
                                noteContentTitle,
                                noteContentDate,
                                noteDate,
                                noteContentContent,
                            } = response
                            const carlenderData = {
                                id: noteContentId,
                                noteContentTitle,
                                noteContentContent,
                                noteContentDate,
                            }
                            pushNodeId(noteId, noteDate, carlenderData)
                            setEventCarlen({
                                noteId,
                                noteDate,
                                carlenderData,
                            })
                        }
                        setNotifyList(response)
                        setNotifyListUnred((prevState) => prevState + 1)
                    }
                })
            })
        }
    }, [User])
    return (
        <>
            <header
                ref={headRef}
                className="relative px-4 py-6 border-b-2 font-medium border-solid text-gray-600 border-gray-300"
            >
                <div className="flex flex-row w-full pl-12 justify-between items-center">
                    <div className="flex flex-row w-6/12 left-nav items-center">
                        <Link to="/" className="pr-14 text-lg font-bold flex">
                            {/* <img src="/img/logo_saodo.png" alt="logo" />

                            <div className="pl-4">
                                <div className="pb-1 font-bold text-xl text-blue_bg">ĐẠI HỌC SAO ĐỎ</div>
                                <div className="w-full h-[1px] bg-[#B4B4B4]"></div>
                                <div className="pt-1 text-lg font-normal text-blue_bg">SAODO UNIVERSITY</div>
                            </div> */}
                            <img src="/img/logo.png" alt="logo" />
                        </Link>
                        {search == -1 && (
                            <div className="relative flex grow items-center w-full lg:w-64 h-full group">
                                <svg
                                    className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                                </svg>
                                <input
                                    value={searchValue}
                                    onChange={(event) => handleSearch(event)}
                                    onKeyUp={(event) => handleKeyUp(event)}
                                    type="text"
                                    className="ml-auto grow w-full h-12 py-1.5 pl-10 pr-4 leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 focus:bg-gray-100 ring-opacity-90 border-solid border-2"
                                    // placeholder="Search"
                                />

                                {newsSearch.length > 0 && searchValue != '' && (
                                    <div className="absolute py-4 px-5 top-[104%] right-0 left-0 h-auto z-[999] rounded-b-lg bg-white shadow-xl shadow-zinc-500">
                                        {newsSearch.map((newsItem, index) => {
                                            return (
                                                <div
                                                    key={newsItem.id}
                                                    className="py-3 border-b border-solid border-gray-400 cursor-pointer"
                                                >
                                                    <p
                                                        onClick={(event) => viewPageSearch(event, newsItem.id)}
                                                        className="font-bold text-base text-[black] mb-1"
                                                    >
                                                        {newsItem?.news_title}
                                                    </p>
                                                    <p className="text-base">News</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-row w-6/12 sc1920:pl-40 sc1536:pl-28 sc1366:pl-20 text-lg justify-center items-center right-nav">
                        {UserService.isLoggedIn() ? (
                            <Link to="/">
                                <div className="pl-12 text-[#636363] hover:text-[#434343] relative overflow-hidden no-underline">
                                    {/* <div className="before:text-[#636363]  before:pl-12 before:content-[''] before:absolute before:left-12 before:right-0 before:bottom-0 before:h-[2px] before:bg-current before:translate-x-[-110%] before:transition before:transform before:duration-500  hover:before:transform hover:before:text-[#535353] hover:before:translate-x-[110%]"> */}
                                    Trang chủ
                                    {/* </div> */}
                                </div>
                            </Link>
                        ) : (
                            <Link to="/">
                                <div className="sc1920:pl-80 sc1536:pl-72 sc1366:pl-60 text-[#636363] hover:text-[#434343] relative overflow-hidden no-underline">
                                    {/* <div className="before:text-[#636363]  before:pl-12 before:content-[''] before:absolute before:left-12 before:right-0 before:bottom-0 before:h-[2px] before:bg-current before:translate-x-[-110%] before:transition before:transform before:duration-500  hover:before:transform hover:before:text-[#535353] hover:before:translate-x-[110%]"> */}
                                    Trang chủ
                                    {/* </div> */}
                                </div>
                            </Link>
                        )}
                        {UserService.isLoggedIn() ? (
                            <Link
                                to={
                                    UserService.hasRole([STUDENT, LECTURER])
                                        ? '/faculty'
                                        : UserService.hasRole([ADMIN])
                                        ? '/manager-users'
                                        : ''
                                }
                            >
                                <div className="sc1920:pl-[4.5rem] sc1536:pl-12 sc1366:pl-10 text-lg text-[#636363] hover:text-[#434343]">
                                    Dashboard
                                </div>
                            </Link>
                        ) : (
                            ''
                        )}
                        <a>
                            <div
                                className="sc1920:pl-[4.5rem] sc1536:pl-12 sc1366:pl-10 text-lg text-[#636363] hover:text-[#434343] hover:cursor-pointer"
                                onClick={() => {
                                    document.getElementById(`footer`).scrollIntoView({ behavior: 'smooth' })
                                }}
                            >
                                Liên hệ
                            </div>
                        </a>

                        {UserService.isLoggedIn() && (
                            <div className="cursor-pointer">
                                <div className="sc1920:pl-[4.5rem] sc1536:pl-12 sc1366:pl-10 relative">
                                    <img src="/img/manager_notify.png" ref={divRef} onClick={showNotify}></img>

                                    {notifyListUnred > 0 ? (
                                        <div className="absolute top-[-25%] right-[-5%] flex items-center justify-center bg-[#FF4A4F] w-5 h-5 rounded-full text-[10px] text-[white]">
                                            {notifyListUnred}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )}
                        {UserService.isLoggedIn() ? (
                            <div className="relative w-auto cursor-pointer">
                                <div
                                    onClick={() => setShowProfile(!isShowProfile)}
                                    className="sc1920:ml-[4.5rem] sc1536:ml-12 sc1366:ml-10 flex flex-row items-center"
                                >
                                    <div className="relative w-10 h-10 rounded-full  cursor-pointer">
                                        {isLoading && (
                                            <div className="absolute rounded-full bg-[#0000003d] z-50 inset-0 flex justify-center items-center">
                                                <Loading color="#fff" />
                                            </div>
                                        )}
                                        <img
                                            className="object-cover w-10 h-10 rounded-full"
                                            src={`${
                                                User?.student_avatar ||
                                                User?.lecturer_avatar ||
                                                User?.admin_avatar ||
                                                '/img/persion1.png'
                                            }`}
                                            alt="Profile image"
                                        />
                                    </div>
                                    <span className="py-2 pl-2">
                                        <ArrowDown2 size="18" />
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => UserService.doLogin()}
                                className="sc1920:ml-[4.5rem] sc1536:ml-12 sc1366:ml-10 cursor-pointer flex flex-row items-center"
                            >
                                <img src="/img/user.png" />
                            </div>
                        )}
                    </div>
                </div>
                {isShowNotify && (
                    <div ref={notyRef} style={{ position: 'absolute', top: `${height}px`, right: '0', zIndex: 9999 }}>
                        <Notifycation
                            handleSetNotifyListProps={setNotifyList}
                            notifycationPush={notifyList}
                            handleClickNotify={(notify) => handleClickNotify(notify)}
                        />
                    </div>
                )}
            </header>
        </>
    )
}

export default Navbar
