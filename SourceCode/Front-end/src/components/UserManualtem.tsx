import { CheckOutlined } from '@ant-design/icons'
import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { tutorialType } from '../containers/TypeProps/TutorialProps'
import useClickOutItem from '../hooks/useClickOutItem'

interface Props {
    isList?: boolean
    onClickItem?: (value: any) => void
    setItemDelete?: (value: any) => void
    onDoubleClick?: (value: any) => void
    itemDelete?: tutorialType[]
    value: number
    ListTutorial: tutorialType
    roles?: string
}

function UserManualItem(props: Props) {
    const { isList, roles, setItemDelete, itemDelete, onDoubleClick, onClickItem, ListTutorial, value } = props

    const { isShow, setShow, ref } = useClickOutItem(false)
    // const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        let timeout: any
        if (roles !== 'STUDENT') {
            if (!isShow && isList) {
                timeout = setTimeout(() => {
                    if (value === itemDelete![0]?.id) {
                        setItemDelete!([])
                    }
                }, 250)
            }
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [isShow, isList, itemDelete, setItemDelete])

    const handleActive = () => {
        if (isList && onClickItem) {
            setShow!(true)
            onClickItem!(ListTutorial)
        }
    }

    const deleteItems = () => {
        if (itemDelete![0]?.id === ListTutorial.id) {
            setItemDelete!([])
        } else {
            setItemDelete!([ListTutorial])
        }
    }

    return (
        <div
            ref={ref}
            onClick={handleActive}
            onDoubleClick={() => onDoubleClick(ListTutorial.tutorial_video)}
            className={clsx('grid-flow-row grid rounded-lg border-2  border-solid cursor-pointer', {
                'border-light_blue': isShow,
                'border-slate-300': !isShow,
                'grid-flow-col grid-cols-12 h-[80px] gap-x-2': !isList,
                'grid-rows-5 w-full sc1920:h-[212px] sc1536:h-[215px] sc1366:h-[190px]': isList,
            })}
        >
            <div
                className={clsx('bg-slate-300 overflow-hidden relative', {
                    'row-span-3 ': isList,
                    'col-span-2': !isList,
                })}
            >
                {' '}
                <div className="border-2 h-full">
                    <img
                        className="w-full h-full object-cover"
                        src={ListTutorial?.tutorial_image ? ListTutorial?.tutorial_image : 'imgplayorpause.png'}
                        alt={ListTutorial?.tutorial_title || ''}
                    />
                </div>
            </div>
            <div
                className={clsx({
                    'row-span-2 p-2 text-ellipsis overflow-hidden': isList,
                    'col-span-9 text-ellipsis overflow-hidden': !isList,
                })}
            >
                <p className="text-xs font-bold text-ellipsis overflow-hidden">{ListTutorial?.tutorial_title}</p>
                <p className="sc1366:text-[11px]  sc1536:text-[11px] sc1920:text-[14px] text-slate-400  ">
                    Admin TUU - LMS
                </p>
            </div>
            {roles !== 'STUDENT' ? (
                <div
                    className={clsx('flex justify-center items-center', {
                        'col-span-1': !isList,
                        display_none: isList,
                    })}
                >
                    <input
                        type="checkbox"
                        onChange={deleteItems}
                        checked={itemDelete![0]?.id === value ? true : false}
                        name="user_item"
                        hidden
                        id={`userItem_${value}`}
                    />
                    <label htmlFor={`userItem_${value}`} className="checkbox-item">
                        <CheckOutlined />
                    </label>
                </div>
            ) : (
                ''
            )}
        </div>
    )
}

export default UserManualItem
