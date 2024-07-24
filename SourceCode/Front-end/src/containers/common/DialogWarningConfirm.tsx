import { useContext } from 'react'
import { ContextModal } from './../../Context/ModalContext'
type Props = {
    onClick: () => void
    title: string
}
function DialogWarningConfirm({ title, onClick }: Props) {
    const { showModal } = useContext(ContextModal)
    return (
        <div className="h-[364px] flex flex-col p-7 w-[678px] justify-center bg-white rounded-3xl">
            <span className="flex justify-end" onClick={() => showModal(false)}>
                <img src="\img\clear_24px.png" alt="" />
            </span>
            <div className="flex flex-1 flex-col text-center items-center justify-around">
                <h1 className="text-[#000] text-[26px] font-bold ">{title}</h1>
                <div className="flex justify-end">
                    <button className="btn mr-[13px] bg-[#e4e4e4] hover:shadow-md" onClick={() => showModal(false)}>
                        Hủy
                    </button>
                    <button className="btn bg-blue_bg text-white hover:shadow-md" onClick={onClick}>
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DialogWarningConfirm
