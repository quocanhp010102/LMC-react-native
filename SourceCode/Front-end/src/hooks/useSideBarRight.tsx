import { createContext, ReactNode } from 'react'

type State = {
    sideBarRight: (element: any) => JSX.Element
}

const defaultState: State = {
    sideBarRight: () => <></>,
}
export const SideBarRightContext = createContext<State>(defaultState)

const SideBarRightContextProvider = ({ children }: any) => {
    const SidebarRight = (element: ReactNode): JSX.Element => {
        return <div className="sticky bg-slate-100">{element}</div>
    }

    const SideBarRightContextValue: State = {
        sideBarRight: SidebarRight,
    }

    return <SideBarRightContext.Provider value={SideBarRightContextValue}>{children}</SideBarRightContext.Provider>
}
export default SideBarRightContextProvider
