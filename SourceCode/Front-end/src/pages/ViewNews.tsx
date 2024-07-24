import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fomatDate } from '../containers/fomartDate'
import { NewsService } from '../services/NewsService'
import { NewsResponse } from '../types'
import UserService from './../services/UserService'

function ViewNews() {
    const [news, setNews] = useState<NewsResponse | null>(null)

    const param = useParams()
    const getNewsById = async (id: number) => {
        const result = await NewsService.getNewsById(id)
        if (result) {
            setNews(result)
            if (UserService.isLoggedIn()) {
                const data = await NewsService.postNewToHistory({
                    method: 'GET',
                    name: result.news_title,
                    news: {
                        id: result.id,
                    },
                })
            }
        }
    }
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
        })
        const idNews = parseInt(param.id)
        getNewsById(idNews)
    }, [param.id])


    return (
        <div className="w-[69%] m-auto min-h-screen py-14">
            {news === null ? (
                <div>không thể hiển thị thông tin</div>
            ) : (
                <>
                    <div className="home__body-item-line flex justify-center mt-3 h-[10px] text-left">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className="w-full">
                        <div className="mb-14">
                            <h3 className="font-bold text-4xl my-5 text-[#373737]">{news?.news_title}</h3>
                            <p className="text-base">
                                {news?.news_created_date !== null ? fomatDate(news.news_created_date, true) : ''}
                            </p>
                        </div>

                        <div>
                            <p className="mb-12 text-lg text-justify text-[#252525]">{news?.news_description}</p>
                            <img
                                className="w-full mb-6 min-h-[200px]"
                                src={news?.news_image !== null ? news?.news_image : '/img/imageNew.png'}
                                alt="ảnh"
                            />
                            <p className="text-center">Ảnh minh họa</p>
                        </div>
                        <div
                            className="py-24 text-justify"
                            dangerouslySetInnerHTML={{ __html: news?.news_content }}
                        ></div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ViewNews
