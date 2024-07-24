import { useContext, useEffect, useState } from 'react'
import { CheckOutlined } from '@ant-design/icons'
import Paging from '../../components/Paging'
import CreateFeedbackForm from './CreateFeedbackForm'
import { QuestionService } from '../../services/QuestionService'
import { Questions } from '../../types/Question'
import { useParams, useSearchParams } from 'react-router-dom'
import { ContextModal } from './../../Context/ModalContext'
import Loading from '../../components/Loading'
import { ContextLayout } from '../../layout/Layout'
import CalendarContainer from '../common/CalendarContainer'

function ManagerRequests() {
    const [QuestionList, setQuestionsList] = useState<Questions[]>([])
    const [isLoad, setIsLoad] = useState<boolean>(false)
    const [searchParams] = useSearchParams()
    const [currenPage, setCurrentPage] = useState<any>(searchParams.get('page') || 1)
    const [totalPages, setTotalPages] = useState<number | null>(null)

    const { setModal, showModal } = useContext(ContextModal)

    const { AttachChidrenSideRight } = useContext(ContextLayout)

    useEffect(() => {
        AttachChidrenSideRight(<CalendarContainer />)
        return () => {
            showModal(false)
        }
    }, [])

    const handleTr = (question: Questions) => {
        setModal(<CreateFeedbackForm question={question} setList={(data) => setList(data)} />)
        showModal(true)
    }
    const setList = (questionid: Questions) => {
        const index = QuestionList.findIndex((item, index) => {
            return item.id === questionid.id
        })
        if (index >= 0) {
            const newQuestion = QuestionList
            newQuestion[index] = questionid
            setQuestionsList(newQuestion)
        }
    }
    const getQuestion = async (page?: number, size?: number) => {
        setIsLoad(true)
        const result = await QuestionService.getQuestion(page, size)
        if (result) {
            const { totalPages, content, pageable, totalElements, size } = result

            setQuestionsList(content)
            setTotalPages(totalPages)
            setIsLoad(false)
        }
    }
    useEffect(() => {
        if (searchParams.get('page')) {
            const page = searchParams.get('page')
            const a = Number(page)
            setCurrentPage(a)
        }
    }, [searchParams])

    useEffect(() => {
        const callPage = searchParams.get('page') ? currenPage - 1 : 0
        getQuestion(callPage, 8)
    }, [currenPage])

    return (
        <div className="relative sc1920:m-5 lg:h-auto sc1920:rounded-lg flex sc1920:border-[1px] sc1920:border-solid border-[#D4D4D4] overflow-hidden">
            <div className="lg:w-[100%] rounded-lg">
                <div className="p-[23px] flex border-b-[1px] border-solid border-[#D4D4D4] justify-between items-center">
                    <h1 className="uppercase text-primary_blue font-bold text-xl">Quản lý phản hồi</h1>
                </div>

                <div className="w-full">
                    <table className="manager_table w-full text-center text-__text_primary">
                        <thead>
                            <tr className="uppercase text-lg font-bold py-12">
                                <td>STT</td>

                                <td>Người đặt câu hỏi</td>

                                <td>Phân quyền</td>

                                <td>Tiêu đề</td>

                                <td>Xong</td>
                            </tr>
                        </thead>
                        {isLoad ? (
                            <tbody>
                                <tr className="h-[200px]">
                                    <td colSpan={5}>
                                        <Loading />
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {QuestionList.length > 0 ? (
                                    QuestionList.map((question, index) => {
                                        return (
                                            <tr
                                                key={question.id}
                                                onClick={() => handleTr(question)}
                                                className="cursor-pointer"
                                            >
                                                <td>{index + 1}</td>

                                                <td>
                                                    {question.user.firstName
                                                        ? question.user.firstName + ' ' + question.user.lastName
                                                        : 'không có tên'}
                                                </td>

                                                <td>
                                                    {question.typeUser && question.typeUser === '1'
                                                        ? 'Giảng viên'
                                                        : 'Sinh viên'}
                                                </td>
                                                <td>{question.title}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        name="user_item"
                                                        onChange={() => showModal}
                                                        checked={question?.status == '1' ? true : false}
                                                        hidden
                                                        id={`userItem_${index}`}
                                                    />
                                                    <label htmlFor={`userItem_${index}`} className="checkbox-item">
                                                        <CheckOutlined />
                                                    </label>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5}>Chưa có thắc mắc nào</td>
                                    </tr>
                                )}
                            </tbody>
                        )}
                    </table>
                    {totalPages > 0 && (
                        <Paging currenPage={currenPage} setCurrentPage={setCurrentPage} total={totalPages} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManagerRequests
