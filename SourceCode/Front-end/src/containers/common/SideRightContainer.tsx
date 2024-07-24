import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { useContext } from 'react'
import { ContextLayout } from '../../layout/Layout'
import { __Date } from '../../types'

type props = {}

function SideRightContainer({}: props) {
    const { ChildrenSideRight } = useContext(ContextLayout)

    return (
        <div className="w-full sticky h-full top-0 right-0 bottom-0  px-6 lg:h-auto ">
            <div className="flex mt-2">
                {/* <span  className={clsx('text-3xl', {'text-[#000] cursor-pointer': (Stack.length != 0), 'text-[#ccc]':Stack.length === 0})}><ArrowLeftOutlined /></span>
        <span onClick={NextNodeChildren} className={clsx('ml-7 cursor-pointer text-3xl', {'text-[#000] cursor-pointer': (Queue.length != 0), 'text-[#ccc]':Queue.length === 0} )}><ArrowRightOutlined /></span> */}
            </div>
            <div className="">{ChildrenSideRight}</div>
        </div>
    )
}

export default SideRightContainer
