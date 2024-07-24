import clsx from 'clsx'
import { createContext, ReactNode, SetStateAction, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SideRightContainer from '../containers/common/SideRightContainer'
import ContentFooter from './Footer'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import CalendarContainer from '../containers/common/CalendarContainer'
import SidebarManager from './SidebarManager'
import SidebarStudent from './SidebarStudent'
import SidebarTeacher from './SidebarTeacher'
import UserService from '../services/UserService'
import { ADMIN, LECTURER, STUDENT } from '../types'
import UserInfo from '../components/UserInfo'

type _Layout = {
    ChildrenSideRight: ReactNode
    AttachChidrenSideRight: (Children: ReactNode) => void
    isShowProfile: boolean
    setShowProfile: (isShow: any) => void
}

export const ContextLayout = createContext<_Layout>({
    ChildrenSideRight: <></>,
    AttachChidrenSideRight: (Children: ReactNode) => {},
    isShowProfile: false,
    setShowProfile: (isShow) => {},
})

const Layout: React.FC = (props) => {
    let location = useLocation()

    const pathName = location.pathname
    const check = pathName.indexOf('/home')
    const search = pathName.indexOf('/search')

    const [isSlider, setSilder] = useState(true)
    const [ChildrenSideRight, setChildrenSideRight] = useState<ReactNode>(null)
    const [isShowProfile, setShowProfile] = useState<boolean>(false)

    const AttachChidrenSideRight = (Children: ReactNode) => {
        setChildrenSideRight(Children)
    }

    return (
        <>
            <ContextLayout.Provider
                value={{
                    ChildrenSideRight,
                    AttachChidrenSideRight,
                    isShowProfile,
                    setShowProfile,
                }}
            >
                <div className="w-full">
                    <div>
                        <Navbar />
                    </div>
                    <div className="flex relative">
                        {/* @ts-ignore */}
                        {location.pathname !== '/' && check < 0 && search < 0 && (
                            <div>
                                <Sidebar>
                                    {UserService.hasRole([LECTURER]) && <SidebarTeacher />}
                                    {UserService.hasRole([ADMIN]) && <SidebarManager />}
                                    {UserService.hasRole([STUDENT]) && <SidebarStudent />}
                                </Sidebar>
                            </div>
                        )}
                        <div className="flex-1">{props.children}</div>
                        {ChildrenSideRight && location.pathname !== '/' && check < 0 && (
                            <div className="sticky sc1920:w-[506px] sc1536:w-[440px] sc1366:w-[398px]  bg-[#FBFBFB] top-0 right-0 bottom-0 border-l-2 border-solid border-slate-300">
                                <div className="w-full">
                                    <SideRightContainer />
                                </div>
                            </div>
                        )}

                        {isShowProfile && (
                            <div className="absolute bg-[#FBFBFB] sc1920:w-[506px] sc1536:w-[440px] sc1366:w-[398px]  top-0 right-0 bottom-0 h-[700px] z-20 border-l-2 border-solid border-slate-300">
                                <div className="">
                                    <UserInfo />
                                </div>
                            </div>
                        )}
                    </div>
                    {search < 0 && <ContentFooter />}
                </div>
            </ContextLayout.Provider>
        </>
    )
}

export default Layout
