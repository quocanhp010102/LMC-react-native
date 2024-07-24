import { useEffect } from 'react';
import UserService from './../services/UserService';
export default function NotFound() {
    
    useEffect(()=> {
        if(!UserService.isLoggedIn()) {
            UserService.doLogin();
        }
    },[])

    return (
        <div className="w-full flex items-center justify-center h-[100vh]">
            <h1 className="text-[#f44336] font-bold text-6xl">404 NOT FOUND</h1>
        </div>
    )
}
