import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useClickOutItem from '../hooks/useClickOutItem'
import { stateType } from '../types'

type propsContent = {
    isList?: boolean
    Department: stateType
    itemDelete?: stateType[]
    value?: number
    roles?: string
    setItemDelete?: (value: any) => void
    onClickDepartment?: (department: stateType) => void
}

function Department({ Department, isList, value, itemDelete, roles, setItemDelete, onClickDepartment }: propsContent) {
    const { isShow, setShow, ref } = useClickOutItem(false)
    const navigate = useNavigate()
    const handleOnclick = () => {
        if (!isShow && onClickDepartment) {
            setShow(true)
            onClickDepartment(Department)
        }
    }
    const handleShowTootip = (length?: number) => {
        if (length && length > 17) {
            setTooltip(true)
        } else {
            setTooltip(false)
        }
    }
    const handleOnDoupleClick = (id: number) => {
        navigate(`/manager-department/${id}`)
    }
    const [isTootip, setTooltip] = useState(false)

    useEffect(() => {
        let timeout: any
        if (roles !== 'STUDENT') {
            if (!isShow && isList && itemDelete.length > 0) {
                timeout = setTimeout(() => {
                    if (value === itemDelete[0].id) {
                        setItemDelete!([])
                    }
                }, 250)
            }
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [isShow, isList, itemDelete, setItemDelete])
    return (
        <div
            ref={ref}
            onClick={() => handleOnclick()}
            onDoubleClick={() => handleOnDoupleClick(Department.id)}
            className={clsx('rounded-md  h-[179px] border-2 border-solid cursor-pointer', {
                'border-light_blue': isShow,
                'border-slate-300': !isShow,
            })}
        >
            <div className="grid grid-flow-row h-[179px] grid-rows-3">
                <div className="row-span-2 overflow-hidden min-h-[100px] max-h-[150px]">
                    <img
                        className="min-w-full max-w-full min-h-full max-h-full object-cover"
                        src={
                            Department.department_image
                                ? Department.department_image
                                : 'https://img.lovepik.com/photo/40015/9423.jpg_wh860.jpg'
                        }
                        alt={Department.department_name ? Department.department_name : ''}
                    />
                </div>
                <div
                    onMouseEnter={() => handleShowTootip(Department?.department_name.length)}
                    onMouseLeave={() => handleShowTootip()}
                    className="row-span-1 flex flex-col justify-evenly items-center relative"
                >
                    <p className="uppercase text-center text-color63 text-lg">
                        {Department?.department_name.length <= 17
                            ? Department?.department_name
                            : Department?.department_name.slice(0, 14) + '...'}
                    </p>
                    <p className="text-[#909090] text-sm">{Department?.courses?.length} khóa học</p>
                    {isTootip && (
                        <div className="after-tootip absolute top-[107%] h-auto bg-white text-black left-0 w-auto min-w-[110%]  px-2 py-3 z-10 border border-solid border-borderColor">
                            {Department?.department_name.toLocaleUpperCase()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Department
