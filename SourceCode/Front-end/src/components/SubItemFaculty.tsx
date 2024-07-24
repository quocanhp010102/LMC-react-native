import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import DialogConfirm from '../containers/common/DialogConfirm'
import { EventCalendar } from '../containers/Student/EventsCalendar'
import { DateContext } from '../Context/DateContext'
import { ContextMessage } from '../Context/ShowMessage'
import { CalendarService } from '../services/CalendarService'
import { ContextModal } from './../Context/ModalContext'

type Props = {
    event: EventCalendar
}

function SubItemFaculty({ event }: Props) {
    const [isShow, setShow] = useState<boolean>(false)
    const { setModal, showModal } = useContext(ContextModal)
    const { deleteNoteContent } = useContext(DateContext)
    const { pushMessage } = useContext(ContextMessage)
    const confirmDialog = (id: any) => {
        setModal(<DialogConfirm title="Bạn có chắc chắn muốn xóa ghi chú này không ?" onClick={() => deletItem(id)} />)
        showModal(true)
    }

    const deletItem = (id: any) => {
        CalendarService.deleteNoteById(id)
            .then(() => {
                deleteNoteContent(id)
                pushMessage({
                    title: 'Thành công',
                    message: 'Đã xóa ghi chú',
                    type: 'SUCCESS',
                })
            })
            .catch((error) => {
                pushMessage({
                    title: 'Thất bại',
                    message: 'Lỗi hệ thống, không xóa được ghi chú',
                    type: 'ERROR',
                })
            })

        showModal(false)
    }

    return (
        <>
            <div className="w-full flex cursor-pointer justify-between  items-center">
                <div className="flex" onClick={() => setShow(!isShow)}>
                    {!isShow ? (
                        <span>
                            <img src="\img\loyalty_24px.png" />
                        </span>
                    ) : (
                        ''
                    )}

                    <span className="ml-2 md:text-base xl:text-xl">{event.noteContentTitle}</span>
                </div>
                <span
                    className="text-sm text-[#03a9f4] font-semibold hover:underline"
                    onClick={() => confirmDialog(event.id)}
                >
                    Xoá
                </span>
            </div>

            {isShow ? (
                <div className="sub_faculty text-sm font-medium ml-2">
                    <p className="my-[6px]">{event.noteContentContent}</p>

                    <div className="flex items-center mt-5">
                        <span>
                            <img src="\img\alarm_24px.png" />
                        </span>
                        <div className="ml-1">
                            <p className="text-base font-semibold">Thời gian bắt đầu</p>
                            <p>{event.noteContentDate}</p>
                        </div>
                    </div>
                </div>
            ) : (
                ''
            )}
        </>
    )
}

export default SubItemFaculty
