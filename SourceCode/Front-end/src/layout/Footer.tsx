import { Call, Location, Printer, Sms } from 'iconsax-react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ContextMessage } from '../Context/ShowMessage'
import UserService from '../services/UserService'

const ContentFooter: React.FC = (props) => {
    const { pushMessage } = useContext(ContextMessage)
    function handlePushMessage() {
        pushMessage({
            title: 'Cảnh báo',
            type: 'WARN',
            message: 'Vui lòng đăng nhập',
        })
    }
    return (
        <div id="footer">
            <div className="flex flex-col text-white w-full bg-blue_bg">
                <div className="flex justify-center sc1366:px-[121px] sc1536:px-[137px] sc1920:px-[301px] mb-[38px] mt-[60px]">
                    <div className="flex flex-wrap">
                        <div className="basis-full">
                            <div className="font-bold">
                                <Link
                                    to="/"
                                    className=" flex bg-[#F4F4F4] p-2 rounded-[0.7rem] sc1366:w-[180px]  sc1536:w-[200px]  sc1920:w-[200px]"
                                >
                                    {/* className=" flex bg-[#F4F4F4] sc1366:p-[6px] p-2 rounded-[0.7rem] sc1366:w-[181px] sc1366:h-[62px] sc1536:w-[203px] sc1536:h-[70px] sc1920:w-[203px] sc1920:h-[70px]" */}
                                    {/* <img src="/img/logo_saodo.png" alt="logo" />

                                    <div className="pl-4 py-1">
                                        <div className="pb-1 font-bold sc1366:text-[12px] text-sm text-blue_bg">
                                            ĐẠI HỌC SAO ĐỎ
                                        </div>
                                        <div className="w-full h-[1px] bg-[#B4B4B4]"></div>
                                        <div className="pt-1 sc1366:text-[10px] text-[12px] font-normal text-blue_bg">
                                            SAODO UNIVERSITY
                                        </div>
                                    </div> */}
                                    <img src="/img/logo.png" alt="logo" />
                                </Link>
                            </div>
                        </div>

                        <div className="basis-full lg:basis-[32%] sc1366:basis-[35%]">
                            <h5 className="mt-[22px] mb-[38px] uppercase font-bold text-base">
                                TRƯỜNG ĐẠI HỌC CÔNG ĐOÀN (ĐHCĐ)
                            </h5>
                            <p className="flex items-center my-5 text-xs">
                                <img src="/img/location_icon_footer1.png" alt="Location:" className="pr-3" />
                                169 P.Tây Sơn, Quang Trung, Đống Đa, Hà Nội
                            </p>
                            <p className="flex items-center my-5 text-xs">
                                <img src="/img/phone_icon_footerl.png" alt="Phone:" className="pr-2" />
                                (84-4) 3.857.3204
                            </p>
                            <p className="flex items-center my-5 text-xs">
                                <img src="/img/print_icon_footer1.png" alt="Print:" className="pr-2" />
                                (84-4) 3.857.3204
                            </p>
                            <a href="mailto:dhcongdoan@dhch.edu.vn" className="flex items-center my-5 text-xs text-white hover:text-borderColor">
                                <img src="/img/email_icon_footer.png" alt="Email:" className="pr-2" />
                                Email: dhcongdoan@dhch.edu.vn
                            </a>
                            <a className="flex items-center my-5 text-xs text-white hover:text-borderColor" href='http://www.dhch.edu.vn'>
                                <img src="/img/web_icon_footer.png" alt="Web:" className="pr-2" />
                                http://www.dhch.edu.vn
                            </a>
                        </div>
                        <div className="basis-full lg:basis-[20%] sc1366:pl-[60px] sc1536:pl-[71px] sc1920:pl-[90px]">
                            <h5 className="mt-5 mb-10 uppercase font-bold text-base">TRUY CẬP NHANH</h5>
                            <p className="my-5 hover:text-gray-400 text-xs">
                                <Link to="/" className="text-inherit">
                                    Trang chủ
                                </Link>
                            </p>
                            <p className="my-5 hover:text-gray-400 text-xs">
                                {UserService.hasRole(['ROLE_STUDENT']) ? (
                                    <Link to="/faculty" className="text-inherit">
                                        Danh sách khóa học
                                    </Link>
                                ) : UserService.hasRole(['ROLE_LECTURER']) ? (
                                    <Link to="/faculty" className="text-inherit">
                                        Danh sách khóa học
                                    </Link>
                                ) : UserService.hasRole(['ROLE_ADMIN']) ? (
                                    <Link to="/manager-department" className="text-inherit">
                                        Danh sách khóa học
                                    </Link>
                                ) : (
                                    <a onClick={() => handlePushMessage()} className="text-inherit cursor-pointer">
                                        Danh sách khóa học
                                    </a>
                                )}
                            </p>
                        </div>
                        <div className="basis-full lg:basis-[30%] sc1366:basis-[28%] sc1366:pl-[60px] sc1536:pl-[71px] sc1920:pl-[90px] text-justify">
                            <h5 className="mt-5 mb-10 font-bold text-base">ĐĂNG KÝ NHẬN THÔNG TIN</h5>
                            <p className="my-5 text-xs leading-snug">
                                Đăng ký ngay để nhận những khóa học phù hợp và cập nhật những thông tin mới nhất về các
                                hoạt động của ĐHCĐ bạn nhé!
                            </p>
                            <p className="my-5 text-xs">Địa chỉ email</p>
                            <hr className="w-60 border-gray-400" />
                            {/* <p className="my-5">
                                <Link
                                    className="inline-block border-solid border-2 rounded-md text-inherit border-slate-100 px-4 py-2 bg-zinc-500 className='text-inherit' hover:bg-zinc-600"
                                    to="#"
                                >
                                    Đăng ký
                                </Link>
                            </p> */}
                        </div>
                        <div className="basis-full lg:basis-[18%] sc1366:basis-[12%] sc1366:pl-[60px] sc1536:pl-[100px] sc1920:pl-[110px]">
                            <h5 className="mt-5 mb-10 font-bold text-base">Theo dõi ĐHCĐ</h5>
                            <div className="flex">
                                <Link
                                    className="w-8 aspect-square className='text-inherit' flex items-center justify-center border-solid border-slate-100 border rounded-md hover:bg-zinc-600 mr-2"
                                    to=""
                                >
                                    <img src="\img\facebook-icon.png" alt="" />
                                </Link>
                                <Link
                                    className="w-8 aspect-square flex className='text-inherit' items-center justify-center border-solid border-slate-100 border rounded-md p-1 mr-2 hover:bg-zinc-600"
                                    to=""
                                >
                                    <img src="\img\youtube-icon.png" alt="" />
                                </Link>
                                <Link
                                    className="w-8 aspect-square flex items-center className='text-inherit' justify-center border-solid border-slate-100 border rounded-md p-1 mr-2 hover:bg-zinc-600"
                                    to=""
                                >
                                    <img src="\img\mail_outline_24px.png" alt="" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="flex w-full justify-center items-center h-[50px] bg-primary_blue"
                >
                    <p className="text-center font-medium text-sm">
                        © Coppyright 2022 - Trường đại học Công Đoàn - Trade Union University
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ContentFooter
