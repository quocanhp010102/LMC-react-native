import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { CheckOutlined } from '@ant-design/icons'
import { useSearchParams } from 'react-router-dom'
import Paging from '../../components/Paging'
import HeaderManager from '../../components/HeaderManager'
import CreateUserModal from './CreateUserModal'
import { ContextLayout } from '../../layout/Layout'
import CalendarContainer from '../common/CalendarContainer'
import { ContextModal } from './../../Context/ModalContext'
import { ManagerUserService } from '../../services/ManagerUserService'
import { LECTURER } from '../../types'

type User = {
    userId: string | number
    userName: string
    authorities: string[]
    login: string
    userCode?: string
    // numberphone
}

function ManagerUserContainer() {
    const [listUser, setListUser] = useState<User[]>([])

    const { setModal, showModal } = useContext(ContextModal)
    const [searchParams] = useSearchParams()
    const [currenPage, setCurrentPage] = useState<any | null>(searchParams.get('page') || 1)
    const [total, setTotal] = useState<number>(1)

    const [searchText, setSearchText] = useState<string>(null)

    const { AttachChidrenSideRight } = useContext(ContextLayout)

    useEffect(() => {
        AttachChidrenSideRight(<CalendarContainer />)
        return ()=> {
            showModal(false);
        }
    }, [])
    useEffect(() => {
        if (searchText !== null && searchText !== '') {
            getUserBySearch(searchText, 1)
        } else {
            getUser(currenPage)
        }
    }, [currenPage])

    useEffect(() => {
        if (searchParams.get('page')) {
            const page = Number(searchParams.get('page'))
            setCurrentPage(page)
        }
    }, [searchParams])

    const getUser = async (page: any) => {
        const data = await ManagerUserService.getUserSystem({
            page: page - 1,
            size: 10,
        })
        setListUser(data.UserRole)
        setTotal(data.totalPage)
    }

    useEffect(() => {
        let timeout: any
        if (searchText !== null) {
            if (searchText !== '') {
                timeout = setTimeout(() => {
                    setCurrentPage(1);
                    getUserBySearch(searchText, 1)
                }, 1000)
            } else {
                getUser(currenPage)
            }
        }

        return () => {
            clearTimeout(timeout)
        }
    }, [searchText])

    const handleAdd = () => {
        // setModal(
        //     <CreateUserModal type="ADD" use  r={null} title={'Thêm người dùng vào hệ thống'}/>,
        // )
        // showModal(true)
    }

    const handleDelete = () => {}

    const handleWarning = () => {}

    const searchByKeyWord = (event: ChangeEvent<HTMLInputElement>) => {
        const text = event.currentTarget.value
        setSearchText(text.trim())
    }

    const getUserBySearch = async (text: string, page: any) => {
        const data = await ManagerUserService.searchUserSystem(text, {
            page: page - 1,
            size: 10,
        })

        setListUser(data.UserRole)
        setTotal(data.totalPage - 1)
    }

    const handleUpdate = () => {}

    const showDetailUser = async (idUser: any, roleName: any) => {
        const user: any = await ManagerUserService.getUserDetaill(idUser, roleName)

        setModal(
            <CreateUserModal
                user={{
                    id: user?.userId,
                    name: user?.fullname,
                    Mand: user?.userCode,
                    gender: user?.sex,
                    date: user?.birthDay,
                    number: user?.numPhone,
                    role: user?.role,
                    email: user?.email,
                    class: user?.className
                }}
                title={'Chi tiết người dùng'}
                type="VIEW"
            />,
        )
        showModal(true)
    }

    return (
        <div className="relative lg:h-auto sc1920:m-5 sc1920:rounded-lg flex sc1920:border-[1px] sc1920:border-solid sc1920:border-[#D4D4D4] overflow-hidden">
            <div className="lg:w-[100%] rounded-lg">
                <HeaderManager
                    searchByKeyWord={searchByKeyWord}
                    isShowAction={false}
                    title="Quản lý người dùng"
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                    handleUpdate={handleUpdate}
                    handleWarning={handleWarning}
                    isShowWarning={false}
                    isShowAddAction={false}
                />

                <div className="w-full">
                    <table className="manager_table w-full text-center text-__text_primary">
                        <thead>
                            <tr className="uppercase text-lg font-bold py-12">
                                <td>STT</td>

                                <td>Mã Người dùng</td>

                                <td>Họ và tên</td>
                                {/* <td>email</td>
                                <td>Số điện thoại</td> */}

                                <td>Vai trò</td>
                            </tr>
                        </thead>
                        <tbody>
                            {listUser.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{(10)*(currenPage - 1) + index + 1}</td>

                                        <td>{value.userCode}</td>

                                        <td
                                            className="cursor-pointer hover:text-[#35baf6] hover:underline duration-100"
                                            onClick={() => showDetailUser(value.userCode, value.authorities)}
                                        >
                                            {value.userName}
                                        </td>

                                        <td> {value.authorities}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {<Paging currenPage={currenPage} setCurrentPage={setCurrentPage} total={total} />}
                </div>
            </div>
        </div>
    )
}

export default ManagerUserContainer
