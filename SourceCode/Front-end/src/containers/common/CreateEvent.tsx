import React, { ChangeEvent, FormEvent, useContext, useState } from 'react'
import { CalendarService } from './../../services/CalendarService'
import { DateContext } from '../../Context/DateContext'
import { ContextModal } from './../../Context/ModalContext'
import { ContextMessage } from '../../Context/ShowMessage'
// import DatePicker from 'react-datepicker'

// import 'react-datepicker/dist/react-datepicker.css'
type Props = {}
type Note = {
    id?: string
    noteDate: string
    noteTitle: string
    noteContent: string
}

function CreateEvent({}: Props) {
    const [note, setNote] = useState<Note>()
    const [timeEvent, setTimeEvent] = useState<string>('')
    const { showModal } = useContext(ContextModal)
    const { pushMessage } = useContext(ContextMessage)

    const handleTime = (event: ChangeEvent<HTMLInputElement>) => {
        setTimeEvent(event.target.value)
    }

    const { datePicker, pushNotesContent } = useContext(DateContext)

    const subMitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        CalendarService.postEventCalendar({
            ...note,
            noteDate: `${datePicker.year}-${datePicker.month}-${datePicker.day}T${timeEvent}`,
        })
            .then((data: any) => {
                pushMessage({
                    title: 'Thành công',
                    message: 'Thêm ghi chú thành công',
                    type: 'SUCCESS',
                })

                pushNotesContent(data.note.id, data.note.noteDate, {
                    id: data.id,
                    noteContentContent: data.noteContentContent,
                    noteContentDate: data.noteContentDate,
                    noteContentTitle: data.noteContentTitle,
                })
            })
            .catch((error) => {
                pushMessage({
                    title: 'Thất bại',
                    message: 'Thêm ghi chú thất bại',
                    type: 'ERROR',
                })
            })

        showModal(false)
    }

    return (
        <div className="sc1366:w-[621px] sc1536:w[621px]  sc1536:h-[528.55px] sc1366:h-[528.55px] sc1920:h-[602px] p-[41px] sc1920:w-[904px] bg-white rounded-3xl">
            <h2 className="text-center text-[32px] text-primary_blue font-bold">TẠO GHI CHÚ</h2>
            <form onSubmit={subMitForm} className="flex flex-col justify-around h-full">
                <div className="flex flex-col">
                    <label htmlFor="title" className="text-lg font-medium mb-2">
                        Tiêu đề:
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="noteTitle"
                        required
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setNote({
                                ...note,
                                noteTitle: event.target.value,
                            })
                        }}
                        className="grow w-full h-[60px] py-1.5  leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2  text-black"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="file" className="text-lg font-medium mb-2">
                        Nội dung ghi chú:
                    </label>

                    <textarea
                        name="noteContent"
                        required
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                            setNote({
                                ...note,
                                noteContent: event.target.value,
                            })
                        }}
                        className="w-full rounded py-1.5 focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2  text-black"
                        rows={5}
                    ></textarea>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="title" className="text-lg font-medium mb-2">
                        Thời gian ghi chú
                    </label>

                    {/* <input type="date" onChange={dateTime} name="" id="" /> */}
                    <input
                        type="time"
                        value={timeEvent}
                        required
                        onChange={handleTime}
                        className="text-[#636363] h-[60px] text-[14px] font-normal  w-[200px] p-1.5  leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2"
                    />

                    {/* <DatePicker className='rounded-md text-center border-solid w-[135px] text-lg font-medium  focus:border-transparent focus:outline-none focus:ring-2  border-2 my-2 h-12 mr-4 border-gray-300 p-2' selected={startDate} onChange={setdate} />         */}
                </div>

                <div className="flex justify-end">
                    <button
                        className="w-[180px] h-[50px] flex justify-center duration-300 items-center rounded-[10px] hover:shadow-lg  text-primary text-lg font-medium mx-3"
                        onClick={() => showModal(false)}
                    >
                        Huỷ
                    </button>
                    <button className="w-[180px] h-[50px] flex justify-center items-center rounded-[10px] duration-300 hover:shadow-lg  bg-light_blue text-[#fff] text-lg font-medium">
                        Xong
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateEvent
