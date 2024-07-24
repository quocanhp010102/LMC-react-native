import { useContext, useEffect, useRef, useState } from 'react'
import { ContextMessage } from '../../Context/ShowMessage'
import clsx from 'clsx'

type Props = {
    title?: string
    type: 'SUCCESS' | 'ERROR' | 'WARN'
    message: string
    index: number
}

export default function DialogActionSuccess({ title, type, message, index }: Props) {
    const [isShowMessage, showMessage] = useState<boolean>(true)
    const [runToLeft, setRun] = useState<number>(0)
    const ref = useRef<any>()
    const { removeDom } = useContext(ContextMessage)

    const actionConfirm = () => {
        showMessage(false)
        setRun(0)
        removeDom(index)
    }

    useEffect(() => {
        if (isShowMessage) {
            ref.current = setInterval(() => {
                setRun((runToLeft) => runToLeft + 1)
            }, 50)
        }

        return () => clearInterval(ref.current)
    }, [])

    useEffect(() => {
        if (runToLeft === 100) {
            actionConfirm()
        }
    }, [runToLeft])

    return (
        <div
            className={clsx(
                'w-[400px] relative z-50 flex mb-4 overflow-hidden border-[1px] px-4 border-solid border-[#ccc] bg-white h-[100px]  items-center',
                {
                    context_toIn: isShowMessage,
                    context_toOut: !isShowMessage,
                },
            )}
        >
            <span className="absolute top-4 right-4 w-[15px]" onClick={actionConfirm}>
                <img src="/img/clear_24px.png" alt="clear_message" />
            </span>
            <div>
                {type === 'SUCCESS' && (
                    <span className="">
                        <img className="w-[50px]" src="\img\popup_success.png" />
                    </span>
                )}
                {type === 'ERROR' && (
                    <span className="">
                        <img className="w-[50px]" src="\img\danger.png" />
                    </span>
                )}

                {type === 'WARN' && (
                    <span className="">
                        <img className="w-[50px]" src="\img\warning_popup.png" />
                    </span>
                )}
            </div>
            <div className="ml-7">
                <p
                    className={clsx('text-2xl font-bold', {
                        'text-[#00A717]': type === 'SUCCESS',
                        'text-[#FF4D48]': type === 'ERROR',
                        'text-[#FFBD44]': type === 'WARN',
                    })}
                >
                    {title}
                </p>
                <p className="text-[#333] text-left text-xl font-bold">{message}</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 ">
                <div
                    className={clsx('h-full', {
                        'bg-[#00A717]': type === 'SUCCESS',
                        'bg-[#FF4D48]': type === 'ERROR',
                        'bg-[#FFBD44]': type === 'WARN',
                    })}
                    style={{ width: `${runToLeft}%` }}
                ></div>
            </div>
        </div>
    )
}
