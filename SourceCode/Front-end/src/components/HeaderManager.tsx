import { AddCircle, Setting2 } from 'iconsax-react'
import React, { ChangeEvent, useContext } from 'react'
import DialogConfirm from '../containers/common/DialogConfirm'
import { ContextModal } from '../Context/ModalContext'

type Props = {
    title: string
    isShowAction?: boolean
    isShowWarning?: boolean
    handleAdd?: () => void
    handleDelete?: (event: React.MouseEvent<HTMLImageElement>) => void
    handleWarning?: () => void
    handleUpdate?: () => void
    searchKeyWord?: string
    searchByKeyWord?: (event: ChangeEvent<HTMLInputElement>) => void
    isShowAddAction?: boolean
}

function HeaderManager(props: Props) {
    const {
        isShowAction,
        handleUpdate,
        title,
        isShowWarning,
        handleAdd,
        handleDelete,
        searchKeyWord,
        searchByKeyWord,
        isShowAddAction,
    } = props
    return (
        <div className="p-4 flex border border-solid border-borderColor justify-between items-center">
            {!isShowAction ? (
                <h1 className="uppercase text-primary_blue font-bold text-2xl">{title}</h1>
            ) : (
                <div className="flex items-center text-xl">
                    {/* <div className="flex items-center mr-6 cursor-pointer" onClick={handleUpdate}>
                        <img src="\img\edit.png" className="mr-2" alt="" /> Sửa
                    </div> */}

                    <div
                        className="flex items-center mr-6 cursor-pointer text-primary text-[20px]"
                        onClick={handleDelete}
                    >
                        <img src="\img\red_delete_24px.png" className="mr-2" alt="" /> Xoá
                    </div>
                </div>
            )}

            {/* search */}
            <div className="flex items-center justify-between">
                <div className="relative flex grow items-center w-full lg:w-[377px] h-full group">
                    <svg
                        className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                    </svg>
                    <input
                        type="text"
                        value={searchKeyWord}
                        onChange={searchByKeyWord}
                        className="ml-auto grow w-full h-[40px] py-1.5 pl-10 pr-4 rounded focus:border-transparent focus:outline-none focus:ring-2 bg-[rgba(99,99,99,0.1)] ring-opacity-90 border-solid border-2"
                        // placeholder="Search"
                    />
                </div>

                {isShowAddAction && (
                    <div
                        className="flex items-center h-[40px] ml-3 p-2 rounded-md bg-btn_bg cursor-pointer bg-[rgba(99,99,99,0.1)]"
                        onClick={handleAdd}
                    >
                        <img src="/img/add_circle_outline_24px.png" />
                        <span className="text-[15px] font-bold text-primary_blue ml-2">Thêm</span>
                    </div>
                )}

                {/* <span className="ml-3 text-__text_primary">
                    <Setting2 size="28" />
                </span> */}
            </div>
        </div>
    )
}

export default HeaderManager
