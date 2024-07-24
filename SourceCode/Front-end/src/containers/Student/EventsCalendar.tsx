import { useContext, useState } from 'react'
import { DateContext } from '../../Context/DateContext'
import { __Date } from '../../types'
import SubItemFaculty from '../../components/SubItemFaculty'
import CreateEvent from '../common/CreateEvent'
import { ContextModal } from './../../Context/ModalContext'

export type EventCalendar = {
    id?: number | string
    noteContentTitle: string
    noteContentContent: string
    noteContentDate: string
}

function EventsCalendar() {
    const { datePicker, NotesCalendar } = useContext(DateContext)
    const [events, setEvents] = useState<EventCalendar[]>([])
    const { showModal, setModal } = useContext(ContextModal)

    const checkToday = () => {
        const date = new Date()
        return (
            +datePicker.day === date.getDate() &&
            +datePicker.month === date.getMonth() + 1 &&
            +datePicker.year === date.getFullYear()
        )
    }

    const createEvent = () => {
        setModal(<CreateEvent />)
        showModal(true)
    }

    return (
        <>
            <div className=" my-10">
                <div className="flex justify-between calendar-events">
                    <p className="text-base text-slate-400 mb-3">
                        {`${checkToday() ? 'Hôm nay' : datePicker.weekday}, ${datePicker.day}/${datePicker.month}/${
                            datePicker.year
                        }`}
                    </p>
                    <div className="flex items-center">
                        <div
                            className="flex items-center bg-[#D4D4D4] rounded-md p-2 cursor-pointer"
                            onClick={createEvent}
                        >
                            <img src="\img\add_box_24px.png" alt="" />{' '}
                            <span className="text-[10px] ml-1 text-primary_blue font-medium">Tạo ghi chú</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-y-[20px] text-[#636363] text-[22px]">
                    {/* render Events */}
                    {NotesCalendar?.noteContents.map((event, index) => {
                        return <SubItemFaculty event={event} key={index} />
                    })}

                    {/* <SubItemFaculty />
                    <SubItemFaculty /> */}
                </div>
            </div>
        </>
    )
}

export default EventsCalendar
