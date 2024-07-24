import { useState, useEffect, useRef } from 'react'

function useClickOutItem(intialState: boolean) {
    const [isShow, setShow] = useState(intialState)
    const ref = useRef<any>(null)

    const handleShowItem = (e: any) => {
        if (ref.current && !ref.current.contains(e.target)) setShow(false)
    }

    useEffect(() => {
        document.addEventListener('click', handleShowItem, true)

        return () => {
            document.removeEventListener('click', handleShowItem, true)
        }
    }, [ref])

    return { isShow, setShow, ref }
}

export default useClickOutItem
