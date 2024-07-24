import { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Quiz, { QuizType } from '../../components/Quiz'
import { ContextModal } from '../../Context/ModalContext'
import { ContextMessage } from '../../Context/ShowMessage'
import { CourseService } from '../../services/CourseService'
import { ExamService } from '../../services/ExamService'
import { __Date } from '../../types'
import DialogWarningConfirm from '../common/DialogWarningConfirm'

type Props = {}
export const DATA_LIMIT = 5

const QuizContainer = (props: Props) => {
    const { setModal, showModal } = useContext(ContextModal)
    const { pushMessage } = useContext(ContextMessage)

    const navigate = useNavigate()
    const params = useParams()
    const { courseId, quizId } = params

    const [courseData, setCourseData] = useState(null)
    const [examData, setExamData] = useState(null)
    const [time, setTime] = useState(null)

    const getCourseData = () => {
        CourseService.getCourseById(courseId)
            .then((data) => setCourseData(data))
            .catch((err) => {})
    }

    const getExamData = () => {
        ExamService.getExamById(quizId)
            .then((data) => {
                setExamData(data)
                setQuizes([...data.questions])

                setTime(
                    parseInt(data.examLimittedWorkingTime) * 60 -
                        Math.floor((Date.now() - new Date(data.examOpenTime).getTime()) / 1000),
                )
            })
            .catch((err) => {})
    }

    useEffect(() => {
        getCourseData()
        getExamData()
    }, [])

    const handleTimeout = () => {
        pushMessage({ type: 'WARN', title: 'Cảnh báo', message: 'Đẫ hết thời gian làm bài' })
        navigate(`/faculty/courseView/${courseId}`)
    }

    useEffect(() => {
        if (time > 0) {
            const countdown = setInterval(() => {
                setTime((time) => time - 1)
            }, 1000)
            return () => clearInterval(countdown)
        }
        if (time < 0) {
            handleTimeout()
        }
        if (time == 0) {
            handleSubmit()
        }
    }, [time])

    const [quizes, setQuizes] = useState<QuizType[]>([])
    const [pages, setPages] = useState(Math.ceil(quizes.length / DATA_LIMIT))
    const [currentPage, setCurrentPage] = useState(1)
    useEffect(() => {
        setPages(Math.ceil(quizes.length / DATA_LIMIT))
    }, [quizes.length])

    const handleChooseAnswer = (quizId: number, answerIdx: number) => {
        let tempArr = quizes
        const quizIdx = tempArr.findIndex((item) => item.id == quizId)

        for (let index in tempArr[quizIdx].answers) {
            tempArr[quizIdx].answers[index] = {
                ...tempArr[quizIdx].answers[index],
                answersStatus: index == answerIdx.toString() ? '1' : '0',
            }
        }
        setQuizes([...tempArr])
    }

    function goToPreviousPage() {
        if (currentPage > 1) {
            setCurrentPage((page) => page - 1)
        }
    }
    function goToNextPage() {
        if (currentPage < pages) {
            setCurrentPage((page) => page + 1)
        }
    }

    const hasChosenAnswer = (item: QuizType) => {
        let hasChosen = false
        for (let answer of item.answers) {
            if (answer.answersStatus == '1') {
                hasChosen = true
                break
            }
        }
        return hasChosen
    }

    function changePage(id: number, questionIndex: number) {
        const pageNumber = Math.ceil(questionIndex / DATA_LIMIT)
        setCurrentPage(pageNumber)
        document.getElementById(`${id}`).scrollIntoView({ behavior: 'smooth' })
    }
    const getPaginatedData = () => {
        const startIndex = currentPage * DATA_LIMIT - DATA_LIMIT
        const endIndex = startIndex + DATA_LIMIT
        return [...quizes.slice(startIndex, endIndex)]
    }

    const handleSubmitModal = () => {
        showModal(true)
        setModal(<DialogWarningConfirm title="Xác nhận nộp bài" onClick={handleSubmit} />)
    }

    const handleSubmit = () => {
        const data = {
            id: quizId,
            questions: quizes,
            typeOfExams: {
                id: 1,
            },
        }
        ExamService.postExamByStudent(data)
            .then(() => {
                pushMessage({ type: 'SUCCESS', title: 'Thành công', message: 'Đã nộp bài thi' })
                showModal(false)
                navigate(`/faculty/courseView/${courseId}`)
            })
            .catch((err) => {})
    }

    return (
        <>
            <div className="flex-row flex grow">
                <div className="quiz flex-1 flex-col p-[23px]">
                    <div className="border-solid border border-borderColor rounded-[10px] p-[20px] mt-[23px]">
                        <h1 className="uppercase font-[700] text-[40px] text-blue_bg leading-[48px] will-change-contents">
                            {courseData?.courseName}
                        </h1>
                        <p className="text-color63 font-[500] text-[14px] leading-[17px] mt-[32px]">
                            <Link className="text-inherit hover:underline" to="/faculty">
                                Khóa học của tôi
                            </Link>{' '}
                            / 
                            <Link className="text-inherit hover:underline" to={`/faculty/courseView/${courseId}`}>
                                {courseData?.courseName}
                            </Link>
                        </p>
                    </div>
                    <div className="flex flex-row items-baseline rounded-[10px] border-solid border border-borderColor my-[23px] pt-[47px] pb-[43px] px-[22px]">
                        <div className="text-primary_blue text-[36px] font-[500] uppercase">{examData?.examName}</div>
                        <div className="ml-auto text-[22px]">{`${time < 0 ? '00:00' : Math.floor(time / 60)}:${(
                            '0' +
                            (time % 60)
                        ).slice(-2)}`}</div>
                    </div>
                    {/* quiz */}

                    <div className="rounded-[10px] border-solid border px-6 py-6 mb-[23px] border-borderColor text-lg text-color63 font-bold">
                        {/* quizes */}
                        <Quiz
                            quizes={getPaginatedData()}
                            changeAnswer={handleChooseAnswer}
                            isTimeOut={time <= 0}
                            currentPage={currentPage}
                        />

                        <div className="flex justify-end mt-10 mb-2">
                            <button
                                className={`rounded-lg border-solid border my-2 h-12 px-4 m-2 p-2 text-primary border-light_blue
                ${currentPage === 1 ? 'disabled cursor-not-allowed opacity-70' : ''}`}
                                onClick={goToPreviousPage}
                            >
                                Quay lại
                            </button>
                            <button
                                className={`rounded-lg border-solid border my-2 h-12 px-4 p-2 m-2 text-[#fff] bg-light_blue border-light_blue 
                ${currentPage === pages ? 'disabled cursor-not-allowed opacity-70' : ''}`}
                                onClick={goToNextPage}
                            >
                                Tiếp theo
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-row-reverse mb-[40px]">
                        <button
                            className={`rounded-[10px] h-[50px] text-[18px] border-solid border px-6 p-2 text-[#fff] bg-light_blue border-light_blue`}
                            onClick={() => handleSubmitModal()}
                        >
                            Nộp bài
                        </button>
                    </div>
                </div>

                <div className="lg:w-[444px] bg-[#FBFBFB] border-l p-6 border-solid border-borderColor">
                    <div className="sticky top-[23px] w-[400px] right-[21px] border border-solid border-borderColor  rounded-[10px]">
                        <div className="text-[24px] font-medium  bg-[#F2F2F2] p-2 rounded-t-[10px] text-primary_blue text-center">
                            Điều hướng câu hỏi
                        </div>
                        <div className="flex flex-row flex-wrap pl-6 pt-2 pb-12">
                            {quizes.map((item, index) => (
                                <button
                                    key={item.id}
                                    id={`${item.id}`}
                                    onClick={() => changePage(item.id, index + 1)}
                                    className={`${
                                        Math.ceil((index + 1) / DATA_LIMIT) == currentPage ? 'border-light_blue' : ''
                                    } ${hasChosenAnswer(item) ? 'border-b-light_blue border-b-[16px]' : ''}
                  w-[15%] pt-2 pb-8 mt-4 mr-4 rounded border-solid border-2 border-[#D4D4D4] hover:bg-[#f2f2f2] active:bg-[#F2F2F2]`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default QuizContainer
