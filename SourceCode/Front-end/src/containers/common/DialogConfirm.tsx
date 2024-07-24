import React, { useContext } from 'react'
import { ContextModal } from './../../Context/ModalContext'
type Props = {
    onClick: () => void
    title: string
}
function DialogConfirm({ title, onClick }: Props) {
    const { showModal } = useContext(ContextModal)
    return (
        <div className="sc1366:h-[333.94px] sc1536:h-[333.94px] sc1920:h-[364px] flex flex-col p-7 sc1366:w-[622px] sc1536:w-[622px] sc1920:w-[678px] bg-white rounded-3xl">
            <span className="flex justify-end" onClick={() => showModal(false)}>
                <img src="\img\clear_24px.png" alt="" />
            </span>
            <div className="flex flex-1 flex-col text-center items-center justify-between">
                <span>
                    <img src="\img\icon_delete.png" alt="" />
                </span>
                {/* Bạn có chắc chắn muốn xóa ghi chú này không ? */}
                <h1 className="text-[#000] text-[26px] font-bold ">{title}</h1>

                <p className="text-xl">
                    Đây là hành động vĩnh viễn, bạn sẽ không thể hủy bỏ hoặc lấy lại dữ liệu một khi đã bị xóa
                </p>
                <div className="flex justify-end text-2xl">
                    <button
                        className="w-[120px] h-[50px] rounded-[10px] mr-[13px] hover:shadow-md"
                        onClick={() => showModal(false)}
                    >
                        Hủy
                    </button>
                    <button
                        className="w-[120px] h-[50px] rounded-[10px] flex justify-center items-center  bg-primary font-bold text-white hover:shadow-md"
                        onClick={onClick}
                    >
                        Xoá
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DialogConfirm
