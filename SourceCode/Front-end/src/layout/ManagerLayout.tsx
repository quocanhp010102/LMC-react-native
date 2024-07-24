import { ReactNode } from 'react'
// import { Layout, Menu } from "antd";

import SidebarManager from './SidebarManager'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ContentFooter from './Footer'
import SideRightContainer from '../containers/common/SideRightContainer'

// const { SubMenu } = Menu;
// const { Header, Content, Sider } = Layout;
type Props = {
    children: ReactNode
}

const ManagerLayout = ({ children }: Props) => {
    return (
        <>
            <div>
                <Navbar />
            </div>
            <div className="body flex flex-row">
                <div className="side-bar border-r-2 border-solid border-slate-300">
                    <Sidebar>
                        <SidebarManager />
                    </Sidebar>
                </div>
                <div className="flex-1 p-5">{children}</div>
                <div>
                    <SideRightContainer />
                </div>
            </div>
            <div>
                <ContentFooter />
            </div>
        </>
    )
}
export default ManagerLayout
