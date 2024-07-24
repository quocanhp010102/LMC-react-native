import React from 'react'
import ListMemberCourse from '../../components/ListMemberCourse'
import { Teacher, CourseStudent } from '../../types/index'
import { Student } from '../../types'

type Props = {
    lecturer: Teacher
    students: CourseStudent[]
    total: string | number
    currentStudent?: string | number
    onClick?: (id: any) => void
}

function ListMemberCourseContainer({ lecturer, total, students, currentStudent, onClick }: Props) {
    return (
        <div className="p-5 text-[#636363]">
            <div className="flex items-center text-2xl ">
                <img src="\img/thanhviens.png" alt="" /> Thành viên khóa học: {total}
            </div>
            <div className="my-6">
                <div className="flex items-center  mb-2">
                    <h2>Giảng Viên</h2>
                    <span className="ml-1">
                        <img src="\img\calendar_icondown.png" alt="" />
                    </span>
                </div>
                <div className="flex mb-7 items-center">
                    {lecturer?.lecturer_avatar ? (
                        <img className="w-10 h-10 rounded-[100rem] object-cover" src={lecturer?.lecturer_avatar} alt="ảnh người" />
                    ) : (
                        <div className="w-10 h-10 rounded-[100rem] bg-[#2196f3] flex items-center justify-center">
                            {lecturer?.lecturer_fullname.slice(0, 1).toUpperCase()}
                        </div>
                    )}

                    <p className="text-lg ml-5 font-medium text-[#636363]">{lecturer?.lecturer_fullname}</p>
                </div>
            </div>

            <div className="my-6">
                <div className="flex items-center mb-2">
                    <h2>Học sinh</h2>{' '}
                    <span className="ml-1">
                        <img src="\img\calendar_icondown.png" alt="" />
                    </span>
                </div>
                {students &&
                    students.map((student, index) => {
                        return (
                            <ListMemberCourse
                                onClick={onClick}
                                isActive={student?.student?.id === currentStudent}
                                user={student}
                                key={index}
                            />
                        )
                    })}

                    
            </div>
        </div>
    )
}

export default ListMemberCourseContainer
