import React, { ChangeEvent, useContext, useState } from 'react'
import { ContextModal } from '../../Context/ModalContext'
import { ContextMessage } from '../../Context/ShowMessage'
import { QuestionService } from '../../services/QuestionService'
import UserService from '../../services/UserService'
import { ADMIN } from '../../types'
import { Questions } from '../../types/Question'
type props = {
    question?: Questions
    setList?: (data: Questions) => void
}
function CreateFeedbackForm({ question, setList }: props) {
    const [questionResponse, setQuestionResponse] = useState<Questions | null>(null)
    const { showModal } = useContext(ContextModal)
    const role = UserService.hasRole([ADMIN])
    const { pushMessage } = useContext(ContextMessage)
    const handleQuestionInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
        event.preventDefault()
        const name = event.target.name
        const value = event.target.value
        setQuestionResponse({
            ...question,
            [name]: value,
            status: '1',
        })
    }
    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (questionResponse) {
            const result = await QuestionService.putQuestionsById(question.id, questionResponse)
            if (result) {
                setList(questionResponse)
                pushMessage({
                    title: 'THÔNG BÁO',
                    type: 'SUCCESS',
                    message: 'Phản hồi đã được gửi',
                })
            } else {
                pushMessage({
                    title: 'CÓ LỖI',
                    type: 'ERROR',
                    message: 'Không sửa được phản hồi!',
                })
            }
        } else {
            pushMessage({
                title: 'CẢNH BÁO',
                type: 'WARN',
                message: 'Không có gì thay đổi!',
            })
        }
        showModal(false)
    }
    return (
        <div className="sc1920:h-[1014px] sc1536:w-[716px] sc1366:h-[760px] sc1536:h-[850px] sc1366:w-[716px] over-hidden p-[41px] sc1920:w-[904px] bg-white rounded-3xl">
            <h1 className="uppercase mb-5 text-center text-[28px] font-bold text-light_blue">Phản hồi thắc mắc</h1>
            <div className="flex flex-col h-[100%] justify-around over-hidden">
                <div className="grid grid-cols-2 gap-14">
                    <div className="flex flex-col">
                        <label htmlFor="username" className="text-2xl font-medium mb-2">
                            Người đặt câu hỏi:
                        </label>
                        <input
                            readOnly={true}
                            value={
                                question.user.firstName ? question.user.firstName + ' ' + question.user.lastName : ''
                            }
                            type="text"
                            id="username"
                            className="grow w-full h-[60px] py-1.5  leading-normal rounded-[10px] focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2  text-black"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="role" className="text-2xl font-medium mb-2">
                            Phân quyền:
                        </label>
                        <input
                            readOnly={true}
                            value={
                                question.typeUser ? (question.typeUser == '1' ? 'Giảng Viên' : 'Sinh viên') : 'không có'
                            }
                            type="text"
                            id="role"
                            className="grow w-full h-[60px] py-1.5  leading-normal rounded-[10px] focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2  text-black"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="title" className="text-2xl font-medium mb-2">
                        Tiêu đề:
                    </label>
                    <input
                        readOnly={true}
                        value={question.title ? question.title : ' '}
                        type="text"
                        id="username"
                        className="grow w-full h-[60px] py-1.5  leading-normal rounded-[10px] focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2  text-black"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="request" className="text-2xl font-medium mb-2">
                        Thắc mắc cần giải đáp:
                    </label>
                    <textarea
                        readOnly={true}
                        defaultValue={question.content ? question.content : ' '}
                        id="request"
                        className="w-full rounded-[10px] py-1.5 focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2  text-black"
                        rows={5}
                    ></textarea>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="content" className="text-2xl font-medium mb-2">
                        Nội dung giải đáp:
                    </label>
                    <textarea
                        defaultValue={question.answerContent ? question.answerContent : ' '}
                        name="answerContent"
                        onChange={(event) => handleQuestionInput(event)}
                        id="content"
                        className="w-full mb-12 rounded-[10px] py-1.5 focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2  text-black"
                        rows={5}
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <button
                        className="px-6 py-[14px] rounded-[10px] border-[1px] border-solid border-text_light_blue text-primary text-lg font-medium mx-3"
                        onClick={() => showModal(false)}
                    >
                        Huỷ
                    </button>
                    {role && (
                        <button
                            onClick={(event) => handleSubmit(event)}
                            className="px-6 py-[14px] rounded-[10px] bg-light_blue text-white text-lg font-medium"
                        >
                            Hoàn thành
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreateFeedbackForm
