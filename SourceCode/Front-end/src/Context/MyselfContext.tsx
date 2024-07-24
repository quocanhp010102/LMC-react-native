import { createContext, ReactNode, useEffect, useState } from 'react'
import { LecturerService } from '../services/LecturerService'
import { ManagerUserService } from '../services/ManagerUserService'
import { StudentService } from '../services/StudentService'
import UserService from '../services/UserService'
import { Admin, ADMIN, LECTURER, STUDENT, Student, Teacher } from '../types'

type Props = {
    children: ReactNode
}

type Content = {
    User: any
    updateAvatar: (url: any) => void,
    isLoading: boolean
}

export const DContextProfile = createContext<Content>({
    User: null,
    updateAvatar: (url: any) => {},
    isLoading: true
})

export default function MyselfContext({ children }: Props) {
    const [content, setContent] = useState<Student | Teacher | Admin>(null)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        ;(async () => {
            if (UserService.hasRole([STUDENT])) {
                const data: Student = await StudentService.getMySelf()
                setContent(data)
            } else if (UserService.hasRole([LECTURER])) {
                const data: Teacher = await LecturerService.getCurrenLecturer()
                setContent(data)
            } else if (UserService.hasRole([ADMIN])) {
                const data: Admin = await ManagerUserService.getProfileAdmin()
                setContent(data)
            }
            setIsLoading(false)
        })()
    }, [])

    const updateAvatar = async (url: any) => {
        setIsLoading(true);
        const data = await StudentService.updateAvatar([url])

        if (UserService.hasRole([STUDENT])) {
            const user: Student = content
            setContent({
                ...user,
                student_avatar: url,
            })
        } else if (UserService.hasRole([LECTURER])) {
            const user: Teacher = content

            setContent({
                ...user,
                lecturer_avatar: url,
            })
        } else if (UserService.hasRole([ADMIN])) {
            const user: Admin = content
            setContent({
                ...user,
                admin_avatar: url,
            })
        }
        setIsLoading(false)

        return data
    }

    return <DContextProfile.Provider value={{ User: content, updateAvatar, isLoading }}>{children}</DContextProfile.Provider>
}
