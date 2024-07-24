import { createContext, ReactNode, useState } from 'react'
import DialogActionSuccess from './../containers/common/DialogActionSuccess'
type Props = {
    children: ReactNode
}

type Content = {
    id?: number
    title: string
    message: string
    type: 'SUCCESS' | 'ERROR' | 'WARN'
}

type _contextMessage = {
    pushMessage: (content: Content) => void
    removeDom: (index: number) => void
}

export const ContextMessage = createContext<_contextMessage>({
    pushMessage: (content: Content) => {},
    removeDom: (index: number) => {},
})

export default function ShowMessage({ children }: Props) {
    const [contents, setContents] = useState<Content[]>([])

    const pushMessage = (content: Content) => {
        setContents([
            {
                ...content,
                id: contents.length + 1 + Date.now() + Math.random() * 100,
            },
            ...contents,
        ])
    }

    const removeDom = (index: number) => {
        const newContents = contents

        newContents.forEach((content, i) => {
            if (content.id === index) {
                newContents.splice(i, 1)
            }
        })

        setContents([...newContents])
    }

    const hideALL = () => {
        setContents([])
    }

    return (
        <ContextMessage.Provider
            value={{
                pushMessage,
                removeDom,
            }}
        >
            <div className="fixed bottom-3 flex z-20 justify-end flex-col-reverse right-3 w-auto h-auto">
                {contents.length > 1 && (
                    <div
                        className="w-[400px] h-[50px] text-[#333] font-semibold  mb-4 overflow-hidden border-[1px] px-4 border-solid border-[#ccc] bg-white flex items-center justify-center"
                        onClick={hideALL}
                    >
                        Ẩn tất cả
                    </div>
                )}
                {contents.length > 0 &&
                    contents.map((content, index) => {
                        return (
                            <DialogActionSuccess
                                key={content.id}
                                index={content.id}
                                type={content.type}
                                title={content.title}
                                message={content.message}
                            />
                        )
                    })}
            </div>
            {children}
        </ContextMessage.Provider>
    )
}
