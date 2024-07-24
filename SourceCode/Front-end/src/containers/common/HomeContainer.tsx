import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserService from '../../services/UserService'
import BannerHome from '../../components/BannerHome'
import { DepartmentService } from '../../services/DepartmentService'
import { NewsService } from '../../services/NewsService'
import { UserManualService } from '../../services/UserManualService'
import { fomatDate } from '../fomartDate'
import { tutorialType } from '../TypeProps/TutorialProps'
import { ADMIN, STUDENT } from '../../types'
import ViewVideoComponent from '../../components/ViewVideoComponent'
import { ContextMessage } from './../../Context/ShowMessage'
import { useQuery } from 'react-query'
import { QueryType, QueryTypeNoPage } from '../../types/QueryType'

type stateType = {
    id: number
    department_image: string
    department_name: string
    department_type: string
    courses: []
}
type stateNews = {
    id: number
    news_isDisplay: string
    news_created_date: string
    news_title: string
    news_description: string
    news_content: string
    news_image: string | null
}

function HomeContainer() {
    const [departmentSimple, setDepartmentSimple] = useState<stateType[]>([])

    const [ListTutorials, setListTutorials] = useState<tutorialType[]>([])
    const [isShowVideo, setShowVideo] = useState<boolean>(false)
    const [urlVider, setUrlVideo] = useState<string | null>(null)
    const { pushMessage } = useContext(ContextMessage)
    const keyNews = `get-news-home`
    const keyTutorial = 'get-tutorial-home'
    const keyDepartment = 'get-department-home'

    const newsData: QueryTypeNoPage<stateNews> = useQuery({
        queryKey: keyNews,
        queryFn: () => NewsService.getFeaturedNews(),
        keepPreviousData: true,
        staleTime: 1 * 60 * 1000,
    })

    const tutorialsData: QueryTypeNoPage<tutorialType> = useQuery({
        queryKey: keyTutorial,
        queryFn: () => UserManualService.getTutorialisDisplay(),
        staleTime: 5 * 60 * 1000,
    })

    const departmentData: QueryType<stateType> = useQuery({
        queryKey: keyDepartment,

        queryFn: () => DepartmentService.getFeatureDepartments(),
        staleTime: 5 * 60 * 1000,
    })
    const Navigate = useNavigate()
    // xử lý login và logout

    const viewVideo = (videoUrl: string) => {
        if (videoUrl) {
            setUrlVideo(videoUrl)
        }
        setShowVideo(true)
    }

    const handleViewFeature = (id: number) => {
        Navigate(`home-new/view/${id}`)
    }
    const handleHefp = () => {
        const isadmin = UserService.hasRole([ADMIN])
        if (UserService.isLoggedIn()) {
            if (isadmin) {
                Navigate('user-manual')
            } else {
                Navigate('lms-help')
            }
        } else {
            pushMessage({
                title: 'Cảnh báo',
                type: 'WARN',
                message: 'Vui lòng đăng nhập',
            })
        }
    }
    // call api tutorials

    return (
        <>
            <div>
                <BannerHome />
            </div>
            {/* set h-screen lam container chi an height = 100vw */}
            <div className="container-or m-auto w-full ">
                <div className="home__body-item">
                    <h1 className="mt-32 text-center sc1920:text-[48px] sc1536:text-[40px] sc1366:text-[40px] font-semibold text-[#373737]">
                        TIN TỨC MỚI VỀ TUU
                    </h1>
                    <div className="sc1920:mb-[74px] sc1536:mb-[72px] home__body-item-line flex justify-center mt-[18px] m-auto">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    <div className="grid sc1366:grid-cols-3 sc1536:grid-cols-3 sc1920:grid-cols-3 grid-cols-1 mt-12 sc1366:gap-4 sc1536:gap-4 sc1920:gap-4 gap-y-2 sc1920:w-[69.2708333%] sc1366:w-[73.20644%] sc1536:w-[73.9583%] m-auto">
                        <div className="col-span-2 max-h-[750px] flex flex-col">
                            <div
                                onClick={
                                    newsData.data && newsData.data.length > 0
                                        ? () => handleViewFeature(newsData.data[0].id)
                                        : undefined
                                }
                                className="bgImgage-GradientHomePage hover:cursor-pointer relative home__list-news bg-slate-300 sc1366:h-[344.55px] sc1536:h-[392px]  sc1920:h-[455px] rounded-[10px]  "
                            >
                                {/* {listNew.length > 0 ? ( */}
                                <img
                                    className="border-[0.5px] border-solid border-light_blue w-full sc1366:h-[344.55px] sc1536:h-[392px]  sc1920:h-[455px] overflow-hidden object-cover rounded-[10px]"
                                    src={newsData.data && newsData.data[0]?.news_image}
                                    //     listNew === null
                                    //         ? ' https://baothainguyen.vn/UserFiles/image/img9319.jpg'
                                    //         : listNew[1]?.news_image
                                    // }
                                    alt={
                                        newsData.data && newsData.data[0]?.news_title ? newsData.data[0].news_title : ''
                                    }
                                />
                                {/* ) : (
                                     <div className="animate_pulse_custom shadow bg-slate-300 sc1366:h-[344.55px] sc1536:h-[392px]  sc1920:h-[455px] rounded-[10px] border-[0.5px] border-solid border-light_blue"></div>
                                )} */}
                                <div className="home__sub-news bottom-[20px] z-10">
                                    <p className="sc1920:text-2xl sc1366:text-xl sc1536:text-xl font-bold text-white">
                                        {newsData.data && newsData.data.length > 0 && newsData.data[0]?.news_title}
                                    </p>
                                    <p className="text-white  text-base mt-[18px]">
                                        {newsData.data &&
                                            newsData.data.length > 0 &&
                                            fomatDate(newsData.data[0]?.news_created_date)}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className=" relative hover:cursor-pointer rounded-[10px]  sc1920:h-[267.8px] sc1536:h-[230px] md:h-[202.73px] border-[0.5px] border-solid border-light_blue bg-slate-300">
                                    {newsData.data && newsData.data.length > 0 && (
                                        <div
                                            onClick={
                                                newsData.data.length > 0 &&
                                                (() => handleViewFeature(newsData.data[1].id))
                                            }
                                            className="bgImgage-GradientHomePage home__list-news h-full bgImgage-Gradient relative"
                                        >
                                            <img
                                                className="w-full overflow-hidden rounded-[10px] object-cover h-full border-solid border-light_blue"
                                                src={newsData.data[1]?.news_image ? newsData.data[1]?.news_image : ''}
                                                alt={newsData.data[1]?.news_title ? newsData.data[1].news_title : ''}
                                            />

                                            <div className="home__sub-news bottom-2 z-10">
                                                <p className="text-base font-bold text-white">
                                                    {newsData.data[1]?.news_title}
                                                </p>
                                                <p className="text-white text-base">
                                                    {fomatDate(newsData.data[1]?.news_created_date)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-[10px] sc1920:h-[267.8px] sc1536:h-[230px] md:h-[202.73px] border-[0.5px] border-solid border-light_blue bg-slate-300">
                                    {newsData.data && newsData.data.length > 0 && (
                                        <div
                                            onClick={
                                                newsData.data.length > 0
                                                    ? () => handleViewFeature(newsData.data[2].id)
                                                    : undefined
                                            }
                                            className="bgImgage-GradientHomePage relative hover:cursor-pointer home__list-news h-full"
                                        >
                                            <img
                                                className="w-full object-cover rounded-[10px] h-full"
                                                src={newsData.data[2]?.news_image ? newsData.data[2]?.news_image : ''}
                                                alt={newsData.data[2]?.news_title ? newsData.data[2].news_title : ''}
                                            />
                                            {/* <div className="absolute bottom-0 opacity-100 bg-gradient-to-t from-[#000000] to-white rounded-[10px] w-full h-full"></div> */}
                                            <div className="home__sub-news bottom-2 z-10">
                                                <p className="text-base font-bold text-white">
                                                    {newsData.data.length > 0 && newsData.data[2]?.news_title}
                                                </p>
                                                <p className="text-white text-base">
                                                    {newsData.data.length > 0 &&
                                                        fomatDate(newsData.data[2]?.news_created_date)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 sc1366:grid-cols-1 w-full">
                            <div className="hover:cursor-pointer relative min-h-[50px] row-span-2 sc1366:row-span-2 rounded-[10px] border-[0.5px] border-solid border-light_blue bg-slate-300 sc1920:h-[267.8px] sc1536:h-[230px] sc1366:h-[202.73px]">
                                {newsData.data && newsData.data.length > 0 && (
                                    <div
                                        onClick={
                                            newsData.data.length > 0
                                                ? () => handleViewFeature(newsData.data[3].id)
                                                : undefined
                                        }
                                        className="bgImgage-GradientHomePage relative h-full"
                                    >
                                        <img
                                            className="hover:cursor-pointer w-full overflow-hidden object-cover rounded-[10px] h-full"
                                            src={newsData.data[3]?.news_image ? newsData.data[3]?.news_image : ''}
                                            alt={newsData.data[3]?.news_title ? newsData.data[3].news_title : ''}
                                        />

                                        <div className="home__sub-news bottom-2 z-10">
                                            <p className="text-base font-bold text-white">
                                                {newsData.data[3]?.news_title}
                                            </p>
                                            <p className="text-white text-base">
                                                {fomatDate(newsData.data[3]?.news_created_date)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className=" relative hover:cursor-pointer row-span-2 sc1366:row-span-2 rounded-[10px] border-[0.5px] border-solid border-light_blue bg-slate-300 sc1920:h-[267.8px] sc1536:h-[230px] sc1366:h-[202.73px]">
                                {newsData.data && newsData.data.length > 0 && (
                                    <div
                                        onClick={
                                            newsData.data.length > 0 && (() => handleViewFeature(newsData.data[4].id))
                                        }
                                        className="bgImgage-GradientHomePage relative h-full "
                                    >
                                        <img
                                            className="w-full  overflow-hidden object-cover  rounded-[10px] h-full"
                                            src={newsData.data[4]?.news_image ? newsData.data[4]?.news_image : ''}
                                            alt={newsData.data[4]?.news_title ? newsData.data[4].news_title : ''}
                                        />

                                        <div className="home__sub-news bottom-2 z-10">
                                            <p className="text-base font-bold text-white">
                                                {newsData.data.length > 0 && newsData.data[4]?.news_title}
                                            </p>
                                            <p className="text-white text-base">
                                                {newsData.data.length > 0 &&
                                                    fomatDate(newsData.data[4]?.news_created_date)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="row-span-1  sc1920:h-[161.04px] sc1536:h-[138px] sc1366:h-[121.82px]  rounded-[10px]  border-[0.5px] border-solid border-light_blue bg-[#FCFCFC]">
                                <Link
                                    to="/home-new"
                                    className="text-current flex justify-center text-xl items-center h-full"
                                >
                                    <span className="mr-3 text-primary_blue">Xem thêm</span>
                                    <img src="\img\icon-arrow-blue.png" alt="" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="home__body-item ">
                    <h1 className="mt-[150px] text-center sc1920:text-[48px] sc1536:text-[40px] sc1366:text-[40px] font-semibold text-[#373737]">
                        CÁC KHOA ĐÀO TẠO NỔI BẬT
                    </h1>
                    <div className="sc1920:mb-[85px] sc1536:mb-[72px] sc1366:mb-[72px] home__body-item-line flex justify-center mt-[18px] m-auto">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    <div className="grid sc1366:grid-cols-4 sc1536:grid-cols-4 sc1920:grid-cols-4 mt-12 sc1920:w-[69.2708333%] sc1366:w-[73.20644%] sc1536:w-[73.9583%] m-auto mb-2 gap-4 ">
                        {departmentData.data &&
                            departmentData.data.content.map((department, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="rounded-[5px] overflow-hidden border-[0.5px] border-solid border-light_blue sc1920:h-[220px] sc1536:h-[193.1px] sc1366:h-[169.98px] "
                                    >
                                        <Link
                                            to={`home-departments/${department.id}`}
                                            className="relative h-52 text-current file_group"
                                        >
                                            <div className="sc1920:h-[148px] sc1536:h-[129.49px] sc1366:h-[113.99px]">
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src={
                                                        department.department_image
                                                            ? department.department_image
                                                            : 'https://img.lovepik.com/photo/40015/9423.jpg_wh860.jpg'
                                                    }
                                                    alt={department?.department_name}
                                                />
                                            </div>
                                            <div className="row-span-1 flex flex-col  items-center sc1920:mt-2 sc1536:mt-1 sc1366:mt-0">
                                                <p className="uppercase sc1920:text-[18px] sc1536:text-[16px] sc1366:text-[14px] text-center justify-center font-semibold">
                                                    {department.department_name.length >= 25
                                                        ? department.department_name.slice(0, 22) + '...'
                                                        : department.department_name}
                                                </p>
                                                <p className="text-slate-400 sc1920:text-[14px] sc1536:text-[12px] sc1366:text-[12px]">
                                                    {department.courses.length} khóa học
                                                </p>
                                            </div>
                                            {/* <p className="absolute bottom-[-20px] uppercase rounded-xl w-max file_item border-[1px] border-solid border- left-[50%] translate-x-[-50%]">
                                                {department.department_name}
                                            </p> */}
                                        </Link>
                                    </div>
                                )
                            })}
                        <div className="rounded-[5px] overflow-hidden border-[0.5px] border-solid border-light_blue sc1920:h-[220px] sc1536:h-[193.1px] sc1366:h-[169.98px]">
                            <Link
                                to="home-list-training"
                                className="text-current flex justify-center text-xl items-center sc1920:h-52 sc1536:h-52 sc1366:h-40"
                            >
                                <span className="mr-3 text-primary_blue">Xem thêm</span>
                                <img src="\img\icon-arrow-blue.png" alt="" />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="home__body-item mb-2">
                    <h1 className="mt-[150px] text-center sc1920:text-[48px] sc1536:text-[40px] sc1366:text-[40px] font-semibold text-[#373737]">
                        HƯỚNG DẪN SỬ DỤNG HỆ THỐNG LMS - TUU
                    </h1>
                    <div className="sc1920:mb-[74px] sc1536:mb-[72px] home__body-item-line flex justify-center mt-[18px] m-auto">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    <div className="grid grid-cols-4 mt-12 gap-7 sc1920:w-[69.2708333%] sc1366:w-[73.20644%] sc1536:w-[73.9583%] m-auto">
                        {tutorialsData.data &&
                            tutorialsData.data.map((tutorial, index) => {
                                return (
                                    <div
                                        onDoubleClick={(url) => viewVideo(tutorial.tutorial_video)}
                                        key={index}
                                        className="hover:cursor-pointer overflow-hidden rounded-t-[10px] sc1920:h-[241.84px] sc1536:h-[227px] sc1366:h-[199.8px] rounded-[10px] border-[0.5px] border-solid border-light_blue"
                                    >
                                        <div className="overflow-hidden object-cover   sc1920:h-[154.73px] sc1536:h-[136.72px] sc1366:h-[120.34px]">
                                            <img
                                                className="w-full overflow-hidden object-cover h-full"
                                                src={
                                                    tutorial?.tutorial_image
                                                        ? tutorial?.tutorial_image
                                                        : 'imgplayorpause.png'
                                                }
                                                alt={tutorial?.tutorial_title ? tutorial?.tutorial_title : 'ảnh'}
                                            />
                                        </div>
                                        <div className="col-span-3 rounded-[10px] pl-[10px] pr-[10px] pt-[3px] pb-[7px]">
                                            <p className="sc1920:text-[14px] sc1366:text-[13px] sc1536:text-[13px] font-bold ">
                                                {tutorial.tutorial_title}
                                            </p>
                                            <p className="sc1366:text-[11px]  sc1536:text-[11px] sc1920:text-[14px] text-slate-400  ">
                                                Admin TUU - LMS
                                            </p>
                                            <p className="sc1366:text-[9px]  sc1536:text-[9px] sc1920:text-[10px] text-slate-400  ">
                                                {fomatDate(tutorial.tutorial_createdDate)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>

                <div className="flex justify-center sc1920:mt-[85px] sc1536:mt-[72px] sc1366:mt-[72px] mb-36">
                    <button
                        onClick={handleHefp}
                        className="btn-see_more rounded-[10px] flex item-center font-semibold bg-[#FCFCFC] sc1920:w-[240px] sc1536:w-[240px] sc1366:w-[211.24px] sc1920:h-[70px] sc1536:h-[70px] sc1366:h-[61.61px]"
                    >
                        <span className="sc1920:ml-14 sc1536:ml-14 sc1366:ml-10 mr-2 text-primary_blue">Xem thêm</span>
                        <img src="\img\icon-arrow-blue.png" alt="" />
                    </button>
                </div>

                <div className="flex justify-center mb-4">
                    <div className="home__body-item-line flex justify-center mt-3 m-auto mb-7">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                {isShowVideo && (
                    <ViewVideoComponent
                        urlVider={urlVider ? urlVider : ''}
                        setShowVideo={(ishow) => setShowVideo(ishow)}
                    />
                )}
            </div>
        </>
    )
}

export default HomeContainer
