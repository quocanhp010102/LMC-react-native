import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { ContextProfile } from '../../components/UserInfo'

type UserInfo = {
    type: string
    title: string
    value: string
}

export default function UserInfoItem({ type, value, title }: UserInfo) {
    return (
        <div className="w-full flex flex-col items-left">
            <div className="flex items-left">
                <b className='text-primary_blue text-lg font-bold'>{title}</b>
            </div>

            {type !== 'gender' ? <p className='text-lg text-color63'>{value || ''}</p> : <p className='text-lg text-color63'>{value === null ? "Chưa cập nhật" : (+value === 1 ? 'Nam' : 'Nữ')}</p>}
        </div>
    )
}
