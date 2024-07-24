import { ReactNode } from 'react'
import Navbar from './Navbar'
import SidebarTeacher from './SidebarTeacher'
import ContentFooter from './Footer'
import Sidebar from './Sidebar'

type Props = { children: ReactNode }

const QuizTestLayout = ({ children }: Props) => {
    return (
        <>
            <div>
                <Navbar />
            </div>
            <div className="body flex flex-row">
                <div className="side-bar border-r-2 border-solid border-slate-300">
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
export default QuizTestLayout
