import './styles/App.css'
import { useTranslation } from 'react-i18next'
import AppRouter from './Router'
import { createContext, useState } from 'react'
import ModalContext from './Context/ModalContext'
import DateContextProvider from './Context/DateContext'
import { BrowserRouter } from 'react-router-dom'
import ShowMessage from './Context/ShowMessage'
import MyselfContext from './Context/MyselfContext'

export const SidebarContext = createContext<{
    collapsed: boolean
    toggleCollapsed: () => void
}>({
    collapsed: false,
    toggleCollapsed: () => null,
})

function App() {
    const { t, i18n } = useTranslation()
    const [collapsed, setCollapsed] = useState(true)
    const toggleCollapsed = () => {
        setCollapsed(!collapsed)
    }
    return (
        <>
            <BrowserRouter>
                <MyselfContext>
                    <DateContextProvider>
                        <ShowMessage>
                            <ModalContext>
                                <SidebarContext.Provider
                                    value={{
                                        collapsed,
                                        toggleCollapsed,
                                    }}
                                >
                                    <AppRouter />
                                </SidebarContext.Provider>
                            </ModalContext>
                        </ShowMessage>
                    </DateContextProvider>
                </MyselfContext>
            </BrowserRouter>
        </>
    )
}

export default App
