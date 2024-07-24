import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Title from '../../components/Homecomponent/Title'
import { DepartmentService } from '../../services/DepartmentService'
import LineBreack from './LineBreack'
import BannerHome from '../../components/BannerHome'

type stateType = {
    courses: any[]
    department_name: string
    department_type: string
    department_image: string
    id: number
}[]
const ListTrainningContainer = () => {
    const [listData, setListData] = useState<stateType[] | []>([])
    const [listDataEng, setListDataEng] = useState<stateType[] | []>([])
    const [currentPageSimple, setCurrentPageSimple] = useState<number>(0)
    const [currentPageEng, setCurrentPageEng] = useState<number>(0)
    const [totalPageEng, setTotalPageEng] = useState<number>(0)
    const [totalpagesSimple, setTotalpagesSimple] = useState<number>(0)

    const getApiSetList = async (type?: number, page?: number, size?: number) => {
        const resultData = await DepartmentService.getDepartmentByType(type, page, size)
        if (resultData) {
            const { totalPages, content, pageable, totalElements, size } = resultData
            setListData([...listData, ...content])
            setTotalpagesSimple(totalPages)
        }
    }
    const getApiSetListEng = async (type?: number, pages?: number, size?: number) => {
        const resultData = await DepartmentService.getDepartmentByType(type, pages, size)
        if (resultData) {
            const { totalPages, content, pageable, totalElements, size } = resultData
            setListDataEng([...listDataEng, ...content])
            setTotalPageEng(totalPages)
        }
    }

    const handleSetCurrentPage = (currentpages: number, totalpage: number, setcurrtentpage) => {
        if (currentpages >= totalpage) {
            return
        } else {
            setcurrtentpage(currentpages + 1)
        }
    }
    useEffect(() => {
        if (currentPageSimple == 0) {
            window.scrollTo({
                top: 0,
                left: 0,
            })
        }
        getApiSetList(0, currentPageSimple, 8)
    }, [currentPageSimple])

    useEffect(() => {
        getApiSetListEng(1, currentPageEng, 4)
    }, [currentPageEng])

    return (
        <>
            <BannerHome />
            <div className="container-or md:px-0 m-auto sc1920:w-[69.2708333%] sc1366:w-[73.20644%] sc1536:w-[73.9583%]">
                <div className="home__body-item mt-20 w-[100%]">
                    <Title title=" DANH SÁCH CÁC CHUYÊN NGÀNH ĐÀO TẠO CƠ BẢN" />

                    {listData.length > 0 ? (
                        <div className="grid grid-cols-4 mt-12  gap-4 mb-20 w-[100%]">
                            {listData.map((data, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="rounded-md overflow-hidden border-[0.5px] border-solid border-light_blue sc1920:w-[300px] sc1920:h-[240px] sc1536:w-[263.53px] sc1536:h-[193.1px] sc1366:w-[242.21px] sc1366:h-[177.48px]"
                                    >
                                        <Link to={`/home-departments/${data.id}`} className="text-current h-52">
                                            <div className="row-span-2 overflow-hidden w-full sc1920:h-[148px] sc1536:h-[129.49px] sc1366:h-[119.02px]">
                                                <img
                                                    className=" w-full sc1920:h-[148px] sc1536:h-[129.49px] sc1366:h-[119.02px] object-cover"
                                                    src={data?.department_image}
                                                    alt={data?.department_name}
                                                />
                                            </div>
                                            <div className="row-span-1 flex flex-col  items-center">
                                                <p className="uppercase sc1920:text-[18px] sc1536:text-[16px] sc1366:text-[16px] text-center justify-center">
                                                    {data?.department_name.length >= 22
                                                        ? data?.department_name.slice(0, 18) + '...'
                                                        : data?.department_name}
                                                </p>
                                                <p className="text-slate-400 text-[12px]">
                                                    {data?.courses.length} khóa học
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="w-full flex justify-center items-center mt-20 rounded-md overflow-hidden border-[0.5px] border-solid border-light_blue h-[200px]">
                            <p className="text-center text-xl text-[black]"> Không có chuyên ngành nào!</p>
                        </div>
                    )}

                    {currentPageSimple < totalpagesSimple - 1 && (
                        <div className="flex justify-center my-14 ">
                            <button
                                onClick={() =>
                                    handleSetCurrentPage(currentPageSimple, totalpagesSimple, setCurrentPageSimple)
                                }
                                className="btn-see_more rounded-md font-semibold bg-[#FCFCFC]"
                            >
                                <span className="mr-3 text-primary_blue">Xem thêm</span>
                                <img src="\img\icon-arrow-blue.png" alt="" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="home__body-item mt-20 w-[100%]">
                    <Title title="DANH SÁCH CHƯƠNG TRÌNH TIÊN TIẾN" subtitleEng="(Đào tạo bằng tiếng Anh)" />
                    {listDataEng.length > 0 ? (
                        <div className="grid grid-cols-4  mt-12  gap-4 mb-20">
                            {listDataEng.map((data, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="rounded-md overflow-hidden border-[0.5px] border-solid border-light_blue sc1920:w-[300px] sc1920:h-[240px] sc1536:w-[263.53px] sc1536:h-[193.1px] sc1366:w-[242.21px] sc1366:h-[177.48px]"
                                    >
                                        <Link to={`/home-departments/${data.id}`} className="text-current h-52">
                                            <div className="row-span-2 overflow-hidden w-full sc1920:h-[148px] sc1536:h-[129.49px] sc1366:h-[119.02px]">
                                                <img
                                                    className=" w-full sc1920:h-[148px] sc1536:h-[129.49px] sc1366:h-[119.02px] object-cover"
                                                    src={data?.department_image}
                                                    alt={data?.department_name}
                                                />
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <p className="uppercase sc1920:text-[18px] sc1536:text-[16px] sc1366:text-[16px] text-center justify-center">
                                                    {data?.department_name.length >= 22
                                                        ? data?.department_name.slice(0, 18) + '...'
                                                        : data?.department_name}
                                                </p>
                                                <p className="text-slate-400 text-[12px]">
                                                    {data?.courses.length} khóa học
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="w-full flex justify-center items-center mt-20 rounded-md overflow-hidden border-[0.5px] border-solid border-light_blue h-[200px]">
                            <p className="text-center text-xl text-[black]"> Không có chuyên ngành nào!</p>
                        </div>
                    )}

                    {currentPageEng < totalPageEng - 1 && (
                        <div className="flex justify-center my-14 ">
                            <button
                                onClick={() => handleSetCurrentPage(currentPageEng, totalPageEng, setCurrentPageEng)}
                                className="btn-see_more rounded-md font-semibold bg-[#FCFCFC]"
                            >
                                <span className="mr-3 text-primary_blue">Xem thêm</span>
                                <img src="\img\icon-arrow-blue.png" alt="" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <LineBreack />
        </>
    )
}

export default ListTrainningContainer
