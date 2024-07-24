import React, { ChangeEvent, createContext, SetStateAction, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { StudentService } from '../services/StudentService'
import UserInfoItem from '../containers/common/UserInfoItem'
import UserService from '../services/UserService'
import { STUDENT, LECTURER, ADMIN, Student, Teacher, Admin } from '../types'
import { UploadService } from '../services/UploadService'
import { useNavigate } from 'react-router-dom'
import { LecturerService } from '../services/LecturerService'
import { ContextMessage } from '../Context/ShowMessage'
import { DContextProfile } from '../Context/MyselfContext'
import { ContextModal } from '../Context/ModalContext'
import Loading from './Loading'

type props = {}

type ContextUser = {
    setUserInfor: (student: SetStateAction<UserInfor>) => void
    updateUser: () => any
    UserInfor: UserInfor
}

type UserInfor = {
    id?: string | number
    avatar: string
    birthday: string
    email: string
    fullname: string
    gender: string
    phone: string
    code: string
    user: {
        id: string | number
    }
}

export const ContextProfile = createContext<ContextUser>({
    setUserInfor: () => null,
    updateUser: () => null,
    UserInfor: null,
})

function UserInfo({ user }: any) {
    const [UserInfor, setUserInfor] = useState<UserInfor>(null)
    const [avatar, setAvatar] = useState<string>()
    const { User, updateAvatar, isLoading } = useContext(DContextProfile)
    const { showModal } = useContext(ContextModal)

    const navigate = useNavigate()

    useEffect(() => {
        if (UserService.hasRole([STUDENT])) {
            const userNews: Student = User
            const data: UserInfor = {
                id: userNews?.id,
                avatar: userNews?.student_avatar,
                birthday: userNews?.student_birthday,
                email: userNews?.student_email,
                fullname: userNews?.student_fullname,
                gender: userNews?.student_gender,
                phone: userNews?.student_phone,
                code: userNews?.student_code,
                user: {
                    id: userNews?.user.id,
                },
            }
            setAvatar(userNews?.student_avatar)
            setUserInfor(data)
        } else if (UserService.hasRole([LECTURER])) {
            const newLecturer: Teacher = User

            const data = {
                id: newLecturer?.id,
                avatar: newLecturer?.lecturer_avatar,
                birthday: newLecturer?.lecturer_birthday,
                email: newLecturer?.lecturer_email,
                fullname: newLecturer?.lecturer_fullname,
                gender: newLecturer?.lecturer_gender,
                phone: newLecturer?.lecturer_phone,
                code: newLecturer?.lecturer_code,
                user: {
                    id: newLecturer?.user.id,
                },
            }

            setAvatar(newLecturer?.lecturer_avatar)
            setUserInfor(data)
        } else if (UserService.hasRole([ADMIN])) {
            const newAdmin: Admin = User

            const data = {
                id: newAdmin?.id,
                avatar: newAdmin?.admin_avatar,
                birthday: newAdmin?.admin_birthday,
                email: newAdmin?.admin_email,
                fullname: newAdmin?.admin_fullname,
                gender: newAdmin?.admin_gender,
                phone: newAdmin?.admin_phone,
                code: newAdmin?.admin_code,
                user: {
                    id: newAdmin?.user.id,
                },
            }

            setAvatar(newAdmin?.admin_avatar)
            setUserInfor(data)
        }
    }, [User])



    const changeAvatarInput = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0]
        // setAvatar(URL.createObjectURL(file));

        const formData = new FormData()
        formData.append('file', file)

        const url = await UploadService.uploadFile(formData)

        if (url) {
            const data: any = await updateAvatar(url)

            setAvatar(url)
        }
    }

    const logout = () => {
        showModal(false)
        navigate('/')
        UserService.doLogout()
    }
    return (
        <div className="pt-[12%] w-full h-full bg-[#FBFBFB]">
            <div className="grid justify-items-center">
                {/* UserInfor && UserInfor.avatar ? UserInfor.avatar : ` */}
                <div className="relative flex items-center  w-[100px] rounded-[50%] h-[100px] overflow-hidden">
                    {
                        isLoading && (<div className='absolute bg-[#0000003d] z-50 inset-0 flex justify-center items-center'>
                              <Loading color='#fff'/>
                                 </div>
                                  )
                        }
                                <img
                                    className="object-cover aspect-square w-full h-full border-solid rounded-[50%]"
                                    src={avatar ? avatar : `/img/persion1.png`}
                                />
                                <label
                                    htmlFor="avatar_profile"
                                    className="absolute cursor-pointer bottom-0 flex items-center justify-center rounded-br-[50%] rounded-bl-[50%] right-0 left-0 h-[25%] bg-[#03000070]"
                                >
                                    <img src="\img\changeImge.png" />
                                    <input hidden onChange={changeAvatarInput} type="file" id="avatar_profile" />
                                </label>
                                

                        
                    
                </div>

                <div className="mt-[7%] text-4xl">{UserInfor && UserInfor.fullname}</div>
                <div>
                    <button
                        className="bg-[#ff392f16] text-[#FF3B2F] font-medium text-lg  px-[13px] py-[9px] mt-[30%] mb-[60%] rounded-[8px]"
                        onClick={logout}
                    >
                        Log out
                    </button>
                </div>
                <div className="w-[80%] h-[1px] opacity-30" style={{ backgroundColor: '#7D7D7D' }}></div>
            </div>
            <div className="grid pt-[8%] pl-[10%]">
                <div className="grid grid-cols-2 gap-8 ">
                    <UserInfoItem type="fullname" value={UserInfor?.fullname} title="Họ tên" />
                    <UserInfoItem type="gender" value={UserInfor?.gender} title="Giới tính" />
                    {/* <UserInfoItem type="birthday" value={UserInfor?.birthday} title="Ngày sinh" />
                    <UserInfoItem type="phone" value={UserInfor?.phone} title="Số điện thoại" /> */}
                    <div className="flex flex-col col-span-2 item-left">
                        <b className='text-primary_blue text-lg font-bold'>Email</b>

                        <p className='text-lg text-color63 break-words' >{UserInfor?.email}</p>
                    </div>

                    <div className="flex flex-col items-left">
                        <b className='text-primary_blue text-lg font-bold'>
                            {UserService.hasRole([STUDENT])
                                ? 'Mã sinh viên'
                                : UserService.hasRole([LECTURER])
                                ? 'Mã Giáo viên'
                                : UserService.hasRole([ADMIN]) && 'Mã Phòng đào tạo'}
                        </b>

                        <p className='text-lg text-color63'>{UserInfor?.code}</p>
                    </div>
                    {/* <div className="flex flex-col">
                        <b>Ngôn ngữ</b>
                    <select
                        value="banana"
                        className="w-[100%] my-[2%] p-[2%] border-solid border-[1px] border-[#7D7D7D] rounded-[10px]"
                    >
                        <option value={'vie'}>{'Việt Nam'}</option>
                        <option value={'eng'}>{'Tiếng Anh'}</option>
                    </select>
                    </div> */}
                </div>
                {/* <div className="w-[100%] ml-[40%]">
                </div> */}
            </div>
        </div>
    )
}

export default UserInfo
