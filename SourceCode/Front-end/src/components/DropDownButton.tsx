import { ArrowDown2 } from 'iconsax-react'
import { useEffect, useRef, useState } from 'react'

type Props = {
    menu: string
    submenu: string[]
    bgcolor: string
    arrowIcon: boolean
}

const DropDownButton = ({ menu, submenu, bgcolor, arrowIcon }: Props) => {
    const [isClicked, setIsClicked] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const isFocus = useRef<any>()
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isFocus.current && !isFocus.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isFocus])

    return (
        <>
            <div
                className="flex flex-col justify-center"
                style={{ background: `${bgcolor}` }}
                ref={isFocus}
                onClick={(e) => {
                    setIsClicked(!isClicked)
                    setIsOpen(!isOpen)
                }}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => {
                    if (!isClicked) {
                        setIsOpen(false)
                    }
                }}
            >
                <div className="relative">
                    <div className={`flex flex-row`}>
                        {menu}
                        {arrowIcon && (
                            <span className="py-2 pl-1">
                                <ArrowDown2 size="14" />
                            </span>
                        )}
                    </div>

                    {isOpen && (
                        <div className="z-50 absolute py-[10px] w-full">
                            {submenu.map((item) => (
                                <div
                                    className="py-2 rounded"
                                    style={{
                                        background: `${bgcolor}`,
                                        margin: '1px',
                                    }}
                                >
                                    <span className="flex justify-center">{item}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
export default DropDownButton
