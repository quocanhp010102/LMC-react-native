import clsx from 'clsx'
import { useContext, useEffect, useState } from 'react'
import { __Date } from '../types'
import { DateContext } from '../Context/DateContext'
import { CalendarService } from '../services/CalendarService'

function Calendar() {
    const Days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']

    const { datePicker, setDatePicker, setNoteToEvent, listNoteid, setDateEventClick } = useContext(DateContext)
    // list day current month
    const [arrDays, setArrdays] = useState<__Date[]>([])

    // handle show, hide droplist year and month

    // render when mount dashboard in Dom

    useEffect(() => {
        renderCalender(datePicker.year, datePicker.month)
        return () => {
            cancelRequest()
        }
    }, [datePicker])

    const cancelRequest = () => {
        const cancel = new AbortController()
        cancel.abort()
    }

    const renderCalender = (year: string, month: string) => {
        // pre month
        const preMonthday = new Date(+month === 1 ? +year - 1 : +year, +month === 1 ? 12 : +month - 1, 0)
        const preMonth = preMonthday.getDate()

        // current month
        const currentMonth = new Date(+year, +month, 0)

        const lastDate = currentMonth.getDate()
        currentMonth.setDate(1)

        const offsetPreDays = currentMonth.getDay()

        // next month
        const nextMonth = new Date(+year, +month + 1, 0)
        const nextDays = nextMonth.getDate()

        const newArr: __Date[] = []

        for (let i = (offsetPreDays === 0 ? 7 : offsetPreDays) - 1; i > 0; i--) {
            preMonthday.setDate(preMonth - i + 1)

            newArr.push({
                day: `00${preMonth - i + 1}`.slice(-2),
                month: `00${+month === 1 ? 12 : +month - 1}`.slice(-2),
                year: `${+month === 1 ? +year - 1 : +year}`,
                weekday: hanldeDay(preMonthday.getDay()),
            })
        }

        for (let i = 1; i <= lastDate; i++) {
            currentMonth.setDate(i)

            newArr.push({
                day: `00${i}`.slice(-2),
                month: `00${month}`.slice(-2),
                year: year,
                weekday: hanldeDay(currentMonth.getDay()),
            })
        }

        for (let i = 1; i <= nextDays; i++) {
            nextMonth.setDate(i)

            newArr.push({
                day: `00${i}`.slice(-2),
                month: `00${+month === 12 ? 1 : +month + 1}`.slice(-2),
                year: `${+month === 12 ? +year + 1 : +year}`,
                weekday: hanldeDay(nextMonth.getDay()),
            })
        }

        setArrdays(newArr.slice(0, 42))
    }

    // sử lý lấy thứ
    const hanldeDay = (day: number) => {
        return Days[day === 0 ? 7 - 1 : day - 1]
    }

    // lắng nghe sự kiện thay đổi tháng
    const changeMonth = (month: number) => {
        let monthActive: number, year: number
        if (month === -1) {
            year = +datePicker.month + month > 0 ? +datePicker.year : +datePicker.year - 1
            monthActive = +datePicker.month + month > 0 ? +datePicker.month + month : 12
        } else {
            year = +datePicker.month + month <= 12 ? +datePicker.year : +datePicker.year + 1
            monthActive = +datePicker.month + month <= 12 ? +datePicker.month + month : 1
        }

        renderCalender(year.toString(), monthActive.toString())

        const dateForMonth = new Date(year, monthActive, 0)
        dateForMonth.setDate(+datePicker.day)

        setDatePicker({
            ...datePicker,
            year: year + '',
            month: `00${monthActive}`.slice(-2),
            weekday: hanldeDay(dateForMonth.getDay()),
        })
        // }
    }

    // active when click to a day
    const activeDay = (date: __Date) => {
        let note = listNoteid.find((notes) => notes.noteDate === `${date.year}-${date.month}-${date.day}`)
        const dateString = `${date.year}-${date.month}-${date.day}`
        setDateEventClick(dateString)
        setNoteToEvent(note?.id || null)

        // unRender when change month
        if (date.month !== datePicker.month) {
            renderCalender(date.year, date.month)
        }

        setDatePicker({
            ...datePicker,
            day: date.day,
            month: date.month,
            year: date.year,
            weekday: date.weekday,
        })
    }

    return (
        <>
            <div className="calendar w-full font-medium">
                <div className="calendar-header py-[46px] flex justify-between">
                    <h1 className="text-2xl  font-bold text-[#000]">
                        Tháng {datePicker.month}, {datePicker.year}
                    </h1>
                    <div className="calendar-option flex">
                        <span className="transition-all duration-200" onClick={() => changeMonth(-1)}>
                            <img src="\img\arrowUp.png" alt="" />
                        </span>
                        <span className="transition-all duration-200" onClick={() => changeMonth(1)}>
                            <img src="\img\calendar_icondown.png" alt="" />
                        </span>
                    </div>
                </div>

                <div className="calender-item">
                    <div className="grid grid-cols-7 gap-4 text-center text-[#000]">
                        <p>Mon</p>
                        <p>Tue</p>
                        <p>Wed</p>
                        <p>Thu</p>
                        <p>Fri</p>
                        <p>Sat</p>
                        <p>Sun</p>
                    </div>
                    <div className="w-full mt-2 mb-7 h-[2px] bg-black"></div>

                    <div className="grid grid-cols-7 gap-x-4 text-center">
                        {arrDays.map((date, index) => {
                            return (
                                <span
                                    onClick={() => activeDay(date)}
                                    key={index}
                                    className={clsx('relative', {
                                        'current-day':
                                            +date.day === new Date().getDate() &&
                                            +date.month === new Date().getMonth() + 1 &&
                                            +date.year === new Date().getFullYear(),
                                        active:
                                            +datePicker.day === +date.day &&
                                            +datePicker.month === +date.month &&
                                            datePicker.year === date.year,
                                        unActive: +datePicker.month !== +date.month,
                                        has_note: listNoteid.some((value) => {
                                            return value.noteDate === `${date.year}-${date.month}-${date.day}`
                                        }),
                                    })}
                                >
                                    {date.day}
                                </span>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Calendar
