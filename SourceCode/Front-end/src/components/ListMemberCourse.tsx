import React from 'react'
import { CourseStudent, Student } from '../types'
import clsx from 'clsx'

type Props = {
    user: CourseStudent
    isActive?: boolean
    onClick?: (id: any) => void
}

function ListMemberCourse({ user, isActive, onClick }: Props) {

    return (
        <div className={clsx("flex relative cursor-pointer  mb-7 items-center text-[#636363]", {"opacity-50":isActive, "hover:text-[#ccc]":!isActive})} onClick={()=> !isActive && `${user.point}`.toLowerCase() !== "chưa thi" && onClick(user.student.id)}>
            {user?.student?.student_avatar ? (
                <img className="w-10 h-10 rounded-[100rem] object-cover" src={user?.student?.student_avatar} alt="ảnh người" />
            ) : (
                <div className="w-10 h-10 rounded-[100rem] text-[#fff] bg-[#2196f3] flex items-center justify-center">
                    {user?.student?.student_fullname.slice(0, 1).toUpperCase()}
                </div>
            )}
            <p className="text-lg ml-5 font-medium">{user?.student?.student_fullname}</p>
            {
                user.point ? (
                    <p className={clsx('absolute top-0 right-0 text-base font-medium', {"text-[#D70000]":`${user.point}`.toLowerCase() === "chưa thi", "text-[#D7A700]":`${user.point}`.toLowerCase() === "chưa chấm", "text-[#00A717]": typeof +user.point === 'number'})}>{user.point}</p>
                ): ""
            }
        </div>
        //  'text-[#00A717]': percent == 100,
        //  'text-[#D7A700]': +percent < 100 && +percent >= 50,
        //  'text-[#D70000]': +percent < 50,
    )
}

export default ListMemberCourse
