import { AddCircle } from 'iconsax-react'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Department from '../../components/Department'
import { DepartmentService } from '../../services/DepartmentService'
import CreateDepartment from './CreateDepartment'
import CalendarContainer from '../common/CalendarContainer'
import Paging from '../../components/Paging'
import { ContextModal } from '../../Context/ModalContext'
import { ContextLayout } from './../../layout/Layout'
import { stateType } from '../../types'
import { ContextMessage } from '../../Context/ShowMessage'
import { NewsService } from '../../services/NewsService'
import Loading from '../../components/Loading'
import DialogConfirm from '../common/DialogConfirm'

function ManagerDepartment() {
    const [searchParams] = useSearchParams()
    const [isList, setIsList] = useState<boolean>(true)
    const [isLoad, setIsLoad] = useState<boolean>(false)
    const [departMentList, setDepartMentList] = useState<stateType[]>([])
    const [iscall, setIsCall] = useState<boolean>(false)
    const [currenPage, setCurrentPage] = useState<any>(searchParams.get('page') || 1)
    const [itemDelete, setItemDelete] = useState<stateType[] | []>([])
    const [totalPages, setTotalPage] = useState<number>(1)
    const [inputSearch, setInputSearch] = useState('')
    const { pushMessage } = useContext(ContextMessage)
    const TypingTimeOutRef = useRef(null)
    const navigator = useNavigate()

    const { AttachChidrenSideRight } = useContext(ContextLayout)
    const { showModal, setModal } = useContext(ContextModal)

    const handleAdd = () => {
        setModal(<CreateDepartment called={handleCall} push={handleAddDepartment} />)
        showModal(true)
    }
    const handleCall = () => {
        setIsCall(!iscall)
    }
    const handleAddDepartment = (data: any) => {
        if (data) {
            if (currenPage == 1) {
                getDepartmentSimple(currenPage - 1, 12)
            } else {
                setCurrentPage(1)
            }
            navigator('')
            showModal(false)
        }
    }
    const confirmDialog = () => {
        setModal(<DialogConfirm title="Bạn có muốn xóa chuyên ngành này không?" onClick={() => deleteItem()} />)
        showModal(true)
    }
    // const handlePushState = (data: stateType) => {
    //     if (data) {
    //         const newState = departMentList
    //         newState.unshift(data)
    //         setDepartMentList(newState)
    //     }
    // }

    const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const value = event.target.value
        setInputSearch(value)
        setCurrentPage(1)
        navigator('')
    }

    const handleUpdate = async () => {
        const item = itemDelete[0]
        setModal(<CreateDepartment called={handleCall} itemUpdate={item} update={handleCallApiRepeat} />)
        showModal(true)
    }
    const handleCallApiRepeat = async () => {
        await getDepartmentSimple(currenPage - 1, 12)
    }
    const deleteItem = async () => {
        const id = itemDelete[0].id
        const deletedDp = await DepartmentService.deleteDepartment(id)
        pushMessage({
            title: 'Thành Công',
            type: 'SUCCESS',
            message: 'Đã xóa chuyên ngành!',
        })
        NewsService.postNewToHistory({
            method: 'DELETE',
            name: itemDelete[0].department_name,
        })
        if (departMentList.length > 1) {
            getDepartmentSimple(currenPage - 1, 12)
            // const newDepartmentState = departMentList.filter((department, index) => {
            //     return department.id != id
            // })
            // setDepartMentList(newDepartmentState)
        } else {
            getDepartmentSimple(0, 12)
            navigator('')
            setCurrentPage(1)
        }
        setItemDelete([])
        showModal(false)
    }

    const onClickDepartment = (department: stateType) => {
        if (department) {
            setItemDelete([department])
        }
    }

    const getDepartmentSimple = async (page?: number, size?: number) => {
        setIsLoad(true)
        const result = await DepartmentService.getDepartment(page, size)
        if (result) {
            const { totalPages, content, pageable, totalElements, size } = result
            setDepartMentList(content)
            setTotalPage(totalPages)
            setIsLoad(false)
        }
    }
    const searchDepartment = async (query: string, page?: number, size?: number) => {
        setIsLoad(true)
        const result = await DepartmentService.searchDeparment(query, page, size)
        if (result) {
            const { totalPages, content, pageable, totalElements, size } = result
            setDepartMentList(content)
            setTotalPage(totalPages)
            setIsLoad(false)
        }
    }
    useEffect(() => {
        if (searchParams.get('page')) {
            const numberPage = Number(searchParams.get('page'))
            setCurrentPage(numberPage)
        }
    }, [searchParams])

    useEffect(() => {
        AttachChidrenSideRight(<CalendarContainer />)
        return () => {
            showModal(false)
        }
    }, [])

    useEffect(() => {
        if (inputSearch != '') {
            if (TypingTimeOutRef.current) {
                clearTimeout(TypingTimeOutRef.current)
            }
            TypingTimeOutRef.current = setTimeout(() => {
                searchDepartment(inputSearch, currenPage - 1, 12)
            }, 500)
        } else {
            clearTimeout(TypingTimeOutRef.current)
            getDepartmentSimple(currenPage - 1, 12)
        }
    }, [currenPage, inputSearch])
    return (
        <div className="relative lg:h-auto sc1920:rounded-lg flex sc1920:p-6 overflow-hidden">
            <div className="w-[100%] p-[27px] border-[1px] sc1920:border-solid border-[#D4D4D4]  sc1920:rounded-lg sc1536:rounded-none sc1366:rounded-none">
                <div className="flex  justify-between items-center">
                    <h1 className="uppercase text-primary_blue font-bold text-2xl">Quản lý chuyên ngành đào tạo</h1>

                    {/* search */}
                    <div className="flex items-center justify-between">
                        <div className="relative flex grow items-center w-full sc1366:271px sc1920:w-[377px] h-full group">
                            <svg
                                className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                            </svg>
                            <input
                                value={inputSearch}
                                onChange={(event) => handleSearchInput(event)}
                                type="text"
                                className="ml-auto grow w-full h-12 py-1.5 pl-10 pr-4 leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 focus:bg-gray-100 ring-opacity-90 border-solid border-2"
                                placeholder="Tìm kiếm..."
                            />
                        </div>
                        {itemDelete.length > 0 && (
                            <div className="flex items-center justify-between ml-3">
                                <div
                                    onClick={handleUpdate}
                                    className="flex items-center cursor-pointer rounded-md font-bold text-[#FFB800] bg-btn_bg px-2  h-11 mr-3"
                                >
                                    <img src="\img\Vectorchanges.png" className="mr-2" alt="" /> Sửa
                                </div>

                                <div
                                    onClick={confirmDialog}
                                    id="delete_item"
                                    className="flex items-center cursor-pointer rounded-md bg-btn_bg px-2 font-bold text-primary  h-11"
                                >
                                    <img src="\img\lmsDelete.png" className="mr-2 " alt="" /> Xoá
                                </div>
                            </div>
                        )}
                        <div
                            className="flex items-center ml-3 p-2 rounded-md bg-btn_bg cursor-pointer"
                            onClick={handleAdd}
                        >
                            <span>
                                <AddCircle size="24" className="text-primary_blue" />
                            </span>
                            <span className="text-lg ml-1 text-primary_blue font-bold">Thêm</span>
                        </div>
                    </div>
                </div>

                {isLoad ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <Loading />
                    </div>
                ) : (
                    <div className="grid sc1366:grid-cols-3  sc1536:grid-cols-3 sc1920:grid-cols-4 mt-12  gap-4">
                        {departMentList.length > 0 ? (
                            departMentList.map((department, index) => {
                                return (
                                    <Department
                                        onClickDepartment={() => onClickDepartment(department)}
                                        key={department.id}
                                        Department={department}
                                        roles="ADMIN"
                                        setItemDelete={setItemDelete}
                                        itemDelete={itemDelete}
                                        isList={isList}
                                        value={department?.id}
                                    />
                                )
                            })
                        ) : (
                            <div className="flex justify-center items-center min-h-[200px]">Không có khóa học nào</div>
                        )}
                    </div>
                )}

                {!isLoad && totalPages > 0 && (
                    <Paging currenPage={currenPage} setCurrentPage={setCurrentPage} total={totalPages} />
                )}
            </div>
        </div>
    )
}

export default ManagerDepartment
