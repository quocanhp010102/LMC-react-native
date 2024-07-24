import React, { createContext, ReactNode, useState } from 'react'
import { __Date } from '../types'
import { CalendarService } from './../services/CalendarService'
import { useEffect } from 'react'
import UserService from './../services/UserService'

type Props = {
    children: ReactNode
}

type NoteContent = {
    id: string | number
    noteContentTitle: string
    noteContentContent: string
    noteContentDate: string
}

type Note = {
    id: string | number | null
    noteDate: string | null
    noteContents: NoteContent[] | any[]
}

interface __DateContext {
    datePicker: __Date
    setDatePicker: (_date: React.SetStateAction<__Date>) => void
    NotesCalendar: Note
    setNoteToEvent: (id: any) => void
    deleteNoteContent: (id: any) => void
    pushNotesContent: (id: any, noteDate: string, noteContent: NoteContent) => void
    pushNodeId: (id: any, noteDate: string, noteContent: NoteContent) => void
    setDateEventClick: (date: string) => void
    listNoteid?: any[]
}

const dateContextFake: __DateContext = {
    datePicker: {
        day: '',
        month: '',
        year: '',
        weekday: '',
    },
    setDatePicker: () => null,
    NotesCalendar: null,
    setNoteToEvent: (id: any) => null,
    deleteNoteContent: (id: any) => null,
    pushNotesContent: (id: any, noteDate: string, noteContent: NoteContent) => {},
    pushNodeId: (id: any, noteDate: string, noteContent: NoteContent) => {},
    setDateEventClick: (date: string) => {},
    listNoteid: [],
}

export const DateContext = createContext(dateContextFake)

function DateContextProvider({ children }: Props) {
    const date = new Date()
    const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    const [NotesCalendar, setNotes] = useState<Note>({
        id: null,
        noteDate: null,
        noteContents: [],
    })
    const [listNoteid, setListNodeId] = useState<any[]>([])
    const [dateEvent, setDateEvent] = useState<string | null>()
    const [datePicker, setDatePicker] = useState<__Date>({
        day: `00${date.getDate()}`.slice(-2),
        month: `00${date.getMonth() + 1}`.slice(-2),
        year: `${date.getFullYear()}`,
        weekday: 'Hôm nay',
    })

    useEffect(() => {
        if (UserService.isLoggedIn()) {
            ;(async () => {
                const data = await CalendarService.getEventCalendar(
                    `${datePicker.day}-${month[+datePicker.month - 1]}-${datePicker.year}`,
                )
                if (data) {
                    setListNodeId(data)
                    const note = data.find(
                        (notes: any) => notes.noteDate === `${datePicker.year}-${datePicker.month}-${datePicker.day}`,
                    )
                    if (note) {
                        setNoteToEvent(note.id)
                    }
                }
            })()
        }
    }, [datePicker.month, datePicker.year])

    const setNoteToEvent = (id: any) => {
        if (id) {
            CalendarService.getNotesByid(id)
                .then((data: any) => {
                    setNotes(data)
                })
                .catch((error) => {})
        } else {
            setNotes({
                id: '',
                noteDate: '',
                noteContents: [],
            })
        }
    }

    const setDateEventClick = (date: string) => {
        setDateEvent(date)
    }
    const pushNotesContent = (id: any, noteDate: string, noteContent: NoteContent) => {
        const notes = NotesCalendar
        notes.noteContents.unshift(noteContent)
        setNotes({
            ...notes,
            id,
            noteDate,
        })

        const isCheck = listNoteid.some((node) => node.id === id)
        if (!isCheck) {
            setListNodeId([...listNoteid, { id, noteDate }])
        }
    }

    const pushNodeId = (id: number, noteDate: string, noteContent: NoteContent) => {
        const check = listNoteid.some((value) => value.id === +id)
        if (!check) {
            setListNodeId([...listNoteid, { id, noteDate }])
        }
    }
    const deleteNoteContent = (id: any) => {
        const notes = NotesCalendar
        notes.noteContents.forEach((note, index) => {
            if (note.id === id) {
                notes.noteContents.splice(index, 1)
            }
        })

        if (notes.noteContents.length === 0) {
            const noteIds = listNoteid.filter((note) => note.id !== notes.id)
            setListNodeId([...noteIds])
        }

        setNotes({
            ...notes,
        })
    }

    return (
        <>
            <DateContext.Provider
                value={{
                    datePicker,
                    setDatePicker,
                    setNoteToEvent,
                    NotesCalendar,
                    deleteNoteContent,
                    pushNotesContent,
                    pushNodeId,
                    listNoteid,
                    setDateEventClick,
                }}
            >
                {children}
            </DateContext.Provider>
        </>
    )
}

export default DateContextProvider
