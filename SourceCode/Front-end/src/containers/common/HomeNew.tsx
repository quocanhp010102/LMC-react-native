import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NewsService } from '../../services/NewsService'
import { fomatDate } from '../fomartDate'

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
}[]

function HomeNew() {
    const [listNew, setListNew] = useState<stateNews>([])
    const [currenPage, setCurrentPage] = useState<any | null>(0)
    const [totalPage, setTotalPage] = useState<number | null>(1)
    const navigate = useNavigate()
    const getNew = async (page?: number, size?: number) => {
        const result = await NewsService.getNewsBySortDate(page, size)
        if (result) {
            const { totalPages, content, pageable, totalElements, size } = result
            setListNew([...listNew, ...content])
            setTotalPage(totalPages)
        }
    }
    const handleClickView = (id: number) => {
        navigate(`view/${id}`)
    }
    const handleSetCurrentPage = () => {
        setCurrentPage((prevState) => {
            if (prevState >= totalPage) {
                return prevState
            } else {
                return prevState + 1
            }
        })
    }
    useEffect(() => {
        if (!currenPage) {
            window.scrollTo({
                top: 0,
                left: 0,
            })
        }
        getNew(currenPage, 16)
    }, [currenPage])

    return (
        <>
            <div className="container-or m-auto w-full">
                <div className="home__body-item mt-20 sc1920:w-[68.90625%] sc1536:w-[73.958333%] sc1366:w-[73.2064422%] m-auto">
                    <h1 className="text-center text-3xl font-bold mt-[93px] text-[#373737]">
                        DANH SÁCH TIN TỨC TỔNG HỢP TUU - LMS
                    </h1>
                    <div className="home__body-item-line flex justify-center mt-3 m-auto">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    <div className="grid sx:grid-cols-1 sx:gap-y-10 md:grid-cols-2 my-[100px] gap-7">
                        {listNew.length > 0 &&
                            listNew.map((news, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="grid gap-3 grid-cols-4  grid-flow-row sc1920:h-[120px] sc1536:h-[123px] sc1366:h-[106px]"
                                    >
                                        <div className="flex rounded-[5px] sc1920:h-[120px] sc1536:h-[123px] sc1366:h-[106px] sm:col-span-1 justify-center items-center bg-slate-300 min-w-[162px] max-w-[162px]">
                                            <img
                                                className="w-full sc1920:h-[120px] sc1536:h-[123px] sc1366:h-[106px] object-cover rounded-[5px]"
                                                src={news.news_image ? news.news_image : 'imgplayorpause.png'}
                                            />
                                        </div>
                                        <div
                                            onClick={() => handleClickView(news.id)}
                                            className="col-span-3 rounded-md p-1 cursor-pointer flex flex-col justify-between sc1920:pl-[20px] sc1536:pl-[40px] sc1366:pl-[55px]"
                                        >
                                            <p className="sc1920:text-[22px] sc1536:h-[20px] sc1366:h-[16px] font-medium text-[#000000] mb-5">
                                                {news.news_title.length <= 80
                                                    ? news.news_title
                                                    : news.news_title.slice(0, 77) + '...'}
                                            </p>
                                            <p className="text-slate-400 sc1920:text-[16px] sc1536:h-[16px] sc1366:h-[14px]">
                                                {fomatDate(news.news_created_date)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>

                    {currenPage < totalPage - 1 && (
                        <div className="flex justify-center mt-14">
                            <button
                                onClick={handleSetCurrentPage}
                                className="btn-see_more rounded-md font-semibold bg-[#FCFCFC]"
                            >
                                <span className="mr-3 text-primary_blue">Xem thêm</span>
                                <img src="\img\icon-arrow-blue.png" alt="" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-20">
                    <div className="home__body-item-line flex justify-center mt-3 m-auto mb-7">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeNew
