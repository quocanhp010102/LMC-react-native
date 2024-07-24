import React, { useContext, useState } from 'react'
import { LECTURER } from '../../types'
import { ContextModal } from './../../Context/ModalContext'

type Props = {
    user: any | null
    title: string
    type: 'ADD' | 'UPDATE' | 'VIEW'
}

function CreateUserModal({ user, title, type }: Props) {
    const { showModal } = useContext(ContextModal)


    return (
        <div className="sc1920:w-[854px]  sc1366:w-[620px] sc1920:h-[930px]  sc1366:h-[620px] flex flex-col p-[44px] bg-white rounded-lg">
            <h2 className="uppercase text-center text-[28px] text-primary_blue font-bold">{title}</h2>
            <div className="mt-8 flex-1">
                <form className="h-full flex flex-col">
                    <div className="grid grid-cols-2 gap-x-[100px]">
                        <div className="flex flex-col mb-8">
                            <label htmlFor="" className="mb-4 text-color63 sc1920:text-2xl sc1366:text-base sc1536:text-base font-medium">
                                Họ và tên:
                            </label>
                            {type === 'VIEW' ? (
                                <p className="sc1366:text-sm sc1536:text-sm sc1920:text-xl  font-normal text-text_com pb-2 border-b-[1px] border-solid border-[#ccc]">{user?.name}</p>
                            ) : (
                                <input
                                    readOnly
                                    value={user?.name}
                                    required
                                    className="rounded-lg text-2xl font-normal text-text_com border-2 border-solid border-[#D0D0D0] w-full px-1 py-2 focus:outline-1 focus:outline-[#35baf6]"
                                />
                            )}
                        </div>

                        <div className="flex flex-col mb-8">
                            <label htmlFor="" className="mb-4 text-color63 sc1920:text-2xl sc1366:text-base sc1536:text-base font-medium">
                                Mã người dùng:
                            </label>
                            {type === 'VIEW' ? (
                                <p className="sc1366:text-sm sc1536:text-sm sc1920:text-xl  font-normal text-text_com pb-2 border-b-[1px] border-solid border-[#ccc]">{user?.Mand}</p>
                            ) : (
                                <input
                                    value={user?.Mand}
                                    required
                                    className="rounded-lg text-sm font-normal text-text_com border-2 border-solid border-[#D0D0D0] w-full px-1 py-2 focus:outline-1 focus:outline-[#35baf6]"
                                />
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-[100px]">
                        <div className="flex flex-col mb-8">
                            <label htmlFor="" className="mb-4 text-color63 sc1920:text-2xl sc1366:text-base sc1536:text-base font-medium">
                                Giới tính:
                            </label>

                            {type === 'VIEW' ? (
                                <p className="sc1366:text-sm sc1536:text-sm sc1920:text-xl  font-normal text-text_com pb-2 border-b-[1px] border-solid border-[#ccc]">{user.gender === null ? "Chưa cập nhật" : (user.gender === 1 ? 'Nam' : 'Nữ')}</p>
                            ) : (
                                <select
                                    defaultValue={user?.gender}
                                    required
                                    className="rounded-lg border-2 border-solid border-[#D0D0D0] w-full px-1 py-2 focus:outline-1 focus:outline-[#35baf6]"
                                >
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="k">Khác</option>
                                </select>
                            )}
                            {/* <input className='rounded-lg border-2 border-solid border-[#D0D0D0] w-full px-1 py-2 focus:outline-1 focus:outline-[#35baf6]'/> */}
                        </div>

                        <div className="flex flex-col mb-8">
                            <label htmlFor="" className="mb-4 text-[#636363] sc1920:text-2xl sc1366:text-base sc1536:text-base font-medium">
                                Phân quyền:
                            </label>
                            {type === 'VIEW' ? (
                                <p className="sc1366:text-sm sc1536:text-sm sc1920:text-xl  font-normal text-text_com pb-2 border-b-[1px] border-solid border-[#ccc]">
                                    {user?.role.includes(LECTURER) ? 'Giảng viên' : 'Sinh viên'}
                                </p>
                            ) : (
                                <select
                                    value={user?.role}
                                    required
                                    className="rounded-lg text-sm font-normal text-text_com border-2 border-solid border-[#D0D0D0] w-full px-1 py-2 focus:outline-1 focus:outline-[#35baf6]"
                                >
                                    <option value="student">Sinh viên</option>
                                    <option value="teacher">Giáo viên</option>
                                </select>
                            )}
                        </div>

                        {/* <div className="flex flex-col mb-8">
                            <label htmlFor="" className="mb-4 text-color63 text-2xl font-medium">
                                Ngày sinh:
                            </label>
                            {type === 'VIEW' ? (
                                <p className="text-2xl ml-[19px] font-normal text-text_com">{user?.date}</p>
                            ) : (
                                <input
                                    readOnly
                                    value={user?.date}
                                    data-date-format="YYYY MMMM DD"
                                    required
                                    type="date"
                                    className="rounded-lg border-2 border-solid border-[#D0D0D0] w-full px-1 py-2 focus:outline-1 focus:outline-[#35baf6]"
                                />
                            )}
                        </div> */}
                    </div>

                    {/* <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col mb-8">
                            <label htmlFor="" className="mb-4 text-color63 text-2xl font-medium">
                                Số điện thoại:
                            </label>

                            {type === 'VIEW' ? (
                                <p className="text-2xl ml-[19px] font-normal text-text_com">{user?.number}</p>
                            ) : (
                                <input
                                    value={user?.number}
                                    required
                                    type="text"
                                    className="rounded-lg text-2xl font-normal text-text_com border-2 border-solid border-[#D0D0D0] w-full px-1 py-2 focus:outline-1 focus:outline-[#35baf6]"
                                />
                            )}
                        </div>

                       
                    </div> */}
                    <div className="grid grid-cols-2 gap-x-[100px]">
                        <div className="flex flex-col mb-8">
                            <label htmlFor="" className="mb-4 text-color63 sc1920:text-2xl sc1366:text-base sc1536:text-base font-medium">
                                Email:
                            </label>

                            {type === 'VIEW' ? (
                                <p className="sc1366:text-sm sc1536:text-sm sc1920:text-xl font-normal text-text_com  pb-2 border-b-[1px] border-solid border-[#ccc]">{user?.email}</p>
                            ) : (
                                <input
                                    readOnly
                                    value={user?.email}
                                    required
                                    type="email"
                                    className="rounded-lg border-2 text-2xl font-normal text-text_com border-solid border-[#D0D0D0] w-full px-1 py-2 focus:outline-1 focus:outline-[#35baf6]"
                                />
                            )}
                        </div>

                      
                                <div className="flex flex-col mb-8">
                                    <label htmlFor="" className="mb-4  text-color63 sc1920:text-2xl sc1366:text-base sc1536:text-base font-medium">
                                        Lớp:
                                    </label>

                                    {type === 'VIEW' ? (
                                        <p className="sc1366:text-sm sc1536:text-sm sc1920:text-xl  font-normal text-text_com pb-2 border-b-[1px] border-solid border-[#ccc]">{user?.class}</p>
                                    ) : (
                                        <input
                                            readOnly
                                            value={user?.class}
                                            required
                                            type="email"
                                            className="rounded-lg border-2 text-2xl font-normal text-text_com border-solid border-[#D0D0D0] w-full px-1 py-2 focus:outline-1 focus:outline-[#35baf6]"
                                        />
                                    )}
                                </div>
                            
                        
                    </div>



                    <div className="flex-1 flex justify-end items-end">
                        <button
                            type="reset"
                            onClick={() => showModal(false)}
                            className="w-[180px] h-[50px] rounded-[10px] border-[1px] border-solid border-text_light_blue text-primary text-lg font-medium mx-3"
                        >
                            {type !== 'VIEW' ? 'Huỷ' : 'Quay lại'}
                        </button>
                        {type !== 'VIEW' ? (
                            <button
                                type="submit"
                                className="w-[180px] h-[50px] rounded-[10px] bg-color63 text-[#fff] text-lg font-medium"
                            >
                                Cập nhật
                            </button>
                        ) : (
                            ''
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateUserModal
