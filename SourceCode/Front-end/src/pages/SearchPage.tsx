import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Paging from '../components/Paging'
import { ContextLayout } from '../layout/Layout'
import { SearchAllService } from '../services/SearchAllService'
import { NewsSearch } from '../types'

function SearchPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [query, setQuery] = useState<string | null>(null)
    const naviPath = useRef(null)
    const [currenPage, setCurrentPage] = useState<any>(1)
    const [totalPage, setTotalPages] = useState<number | null>(null)
    const [newsSearch, setNewsSearch] = useState<NewsSearch[]>([])
    const [totalElementSearch, setTotalElementSearch] = useState<number | null>(null)
    const { AttachChidrenSideRight } = useContext(ContextLayout)

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setQuery(value)
        setCurrentPage(1)
        if (value == '') {
            setNewsSearch([])
            setTotalPages(null)
            setTotalElementSearch(null)
            navigate(`?search=`)
        }
        value === '' ? searchParams.set('search', ' ') : searchParams.set('search', value)
    }
    const viewPageSearch = (event: React.MouseEvent<HTMLDivElement>, id: number) => {
        navigate(`/home-new/view/${id}`)
    }
    const getSeach = async (page?: number, size?: number) => {
        if (query && query != '') {
            const result = await SearchAllService.searchAll(query, page, 3)
            if (result) {
                const { totalPages, content, pageable, totalElements, size } = result
                setTotalElementSearch(totalElements)
                setNewsSearch(content)
                setTotalPages(totalPages)
            }
        }
    }

    useEffect(() => {
        const queryString = searchParams.get('search')
        if (queryString) {
            setQuery(queryString)
        }
        if (searchParams.get('page')) {
            const page = Number(searchParams.get('page'))
            setCurrentPage(page)
        }
    }, [searchParams])
    useEffect(() => {
        if (query && query != '') {
            getSeach(currenPage - 1)
        }
    }, [currenPage])
    useEffect(() => {
        AttachChidrenSideRight(null)
        if (query && query != '') {
            if (naviPath.current) {
                clearTimeout(naviPath.current)
            }
            naviPath.current = setTimeout(() => {
                navigate(`?search=${query}`)
                getSeach(0, 10)
            }, 500)
        } else {
            clearTimeout(naviPath.current)
        }
    }, [query])
    return (
        <div className="w-full min-h-screen pb-14 flex flex-col relative bg-[#f4f4f4]">
            <img className="w-full" src="/img/Group1132-search.png" />
            <div className="absolute w-[588px] top-[116px] left-[76px]">
                <h2 className="sc1920:w-[588px] sc1536:w-[580px] sc1366:w-[400px] sc1920:leading-[72px] sc1536:leading-[65px] sc1366:leading-[50px] sc1920:text-6xl sc1536:text-5xl sc1366:text-4xl text-left font-bold text-blue_bg ">
                    CÔNG CỤ TÌM KIẾM TUU-LMS
                </h2>
            </div>
            <div className="w-[70%] mr-[14%] h-auto bg-white sc1920:mt-[-415px] sc1536:mt-[-333px] sc1366:mt-[-300px] mx-auto mb-14 py-10 px-11 rounded-[10px] border-solid border border-[#005994]">
                <div className="flex items-center justify-between">
                    <div className="xl:w-4/5 sc1536:w-[79%] sc1366:w-[77%] w-[84%] relative">
                        <img
                            className="absolute left-4 top-[50%] -translate-y-[50%] w-6"
                            src="/img/searchIn.png"
                            alt="tìm kiếm"
                        />

                        {/* <div className="xl:w-4/5 w-full relative"> */}
                        <input
                            value={query ? query : ''}
                            onChange={(event) => handleSearch(event)}
                            className=" w-full text-lg h-full pr-20 pl-12 border border-solid rounded-[10px] py-4 focus:outline  focus:divide-solid outline-blue-500 focus:outline-1"
                            type="text"
                            placeholder="Nhập từ khóa tìm kiếm"
                        />
                        {/* <button
                            onClick={() => getSeach(currenPage - 1)}
                            className="w-auto absolute right-[1px] top-0 h-full px-5 flex justify-between items-center py-3 text-slate-50 bg-light_blue font-bold text-2xl border border-solid rounded-r-lg"
                        >
                            <img className="w-6" src="/img/searchButton.png" alt="button search" />
                        </button> */}
                    </div>
                    <button
                        onClick={() => getSeach(currenPage - 1)}
                        className="w-auto px-5 flex justify-between items-center py-3 text-slate-50 bg-[#005994] font-bold text-2xl border border-solid rounded-[10px]"
                    >
                        <img className="w-5 mr-3" src="/img/searchButton.png" alt="button search" />
                        Tìm kiếm
                    </button>
                </div>
                {newsSearch.length > 0 && query != '' && (
                    <div className="px-[6px]">
                        <p className="my-5 font-bold text-lg">
                            Kết quả tìm kiếm: <b className="text-[#242424]">{query}</b> ({totalElementSearch} kết quả)
                        </p>
                        <div>
                            {newsSearch.map((newItems, index) => {
                                return (
                                    <div
                                        key={index}
                                        onClick={(event) => viewPageSearch(event, newItems.id)}
                                        className="w-full overflow-hidden min-h-[130px] max-h-[150px] cursor-pointer grid grid-cols-5 rounded-[10px] border-solid border border-[#005994] mb-3 "
                                    >
                                        <div className="col-span-1 rounded-l-lg h-full">
                                            <img
                                                className="w-full h-full rounded-l-lg"
                                                src={newItems.news_image ? newItems.news_image : '/img/imageNew.png'}
                                                alt="ảnh"
                                            />
                                        </div>
                                        <div className="col-span-4 w-full">
                                            <div className="text-lg px-7">
                                                <p className="font-bold mb-3 text-[#242424]">
                                                    {' '}
                                                    {newItems.news_title.length > 60
                                                        ? newItems.news_title.slice(0, 60) + '...'
                                                        : newItems.news_title}
                                                </p>
                                                <p className="mb-3">Danh mục: News</p>
                                                <p className="mb-3">
                                                    Mô tả:{' '}
                                                    {newItems.news_description.length > 130
                                                        ? newItems.news_description.slice(0, 130) + '...'
                                                        : newItems.news_description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
                {totalPage > 0 && <Paging currenPage={currenPage} setCurrentPage={setCurrentPage} total={totalPage} />}
            </div>
        </div>
    )
}

export default SearchPage
