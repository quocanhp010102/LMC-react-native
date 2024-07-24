import React from 'react'
import UserService from '../services/UserService'
type Props = {
    isLoggedIn: () => boolean
    handleLogin: () => void
}

function BannerHome() {
    const { isLoggedIn, doLogin, doLogout } = UserService
    const handleLogin = () => {
        if (!isLoggedIn()) {
            doLogin()
        } else {
            doLogout()
        }
    }

    return (
        <div className="home-banner bgImgage-Gradient">
            <img
                className="w-full object-cover sc1920:h-[678px] sc1536:h-[543px] sc1336:h-[483px]"
                alt=""
                src="/img/thumbnailvtuu.png"
            />

            <div className="home-banner-sub z-[99]  sc1920:bottom-[70px] sc1536:bottom-[46px] sc1366:bottom-[38px]">
                <h1 className="home-banner-title text-white sc1920:mb-9 sc1536:mb-5 sc1366:mb-5 sc1920:text-[48px] sc1536:text-[40px] sc1366:text-[40px] ">
                    CHÀO MỪNG BẠN ĐẾN TUU - LMS
                </h1>
                <p className="home-banner-subtitle sc1920:text-lg sc1536:text-base sc1366:text-base text-white  sc1920:mb-14 sc1536:mb-9 sc1366:mb-9">
                    Hệ thống quản lý nội dung học tập trực tuyến Trường đại học Công Đoàn
                </p>

                <div className="home-banner-group">
                    <button
                        className="btn bg-blue_bg text-base text-white border-0 sc1920:w-[200px] sc1536:w-[166.67px] sc1366:w-[166.67px] sc1920:h-[60px] sc1536:h-[50px] sc1366:h-[50px]"
                        onClick={handleLogin}
                    >
                        {isLoggedIn() ? 'Đăng xuất' : 'Đăng nhập'}
                    </button>
                    {/* <button className="btn bg-light_blue text-base mx-3 text-white">Tìm hiểu thêm khoá học</button> */}
                </div>
            </div>
        </div>
    )
}

export default BannerHome
