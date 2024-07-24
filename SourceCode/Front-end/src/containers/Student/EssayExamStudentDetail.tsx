import { LECTURER, __Date } from '../../types'
import Paging from '../../components/Paging'
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ExamService } from '../../services/ExamService'
import { Exam } from '../../types/Exam'
import { fomatDate } from '../fomartDate'
import clsx from 'clsx'
import { ContextLayout } from '../../layout/Layout'
import { DContextProfile } from '../../Context/MyselfContext'
import UserService from '../../services/UserService'

type props = {}

function EssayExamStudentDetail({}: props) {
    const [currenPage, setCurrentPage] = useState<any | null>(1)
    const [exam, setExam] = useState<Exam>()
    const [listExamsHistory, setListExamHistory] = useState<any[]>([])

    const params = useParams()
    const navigate = useNavigate()
    const [isDoExam, setIsDoExam] = useState<boolean>(true)
    const [isCloseTime, setIsCloseTime] = useState<boolean>(false)
    const { User } = useContext(DContextProfile)

    const { AttachChidrenSideRight } = useContext(ContextLayout)

    useEffect(() => {
        AttachChidrenSideRight(null)
    }, [])

    useEffect(() => {
        if (params.id) {
            ;(async () => {
                const data = await ExamService.getExamByIdBeforePass(params.id)
                setExam(data)

                const isExam = new Date(data?.examOpenTime).getTime() <= new Date().getTime()
                setIsDoExam(isExam)

                const isClose = new Date().getTime() >= new Date(data?.examCloseTime).getTime()
                setIsCloseTime(isClose)
            })()
        }
    }, [params])

    useEffect(() => {
        ;(async () => {
            if (User) {
                const examsHistory = await ExamService.getExamsByCourse_Student(User?.id, params.idCourse)

                setListExamHistory(examsHistory.content)
            }
        })()
    }, [User])

    const goToExam = () => {
        if (isDoExam) {
            navigate(
                exam.typeOfExams?.id == 2
                    ? `/student-do-essay-exam/${params.id}`
                    : `/${params.idCourse}/quiz-test/${params.id}`,
            )
        }
    }


    const goBack = ()=> {
        navigate(-1);
    }

    return (
        <>
            <div className="flex m-6  items-center cursor-pointer" onClick={goBack}>
                <span>
                    <img src="\img\goback.png" />
                </span>
                <span className="ml-2 uppercase text-xl text-[#636363] font-bold">Quay lại</span>
            </div>
            <div className="flex-row flex grow">
                <div className="quiz flex-1 flex-col m-6 mt-0 pt-4">
                    <div className="border-solid border-2 border-gray-300 rounded-lg">
                        <h1 className="text-primary_blue text-4xl pt-8 font-medium rounded-lg p-8 border-gray-300">
                            {exam?.course?.courseName}
                        </h1>
                        <p className="px-8 text-gray-600 font-medium text-[14px] pb-6 ">
                            <Link to="/faculty" className='text-color63'>{UserService.hasRole([LECTURER]) ? "Trung tâm kiểm soát" : "Khóa học của tôi"}</Link>  / <Link to={`/faculty/courseView/${exam?.course?.id}`}  className='text-color63'>{exam?.course?.courseName}</Link> 
                        </p>
                    </div>
                    {exam?.id !== null ? (
                        <>
                            <div className="text-primary_blue text-4xl pt-8 font-medium rounded-lg border-solid border-2 p-8 py-12 mt-12 mb-4 border-gray-300 ">
                                {exam?.examName}
                            </div>
                            <div className="border-solid border-2 border-gray-300 rounded-lg bg-red-50">
                                <p className="text-2xl md:font-bold p-3 py-1 mb-2 ">Ghi chú</p>
                                <p className="p-3 py-1 mb-2">Thời gian mở thi: {fomatDate(exam?.examOpenTime)}</p>
                                <p className="p-3 py-1 mb-2">Thời gian kết thúc: {fomatDate(exam?.examCloseTime)}</p>
                                <p className="p-3 py-1 mb-2">Thời gian làm bài: {exam?.examLimittedWorkingTime} phút</p>
                            </div>
                        </>
                    ) : (
                        <p>Đã làm bài thi</p>
                    )}
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
                                        <td className="w-[300px]">Bài thi</td>
                                        <td>THỜI GIAN NỘP</td>
                                        <td>ĐIỂM SỐ</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listExamsHistory.length > 0 &&
                                        listExamsHistory.map((examHis, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td className="w-[200px]">{examHis?.examsName}</td>
                                                    <td>{fomatDate(examHis?.examsDateSubmit)}</td>
                                                    <td>
                                                        {examHis?.examsPoint
                                                            ? `${examHis?.examsPoint}/100`
                                                            : 'Chưa chấm'}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </table>

                            {/* {<Paging currenPage={currenPage} setCurrentPage={setCurrentPage} total={20} />} */}
                        </div>
                        {exam?.id !== null && (
                            <div className="grid place-items-center mt-3 mb-2">
                                {exam?.examStatus == 0 ? (
                                    !isCloseTime ? (
                                    <button
                                        onClick={goToExam}
                                        className={clsx(
                                            'border-solid border-2 border-gray-300 rounded-lg bg-light_blue text-white p-2',
                                            { 'opacity-75': !isDoExam },
                                        )}
                                    >
                                        Bắt đầu làm bài
                                    </button>

                                    ): (
                                        "Hết thời gian làm bài"

                                    )
                                ) : (
                                    'Bạn đã nộp bài'
                                )}                           
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default EssayExamStudentDetail
