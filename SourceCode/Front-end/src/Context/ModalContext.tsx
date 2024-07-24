import { createContext, ReactNode, useState } from 'react'
import Modal from '../components/Modal'
type Props = {
    children: ReactNode
}
type _contextModal = {
    isShowModal: boolean
    showModal: (isCheck: boolean) => void
    setModal: (element: JSX.Element) => void
}

export const ContextModal = createContext<_contextModal>({
    isShowModal: false,
    showModal: (isCheck: boolean) => {},
    setModal: (element: JSX.Element) => {},
})

export default function ModalContext({ children }: Props) {
    const [isShowModal, setShowModal] = useState(false)
    const [NodeModal, setNodeModal] = useState<JSX.Element>(<></>)
    const showModal = (isCkeck: boolean) => {
        setShowModal(isCkeck)
    }

    const setModal = (element: JSX.Element) => {
        setNodeModal(element)
    }

    return (
        <ContextModal.Provider
            value={{
                isShowModal,
                showModal,
                setModal,
            }}
        >
            {children}
            <Modal>{NodeModal}</Modal>
        </ContextModal.Provider>
    )
}
