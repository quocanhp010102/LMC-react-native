import { createContext, ReactNode, useState } from 'react'
// import { Layout, Menu } from "antd";
import SidebarStudent from './SidebarStudent'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ContentFooter from './Footer'
import SideRightContainer from '../containers/common/SideRightContainer'

// const { SubMenu } = Menu;
// const { Header, Content, Sider } = Layout;
type Props = { children: ReactNode }

const StudentLayout = ({ children }: Props) => {
    return (
        <>
            <>
                <div>
                    <Navbar />
                </div>
                <div className="body flex flex-row">
                    <div className="w-auto">
                        <Sidebar>
                            <SidebarStudent />
                        </Sidebar>
                    </div>
                    <div className="flex-1">{children}</div>
                    <div>
                        <SideRightContainer />
                    </div>
                </div>
                <div>
                    <ContentFooter />
                </div>
            </>
        </>
    )
}
export default StudentLayout
