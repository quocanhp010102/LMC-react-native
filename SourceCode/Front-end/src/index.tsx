import React from 'react'
import ReactDOM from 'react-dom'
// import './styles/index.css'
import App from './App'
import './locales/i18n'
import reportWebVitals from './reportWebVitals'
import SideBarRightContextProvider from './hooks/useSideBarRight'
import UserService from '../src/services/UserService'
import HttpService from './services/HttpService'
import  {QueryClient, QueryClientProvider} from "react-query"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 60 * 1000
        }
    }
})

const onAuthenticatedCallback = () =>
    ReactDOM.render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </React.StrictMode>,
        document.getElementById('root'),
    )

UserService.initKeycloak(onAuthenticatedCallback)


HttpService.configure()
reportWebVitals()
