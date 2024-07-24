import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { AddCircle } from 'iconsax-react'
import Modal from '../../components/Modal'
import UserManualItem from '../../components/UserManualtem'
import { UserManualService } from '../../services/UserManualService'
import { tutorialType } from '../TypeProps/TutorialProps'
import CreateUserManual from './CreateUserManual'
import Paging from '../../components/Paging'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ContextModal } from './../../Context/ModalContext'
import DialogActionSuccess from '../common/DialogActionSuccess'
import ViewVideoComponent from '../../components/ViewVideoComponent'
import { ContextMessage } from '../../Context/ShowMessage'
import { ContextLayout } from '../../layout/Layout'
import CalendarContainer from '../common/CalendarContainer'
import { NewsService } from '../../services/NewsService'
import DialogConfirm from '../common/DialogConfirm'
import Loading from '../../components/Loading'

function UserManual() {
    const [searchParams] = useSearchParams()
    const [isList, setIsList] = useState<boolean>(true)
    const [isLoad, setIsLoad] = useState<boolean>(false)
    const [itemDelete, setItemDelete] = useState<tutorialType[] | []>([])
    const [currenPage, setCurrentPage] = useState<any>(searchParams.get('page') || 1)
    const [totalPage, setTotalPages] = useState<number | null>(1)
    const [ListTutorials, setListTutorials] = useState<tutorialType[]>([])
    const [itemUpdate, setItemUpdate] = useState<tutorialType | null>(null)
    const [inputSearch, setInputSearch] = useState('')
    const [isShowVideo, setShowVideo] = useState<boolean>(false)
    const { pushMessage } = useContext(ContextMessage)
    const [urlVider, setUrlVideo] = useState<string | null>(null)
    const TypingTimeOutRef = useRef(null)
    const navigate = useNavigate()
    const { AttachChidrenSideRight } = useContext(ContextLayout)

    const { setModal, showModal } = useContext(ContextModal)

    const handleDeleteItem = (data: tutorialType) => {
        setItemDelete([data])
    }

    const handleShowModle = () => {
        setItemUpdate(null)
        setModal(<CreateUserManual pushTutorial={(data) => handleAddTurorial(data)} />)
        showModal(true)
    }
    const handleUpdate = () => {
        const id = itemDelete[0].id
        const itemUpdate = ListTutorials.filter((item) => item.id === id)
        setItemUpdate(itemUpdate[0])
        setModal(<CreateUserManual itemUpdate={itemUpdate[0]} pushTutorial={(data) => pushTutorial(data)} />)
        showModal(true)
    }

    const handleNavigate = (videoUrl: string) => {
        if (videoUrl) {
            setUrlVideo(videoUrl)
        }
        setShowVideo(true)
    }

    const confirmDialog = () => {
        setModal(<DialogConfirm title="Bạn có chắc chắn muốn xóa hướng dẫn này không?" onClick={() => deleteItem()} />)
        showModal(true)
    }

    // xóa hướng dẫn
    const deleteItem = async () => {
        const idDelete = itemDelete[0].id
        if (itemDelete.length > 0) {
            await UserManualService.deletToturialId(idDelete)
                .then(() => {
                    pushMessage({
                        title: 'Thành Công',
                        type: 'SUCCESS',
                        message: 'Đã xóa hướng dẫn !',
                    })
                    NewsService.postNewToHistory({
                        method: 'DELETE',
                        name: itemDelete[0].tutorial_title,
                    })
                })
                .catch((e) => {
                    pushMessage({
                        title: 'Thất bại',
                        message: 'Lỗi hệ thống, không xóa được hướng dẫn',
                        type: 'ERROR',
                    })
                })
            showModal(false)
            if (ListTutorials.length > 1) {
                setItemDelete([])
                getAllTutorial(currenPage - 1, 12)
                // setListTutorials((prevState) => prevState.filter((prevState) => prevState.id !== idDelete))
            } else {
                getAllTutorial(0, 12)
                navigate('')
                setCurrentPage(1)
            }
        }
    }
    // lấy các danh sách hướng đẫn
    const getAllTutorial = async (page: number, size: number) => {
        setIsLoad(true)
        const result = await UserManualService.getTutorial(page, size)
        if (result) {
            const { totalPages, content, pageable, totalElements, size } = result
            setListTutorials(content)
            setTotalPages(totalPages)
            setIsLoad(false)
        } else {
            return
        }
    }

    const searchTutorial = async (query: string, page?: number, size?: number) => {
        setIsLoad(true)
        const searched = await UserManualService.searchTutorial(query, page, size)
        if (searched) {
            const { totalPages, content, pageable, totalElements, size } = searched
            setListTutorials(content)
            setTotalPages(totalPages)
            setIsLoad(false)
        }

        return
    }
    const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const value = event.target.value
        setInputSearch(value)
        setCurrentPage(1)
        navigate('')
    }
    // thêm hướng đẫn vào mảng khi đã đc tạo
    const pushTutorial = (data: any) => {
        if (data) {
            const index = ListTutorials.findIndex((item) => {
                return item.id === data.id
            })
            if (index >= 0) {
                const newList = ListTutorials
                newList[index] = data
                setListTutorials(newList)
            } else {
                return
            }
            showModal(false)
        }
    }
    const handleAddTurorial = (data: any) => {
        if (data) {
            if (currenPage == 1) {
                getAllTutorial(currenPage - 1, 12)
            } else {
                setCurrentPage(1)
            }
            navigate('')
            showModal(false)
        }
    }

    useEffect(() => {
        if (searchParams.get('page')) {
            const page = Number(searchParams.get('page'))
            setCurrentPage(page)
        }
    }, [searchParams])

    useEffect(() => {
        if (inputSearch != '') {
            if (TypingTimeOutRef.current) {
                clearTimeout(TypingTimeOutRef.current)
            }
            TypingTimeOutRef.current = setTimeout(() => {
                searchTutorial(inputSearch, currenPage - 1, 12)
            }, 500)
        } else {
            clearTimeout(TypingTimeOutRef.current)
            getAllTutorial(currenPage - 1, 12)
        }
    }, [currenPage, inputSearch])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
        })
        AttachChidrenSideRight(<CalendarContainer />)
        return () => {
            showModal(false)
        }
    }, [])
    return (
        <div className="m-6">
            <div className="flex sc1920:flex-row sc1920:justify-between sc1920:items-center  justify-between flex-col items-end">
                <h1 className="uppercase text-primary_blue font-bold text-[24px] mb-4 lx:mb-0">HDSD TUU - LMS</h1>

                {/* search */}
                <div className="flex items-center justify-between">
                    {itemDelete.length > 0 && (
                        <div className="flex items-center justify-between">
                            <div
                                onClick={handleUpdate}
                                className="flex items-center cursor-pointer rounded-md bg-btn_bg px-2 text-[#FFB800] font-bold  h-11 bg-[#EFEFEF] mr-3"
                            >
                                <img src="\img\Vectorchanges.png" className="mr-2" alt="" /> Sửa
                            </div>

                            <div
                                onClick={confirmDialog}
                                id="delete_item"
                                className="flex items-center cursor-pointer rounded-md bg-btn_bg px-2 text-primary font-bold  h-11 bg-[#EFEFEF]"
                            >
                                <img src="\img\lmsDelete.png" className="mr-2" alt="" /> Xoá
                            </div>
                        </div>
                    )}

                    <div
                        className="flex items-center bg-[#EFEFEF] mx-3 h-11 px-2 rounded-md bg-btn_bg cursor-pointer"
                        onClick={handleShowModle}
                    >
                        <span>
                            <AddCircle size="24" className="text-primary_blue" />
                        </span>
                        <span className="text-lg ml-1 text-primary_blue font-bold">Thêm</span>
                    </div>

                    <div className="relative flex grow items-center sc1536:w-[276px] sc1366:w-[233px] sc1920:w-[355.29px] h-[40px] group">
                        <svg
                            className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                        </svg>
                        <input
                            type="text"
                            value={inputSearch}
                            onChange={(event) => handleSearchInput(event)}
                            className="ml-auto grow w-full h-[40px] py-1.5 pl-10 pr-4 leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 focus:bg-gray-100 ring-opacity-90 border-solid border-2"
                            placeholder="Tìm kiếm hướng dẫn"
                        />
                    </div>

                    <div
                        className="flex items-center cursor-pointer rounded-md mx-5 h-11"
                        onClick={() => setIsList(true)}
                    >
                        <img src="\img\apps_24px.png" alt="" />
                    </div>

                    <div
                        className="flex items-center h-11  rounded-md  cursor-pointer"
                        onClick={() => setIsList(false)}
                    >
                        <img src="\img\storage_24px.png" alt="" />
                    </div>
                </div>
            </div>

            <div className="mt-7">
                {isLoad ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <Loading />
                    </div>
                ) : (
                    <div
                        className={clsx(
                            'grid',
                            {
                                'sc1920:grid-cols-4 sc1536:grid-cols-3 sc1366:grid-cols-3': isList,
                                'grid-cols-1': !isList,
                            },
                            'gap-3',
                        )}
                    >
                        {ListTutorials.length > 0 ? (
                            ListTutorials.map((tutorial, index) => {
                                return (
                                    <UserManualItem
                                        key={index}
                                        onDoubleClick={(urlVider) => handleNavigate(urlVider)}
                                        setItemDelete={setItemDelete}
                                        itemDelete={itemDelete}
                                        onClickItem={handleDeleteItem}
                                        value={tutorial?.id}
                                        ListTutorial={tutorial}
                                        roles="ADMIN"
                                        isList={isList}
                                    />
                                )
                            })
                        ) : (
                            <div>Không có hướng dẫn nào</div>
                        )}
                    </div>
                )}
                {!isLoad && ListTutorials.length > 0 && (
                    <Paging currenPage={currenPage} setCurrentPage={setCurrentPage} total={totalPage} />
                )}

                {isShowVideo && (
                    <ViewVideoComponent
                        urlVider={urlVider ? urlVider : ''}
                        setShowVideo={(ishow) => setShowVideo(ishow)}
                    />
                )}
            </div>
        </div>
    )
}

export default UserManual
