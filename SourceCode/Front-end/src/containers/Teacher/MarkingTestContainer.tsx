import { useEffect, useState } from 'react'

const MarkingTestContainer = () => {
    const text = [
        {
            question:
                ' Câu 1: Dựa vào các kiến thức đã học, em hãy tóm tắt khái quát về lịch sử hình thành và phát triển của bộ môn Cờ Vua trên thế giới',
            page: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quam nisl, lobortis sit amet turpis id, dictum sodales arcu. Pellentesque sit amet libero nibh. Donec blandit fermentum dapibus. Cras in sagittis lectus. Nulla ac gravida augue. Mauris malesuada in magna sit amet mollis. Maecenas sed sagittis purus, a vestibulum magna. Duis a urna pharetra, feugiat dolor dictum, consectetur leo.

            Phasellus at mi ipsum. Duis justo quam, imperdiet at elit non, ullamcorper auctor est. Aliquam egestas luctus sapien, vel feugiat orci facilisis eu. Suspendisse potenti. Suspendisse tellus purus, porttitor ut hendrerit eu, rhoncus eu arcu. Etiam dictum commodo dui, at dapibus turpis convallis sit amet. Vivamus vitae dapibus est. Morbi tempor, velit et dapibus dictum, nunc est posuere massa, in mattis leo ex id augue. Donec urna arcu, auctor at mauris vel, feugiat faucibus nisl.`,
        },
        {
            question:
                ' Câu 2: Trên thế giới có rất nhiều trận đấu Cờ Vua đã đi vào hàng ngũ lịch sử. Em hãy kể ra 01 trận đấu khiến em tâm đắc nhất, và bài học cũng như những giá trị mà trận đấu đó đã mang lại cho cá nhân em.',
            page: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quam nisl, lobortis sit amet turpis id, dictum sodales arcu. Pellentesque sit amet libero nibh. Donec blandit fermentum dapibus. Cras in sagittis lectus. Nulla ac gravida augue. Mauris malesuada in magna sit amet mollis. Maecenas sed sagittis purus, a vestibulum magna. Duis a urna pharetra, feugiat dolor dictum, consectetur leo.

            Duis suscipit cursus dui, vitae cursus est facilisis quis. Aenean sollicitudin pellentesque tristique. Ut gravida volutpat velit, sit amet pulvinar nunc vulputate non. Integer ante eros, auctor at facilisis sit amet, posuere vitae magna.
            
            Proin ut vestibulum purus. Vestibulum quis iaculis risus, nec dignissim massa. Nulla ut elementum libero. Vestibulum metus leo, fringilla sed libero quis, facilisis pellentesque tortor. Integer suscipit leo vitae velit pulvinar, at rutrum orci suscipit. Donec ante risus, condimentum non tempus ac, consequat vitae dui. Morbi nec magna nec lectus auctor hendrerit. Suspendisse eu arcu ipsum. Curabitur tellus arcu, molestie congue porttitor ut, venenatis et justo.
            
            In sollicitudin leo arcu, ut consequat risus condimentum ac. Integer dictum sollicitudin dui. Sed facilisis molestie augue et ullamcorper. Fusce eu dapibus nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tristique rhoncus sem, ac vestibulum leo luctus nec. Vivamus egestas ut leo vel faucibus. Pellentesque non leo a ex tempor vulputate nec id odio. Curabitur non consequat felis.`,
        },
        {
            question:
                'Câu 3: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ipsum neque, fringilla ut suscipit eu, bibendum id augue. Mauris sit amet felis bibendum, lobortis felis vel, fringilla purus. In sit amet lobortis sem, dapibus iaculis nibh. Mauris nec augue sapien. Etiam varius consequat erat sed sagittis.',
            page: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quam nisl, lobortis sit amet turpis id, dictum sodales arcu. Pellentesque sit amet libero nibh. Donec blandit fermentum dapibus. Cras in sagittis lectus. Nulla ac gravida augue. Mauris malesuada in magna sit amet mollis. Maecenas sed sagittis purus, a vestibulum magna. Duis a urna pharetra, feugiat dolor dictum, consectetur leo.

            Duis suscipit cursus dui, vitae cursus est facilisis quis. Aenean sollicitudin pellentesque tristique. Ut gravida volutpat velit, sit amet pulvinar nunc vulputate non. Integer ante eros, auctor at facilisis sit amet, posuere vitae magna.
            
            Proin ut vestibulum purus. Vestibulum quis iaculis risus, nec dignissim massa. Nulla ut elementum libero. Vestibulum metus leo, fringilla sed libero quis, facilisis pellentesque tortor. Integer suscipit leo vitae velit pulvinar, at rutrum orci suscipit. Donec ante risus, condimentum non tempus ac, consequat vitae dui. Morbi nec magna nec lectus auctor hendrerit. Suspendisse eu arcu ipsum. Curabitur tellus arcu, molestie congue porttitor ut, venenatis et justo.
            
            In sollicitudin leo arcu, ut consequat risus condimentum ac. Integer dictum sollicitudin dui. Sed facilisis molestie augue et ullamcorper. Fusce eu dapibus nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tristique rhoncus sem, ac vestibulum leo luctus nec. Vivamus egestas ut leo vel faucibus. Pellentesque non leo a ex tempor vulputate nec id odio. Curabitur non consequat felis.`,
        },
    ]
    const [show, setShow] = useState<boolean>(true)
    const showClass = 'w-2.5 inline-block cursor-pointer ml-2'
    const list = [1, 2, 3, 4, 5, 6, 7, 8]

    // ẩn hiện danh sách học sinh
    const showlist = () => {
        setShow(!show)
    }

    // xem bài đã nộp
    const handleViewExam = () => {
     
    }
    // hiển thị bài thi cần chấm
    const render = () => {
        return list.map((li) => {
            return (
                <div className="flex mb-7 items-center" key={li}>
                    <img src="/img/persion1.png" alt="ảnh người" />
                    <p className="text-lg ml-5 font-medium text-[#636363]">Trần văn A</p>
                </div>
            )
        })
    }
    return (
        <div className="w-full flex">
            <div className="w-9/12 px-8 pt-10 pb-12">
                <div className=" w-full border border-solid border-[#D4D4D4] rounded-[10px] p-5 text-left mb-5">
                    <h5 className="text-[40px] text-primary_blue font-bold mb-8"> HỌC VIÊN: LÊ HỒNG LỰC</h5>
                    <p className="text-lg text-[#636363]">Lớp: @H65231</p>
                </div>

                <div className="w-full px-5 py-11 border border-solid border-[#D4D4D4] rounded-[10px] mb-5">
                    <p className="text-4xl text-primary_blue font-medium">TỰ LUẬN: LỊCH SỬ PHÁT TRIỂN CỦA BỘ MÔN CỜ VUA</p>
                </div>

                <div className="w-full border border-solid border-[#D4D4D4] rounded-[10px] py-8 px-6 mb-6">
                    {text.map((content, index) => {
                        return (
                            <div className="mb-14" key={index}>
                                <p className="font-bold text-2xl text-left mb-8">{content.question}</p>
                                <div className="w-full border border-solid border-[#D4D4D4] rounded-[10px] py-7 px-6 text-2xl">
                                    <p className="text-left">{content.page}</p>
                                </div>
                            </div>
                        )
                    })}
                    <div className="w-full border border-solid border-[#D4D4D4] rounded-[10px] py-7 px-6 mb-5">
                        <p className="text-4xl mb-6 text-primary_blue font-medium">BÀI THI ĐÃ NỘP</p>
                        <div className="border-collapse border rounded-[10px] border-solid border-[#6363631a]">
                            <table className="manager_table w-full text-center">
                                <thead>
                                    <tr className="uppercase text-lg font-bold py-12">
                                        <td>STT</td>
                                        <td>LỚP</td>
                                        <td>TÊN SINH VIÊN</td>
                                        <td>KHÓA HỌC</td>
                                        <td>NGÀY NỘP BÀI</td>
                                        <td>XEM BÀI THI</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-lg">
                                        <td>1</td>
                                        <td>@H65231</td>
                                        <td>Lê Hồng Lực</td>
                                        <td>GDCD cuối khóa - Khóa 60 - Khối 2</td>
                                        <td>16/03/2022</td>
                                        <td>
                                            <button onClick={() => handleViewExam()} className="underline">
                                                xem
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="w-full border border-solid border-[#D4D4D4] rounded-[10px] py-7 px-6">
                        <p className="text-4xl mb-6 text-primary_blue font-medium">NHẬN XÉT CỦA GIÁO VIÊN</p>

                        <textarea
                            rows={10}
                            className="w-full mb-11 border border-solid border-[#D4D4D4] rounded-[10px] focus-visible:outline-blue-500"
                        ></textarea>
                        <div>
                            <p className="text-4xl text-[#636363] text-right mb-10">
                                TỔNG ĐIỂM CHẤM:
                                <span className="ml-6 text-red-600 font-bold">80</span>/
                                <span className="not-italic text-3xl">100</span>
                            </p>
                        </div>

                        <div className="text-right text-lg ">
                            <button className="border border-solid border-[#D4D4D4] rounded-[10px] px-4 py-2 bg-gray-200">
                                Hủy
                            </button>

                            <button className="border border-solid border-[#D4D4D4] rounded-[10px] px-4 py-2 ml-6 bg-[#636363] text-white">
                                Hoàn thành
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-[24.9%] pl-12 pt-16 border-l border-solid border-[#D4D4D4]">
                <div className="flex mb-12">
                    <img src="/img/thanhviens.png" alt="ảnh thành viên nhóm" className="w-12" />
                    <p className="ml-2 text-2xl font-medium">Thành viên khóa học: 30</p>
                </div>

                <div className="mb-7">
                    <p className="text-lg mb-3.5 font-medium text-[#636363]">Giảng viên</p>
                    <div className="flex mb-7 items-center ">
                        <img src="/img/persion1.png" alt="ảnh người" />
                        <p className="text-lg ml-5 font-medium text-[#636363]">Trần văn A</p>
                    </div>
                </div>

                <div className="mb-7">
                    <p className="text-lg mb-3.5 font-medium text-[#636363]">
                        Học sinh
                        <span className={!show ? showClass + '  rotate-180 ' : showClass} onClick={() => showlist()}>
                            <img src="/img/arowdown.png" alt="aa" />
                        </span>
                    </p>
                    {show && render()}
                </div>
            </div>
        </div>
    )
}

export default MarkingTestContainer

function getNews() {
    throw new Error('Function not implemented.')
}
