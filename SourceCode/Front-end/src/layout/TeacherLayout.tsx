import { ReactNode } from 'react'
import Navbar from './Navbar'
import SidebarTeacher from './SidebarTeacher'
import ContentFooter from './Footer'
import Sidebar from './Sidebar'
import SideRightContainer from '../containers/common/SideRightContainer'

type Props = { children: ReactNode }

const TeacherLayout = ({ children }: Props) => {
    return (
        <>
            <div>
                <Navbar />
            </div>
            <div className="body flex flex-row">
                <div>
                    <Sidebar>
                        <SidebarTeacher />
                    </Sidebar>
                </div>
                <div className="flex-1">{children}</div>
                {/* <div>
          <SideRightContainer/>
        </div> */}
            </div>
            <div>
                <ContentFooter />
            </div>
        </>
    )
}
export default TeacherLayout
