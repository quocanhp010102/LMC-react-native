import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { CheckOutlined } from '@ant-design/icons'
import Paging from '../../components/Paging'
import HeaderManager from '../../components/HeaderManager'
import CreateNotifycation from './CreateNotification'
import { ContextModal } from './../../Context/ModalContext'
import { NotifycationService } from '../../services/NotifycationService'
import { useSearchParams } from 'react-router-dom'
import DialogConfirm from '../common/DialogConfirm'

import { ContextMessage } from '../../Context/ShowMessage'

import { ContextLayout } from '../../layout/Layout'
import CalendarContainer from '../common/CalendarContainer'

const PAGE_SIZE = 10 //PM HieuTM set
function ManagerNotifycation() {
    const [itemsCheck, setItemCheck] = useState<any[]>([])
    const [isShowAction, setIsShowAction] = useState<boolean>(() => {
        return itemsCheck.length > 0
    })

    const { setModal, showModal } = useContext(ContextModal)

    const [currentPage, setCurrentPage] = useState<any | null>(1)
    const [totalPage, setTotalPage] = useState<any>(1)
    const [searchParams] = useSearchParams()
    const { AttachChidrenSideRight } = useContext(ContextLayout)
    const { pushMessage } = useContext(ContextMessage)
    useEffect(() => {
        AttachChidrenSideRight(<CalendarContainer />)
        return () => {
            showModal(false)
        }
    }, [])

    useEffect(() => {
        setCurrentPage(searchParams.get('page') ? searchParams.get('page') : 1)
    }, [searchParams.get('page')])

    useEffect(() => {
        if (currentPage > totalPage) {
            setCurrentPage(1)
        }
    }, [totalPage])
    const [listNotification, setListNotification] = useState<any[]>([])

    const [searchKeyWord, setSearchKeyWord] = useState<string>('')
    const typingTimeoutRef = useRef(null)
    const getNotifications = async () => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            searchKeyWord
                ? NotifycationService.searchNotification(searchKeyWord, currentPage - 1, PAGE_SIZE)
                      .then((data) => {
                          setListNotification(data.content)
                          setTotalPage(data.totalPages)
                      })
                      .catch((err) => {
                          console.log(err)
                      })
                : NotifycationService.getNotification(currentPage - 1, PAGE_SIZE)
                      .then((data) => {
                          setListNotification(data.content)
                          setTotalPage(data.totalPages)
                      })
                      .catch((err) => {
                          console.log(err)
                      })
        }, 300)
    }

    useEffect(() => {
        getNotifications()
    }, [currentPage, searchKeyWord])

    const refCheckboxs = useRef<HTMLInputElement[] | any[]>([])
    const refCheckboxAll = useRef<HTMLInputElement | null>(null)

    const listenCheckAll = () => {
        const isCheckAll = itemsCheck.length === listNotification.length
        refCheckboxAll.current!.checked = isCheckAll
    }

    useEffect(() => {
        listenCheckAll()
        setIsShowAction(itemsCheck.length > 0)
    }, [itemsCheck, listNotification])

    const handleCheckAll = (e: ChangeEvent<HTMLInputElement>) => {
        const isCheckAll = e.target.checked
        refCheckboxs.current.forEach((item: HTMLInputElement, index) => {
            if (isCheckAll) {
                setItemCheck([...listNotification])
            } else {
                setItemCheck([])
            }
            if (item) item.checked = isCheckAll
        })
    }

    const handleCheckItems = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const isChecked = refCheckboxs.current[index].checked
        if (isChecked) {
            setItemCheck([...itemsCheck, listNotification[index]])
        } else {
            const tempArr = itemsCheck.filter((item) => {
                return item !== listNotification[index]
            })
            setItemCheck([...tempArr])
        }
    }

    const delNotificationModal = () => {
        showModal(true)
        setModal(<DialogConfirm title="Xóa thông báo" onClick={submitDelNotification} />)
    }

    const submitDelNotification = () => {
        const delListId = itemsCheck.map((value) => {
            return value.id
        })

        NotifycationService.delNotification(delListId)
            .then(() => {
                showModal(false)
                refreshData()
                pushMessage({
                    title: 'Thành công',
                    type: 'SUCCESS',
                    message: 'Xóa thông báo thành công',
                })
            })
            .catch((err) => {
                console.log(err)
                pushMessage({
                    title: 'Lỗi',
                    type: 'ERROR',
                    message: 'Xóa thông báo thất bại',
                })
            })
    }

    const refreshData = () => {
        refCheckboxAll.current.checked = false
        refCheckboxs.current.forEach((item) => {
            if (item) item.checked = false
        })
        setItemCheck([])
        getNotifications()
    }

    const addNotificationModal = () => {
        showModal(true)
        setModal(<CreateNotifycation funcSubmit={submitAddNotification} />)
    }

    const submitAddNotification = (formValue: any) => {
        let authorities
        switch (formValue.authorities) {
            case 'ALL':
                authorities = [
                    {
                        name: 'ROLE_STUDENT',
                    },
                    {
                        name: 'ROLE_LECTURER',
                    },
                ]
                break
            case 'STUDENT':
                authorities = [
                    {
                        name: 'ROLE_STUDENT',
                    },
                ]
                break
            case 'LECTURER':
                authorities = [
                    {
                        name: 'ROLE_LECTURER',
                    },
                ]
        }

        NotifycationService.postNotification({ ...formValue, authorities: authorities })
            .then(() => {
                showModal(false)
                pushMessage({
                    title: 'Thành Công',
                    type: 'SUCCESS',
                    message: 'Thêm thông báo thành công',
                })
                refreshData()
            })
            .catch((err) => {
                console.log(err)
                pushMessage({
                    title: 'Lỗi',
                    type: 'ERROR',
                    message: 'Thêm thông báo thất bại',
                })
            })
    }

    let putId: any = null

    const putNotificationModal = async (notificationValue: any) => {
        putId = notificationValue.id

        showModal(true)
        setModal(<CreateNotifycation formDefaultValue={notificationValue} funcSubmit={submitPutNotification} />)
    }

    const submitPutNotification = (formValue: any) => {
        let authorities
        switch (formValue.authorities) {
            case 'ALL':
                authorities = [
                    {
                        name: 'ROLE_STUDENT',
                    },
                    {
                        name: 'ROLE_LECTURER',
                    },
                ]
                break
            case 'STUDENT':
                authorities = [
                    {
                        name: 'ROLE_STUDENT',
                    },
                ]
                break
            case 'LECTURER':
                authorities = [
                    {
                        name: 'ROLE_LECTURER',
                    },
                ]
        }

        NotifycationService.putNotification(putId, { ...formValue, id: putId, authorities: authorities })
            .then(() => {
                showModal(false)
                refreshData()
                pushMessage({
                    title: 'Thành công',
                    type: 'SUCCESS',
                    message: 'Sửa thông báo thành công',
                })
            })
            .catch((err) => {
                console.log(err)
                pushMessage({
                    title: 'Lỗi',
                    type: 'ERROR',
                    message: 'Sửa thông báo thất bại',
                })
            })
    }

    return (
        <div className="relative sc1920:m-5  lg:h-auto sc1920:rounded-lg flex sc1920:border-[1px] sc1920:border-solid border-borderColor overflow-hidden">
            <div className="w-[100%] rounded-lg">
                <HeaderManager
                    handleUpdate={() => {}}
                    isShowWarning={false}
                    isShowAction={isShowAction}
                    handleAdd={addNotificationModal}
                    handleDelete={delNotificationModal}
                    handleWarning={() => {}}
                    searchKeyWord={searchKeyWord}
                    searchByKeyWord={(event) => {
                        setSearchKeyWord(event.target.value)
                    }}
                    title={'Quản lý thông báo'}
                    isShowAddAction={true}
                />

                <div className="w-full">
                    <table className="manager_table w-full text-center text-__text_primary">
                        <thead>
                            <tr className="uppercase text-lg font-bold py-12">
                                <td className="w-[5%]">
                                    <input
                                        type="checkbox"
                                        ref={refCheckboxAll}
                                        onChange={handleCheckAll}
                                        name=""
                                        hidden
                                        id="all_user"
                                    />
                                    <label htmlFor="all_user" className="checkbox-item">
                                        <CheckOutlined />
                                    </label>
                                </td>
                                <td className="w-[10%]">STT</td>

                                <td className="w-[20%]">Tiêu đề</td>

                                <td className="w-[45%]">Nội dung thông báo</td>

                                <td className="w-[20%]">Đối tượng thông báo</td>
                            </tr>
                        </thead>
                        <tbody>
                            {listNotification.map(
                                (
                                    value: {
                                        id?: number
                                        notificationTitle?: string
                                        notificationContent?: string
                                        authorities?: any[]
                                    },
                                    index,
                                ) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    name="user_item"
                                                    onChange={(event) => handleCheckItems(event, index)}
                                                    ref={(element) => {
                                                        refCheckboxs.current[index] = element
                                                    }}
                                                    hidden
                                                    id={`userItem_${index}`}
                                                />
                                                <label htmlFor={`userItem_${index}`} className="checkbox-item">
                                                    <CheckOutlined />
                                                </label>
                                            </td>

                                            <td className="cursor-pointer" onClick={() => putNotificationModal(value)}>
                                                {(currentPage - 1) * PAGE_SIZE + index + 1}
                                            </td>

                                            <td className="cursor-pointer" onClick={() => putNotificationModal(value)}>
                                                {value.notificationTitle}
                                            </td>

                                            <td className="cursor-pointer" onClick={() => putNotificationModal(value)}>
                                                {value.notificationContent}
                                            </td>

                                            <td className="cursor-pointer" onClick={() => putNotificationModal(value)}>
                                                {value.authorities?.map((role, index) => {
                                                    let result = ''
                                                    result =
                                                        role.name === 'ROLE_STUDENT' ? result + 'Sinh viên' : result
                                                    result =
                                                        role.name === 'ROLE_LECTURER' ? result + 'Giảng viên' : result
                                                    result =
                                                        index + 1 < value.authorities.length ? result + ', ' : result
                                                    return result
                                                })}
                                            </td>
                                        </tr>
                                    )
                                },
                            )}
                            {listNotification.length === 0 && (
                                <tr>
                                    <td colSpan={5}>Không có thông báo</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {totalPage > 1 && (
                        <Paging currenPage={currentPage} setCurrentPage={setCurrentPage} total={totalPage} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManagerNotifycation
