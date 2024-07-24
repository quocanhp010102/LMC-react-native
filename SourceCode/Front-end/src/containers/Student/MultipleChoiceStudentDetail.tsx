import { __Date } from '../../types'
import Paging from '../../components/Paging'
import { useState } from 'react'

type props = {}

function MultipleChoiceStudentDetail({}: props) {
    const fakeArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const [currenPage, setCurrentPage] = useState<any | null>(1)
    return (
        <>
            <div className="flex-row flex grow">
                <div className="quiz flex-1 flex-col m-6 pt-4">
                    <div className="border-solid border-2 border-gray-300 rounded-lg">
                        <h1 className="text-primary_blue text-4xl pt-8 font-medium rounded-lg p-8 border-gray-300">
                            - KHÓA 60 - KHỐI 2
                        </h1>
                        <p className="px-8 text-gray-600 font-medium text-[14px] pb-6 ">
                            Menu / Khóa học của tôi / / Khóa 60 / Khối 2 / Bài 1
                        </p>
                    </div>
                    <div className="text-primary_blue text-4xl pt-8 font-medium rounded-lg border-solid border-2 p-8 py-12 mt-12 mb-4 border-gray-300 ">
                        TRẮC NGHIỆM: LỊCH SỬ PHÁT TRIỂN BỘ MÔN CỜ VUA
                    </div>
                    <div className="border-solid border-2 border-gray-300 rounded-lg bg-red-50">
                        <p className="text-2xl md:font-bold p-3 py-1 mb-2 ">Ghi chú</p>
                        <p className="p-3 py-1 mb-2">Thời gian mở thi: Thứ 2, 13/03/2022, 8:00AM</p>
                        <p className="p-3 py-1 mb-2">Thời gian kết thúc: Thứ 2, 13/03/2022, 10:00AM</p>
                        <p className="p-3 py-1 mb-2">Thời gian làm bài: 120 phút</p>
                        <p className="p-3 py-1 mb-2">Cách thức tính điểm: lấy điểm cao nhất</p>
                    </div>
                </div>
            </div>
            <div className="quiz flex-1 flex-col m-6">
                <div className="relative lg:h-auto rounded-lg flex border-[1px] border-solid border-[#D4D4D4] overflow-hidden">
                    <div className="lg:w-[100%] rounded-lg">
                        <div className="p-6 flex border-[1px] border-solid border-[#D4D4D4] justify-between items-center">
                            <h1 className="uppercase text-__text_primary font-bold text-xl">Lịch sử làm bài</h1>
                        </div>
                        <div className="w-full">
                            <table className="manager_table w-full text-center text-__text_primary">
                                <thead>
                                    <tr className="uppercase text-lg font-bold py-12">
                                        <td>STT</td>
                                        <td>MÔN HỌC</td>
                                        <td>TRẠNG THÁI</td>
                                        <td>THỜI GIAN NỘP</td>
                                        <td>ĐIỂM SỐ</td>
                                        <td>XEM LẠI</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fakeArr.map((value, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>60 - khối 2</td>
                                                <td>Hoàn thành</td>
                                                <td>Thứ 2, 13/03/2022</td>
                                                <td>90/100</td>
                                                <td>Xem</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            {<Paging currenPage={currenPage} setCurrentPage={setCurrentPage} total={20} />}
                        </div>
                        <div className="grid place-items-center mb-2">
                            <button className="border-solid border-2 border-gray-300 rounded-lg bg-gray-500 text-white p-2">
                                Bắt đầu làm bài
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MultipleChoiceStudentDetail
