import React, { ReactNode, useContext, useEffect } from 'react'
import { ContextModal } from './../Context/ModalContext'
interface Props {
    children: JSX.Element
}

function Modal({ children }: Props) {
    const { isShowModal, showModal } = useContext(ContextModal)

    useEffect(() => {
        if (isShowModal) {
            document.body.classList.add('fix_layout')
        } else {
            document.body.classList.remove('fix_layout')
        }
    }, [isShowModal])

    return (
        <>
            {isShowModal ? (
                <div className="fixed inset-0 z-[100]">
                    <div className="modal" onClick={() => showModal(false)}></div>
                    <div className="absolute z-[100] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        {children}
                    </div>
                </div>
            ) : (
                ''
            )}
        </>
    )
}

export default Modal
