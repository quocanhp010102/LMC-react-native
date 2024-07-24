import { ReactNode, useState } from 'react'
import '../styles/Layout.css'
import ContentFooter from './Footer'
import Navbar from './Navbar'

type Props = { children: ReactNode }

const HomepageLayout = ({ children }: Props) => {
    return (
        <>
            <div className="flex flex-col">
                <div>
                    <Navbar />
                </div>
                <div>{children}</div>
                <div>
                    <ContentFooter />
                </div>
            </div>
        </>
    )
}
export default HomepageLayout
