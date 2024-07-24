import React from 'react'

function History() {
    return (
        <div className="relative m-7  overflow-hidden">
            <h1 className="text-primary_blue text-[28px] font-bold">LỊCH SỬ HOẠT ĐỘNG</h1>
            <div className="lg:w-[100%] rounded-lg">
                {/* <HeaderManager handleUpdate={handleUpdate} isShowWarning={true} isShowAction={isShowAction} handleAdd={handleModal} handleDelete={handleDelete} handleWarning={handleWarning} searchByKeyWord={searchByKeyWord} title={"Quản lý thông báo"} /> */}

                <div className="w-full rounded-t-lg border-[1px] border-solid border-[#D4D4D4]">
                    <div className="p-[25px] flex items-center border-b-[1px] border-solid border-[#D4D4D4]">
                        <span className="mr-5">
                            <img src="\img\history_active.png" alt="" />
                        </span>
                        <span className="text-2xl text-primary_blue">Hôm nay</span>
                    </div>

                    <table className="manager_table w-full text-center text-__text_primary">
                        <thead>
                            <tr className="uppercase text-lg font-bold py-12">
                                <td style={{ width: '70%' }}>Hoạt động</td>

                                <td>Thời gian</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Trắc nghiệm: Lịch sử hình thành cờ Vua - khóa cuối - Kì 2 - Khóa 60</td>
                                <td>45 phút trước</td>
                            </tr>

                            <tr>
                                <td>Trắc nghiệm: Lịch sử hình thành cờ Vua - khóa cuối - Kì 2 - Khóa 60</td>
                                <td>45 phút trước</td>
                            </tr>

                            <tr>
                                <td>Trắc nghiệm: Lịch sử hình thành cờ Vua - khóa cuối - Kì 2 - Khóa 60</td>
                                <td>45 phút trước</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="p-[25px] flex items-center justify-center">
                        <span className="text-lg p-1 cursor-pointer border-b-[1px] border-solid border-[#D4D4D4]">
                            Xem thêm
                        </span>
                    </div>
                </div>
                <div className="w-full rounded-b-lg border-[1px] border-solid border-[#D4D4D4]">
                    <div className="p-[25px] flex items-center border-b-[1px] border-solid border-[#D4D4D4]">
                        <span className="mr-5">
                            <img src="\img\history_active.png" alt="" />
                        </span>
                        <span className="text-2xl text-primary_blue">Tháng này</span>
                    </div>

                    <table className="manager_table w-full text-center text-__text_primary">
                        <thead>
                            <tr className="uppercase text-lg font-bold py-12">
                                <td style={{ width: '70%' }}>Hoạt động</td>

                                <td>Thời gian</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Trắc nghiệm: Lịch sử hình thành cờ Vua - khóa cuối - Kì 2 - Khóa 60</td>
                                <td>45 phút trước</td>
                            </tr>

                            <tr>
                                <td>Trắc nghiệm: Lịch sử hình thành cờ Vua - khóa cuối - Kì 2 - Khóa 60</td>
                                <td>45 phút trước</td>
                            </tr>

                            <tr>
                                <td>Trắc nghiệm: Lịch sử hình thành cờ Vua - khóa cuối - Kì 2 - Khóa 60</td>
                                <td>45 phút trước</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="p-[25px] flex items-center justify-center">
                        <span className="text-lg p-1 cursor-pointer border-b-[1px] border-solid border-[#D4D4D4]">
                            Xem thêm
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default History
