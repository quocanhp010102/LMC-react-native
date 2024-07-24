import React, { ChangeEvent, useContext, useRef } from 'react'
import clsx from 'clsx'
import { SyntheticEvent, useEffect, useState } from 'react'
import UserManualItem from '../../components/UserManualtem'
import { UserManualService } from '../../services/UserManualService'
import { tutorialType } from '../TypeProps/TutorialProps'
import { ContextLayout } from '../../layout/Layout'
import CalendarContainer from '../common/CalendarContainer'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Paging from '../../components/Paging'
import { QuestionService } from '../../services/QuestionService'
import CreateFeedbackForm from '../Manager/CreateFeedbackForm'
import { Questions } from '../../types/Question'
import { ContextModal } from '../../Context/ModalContext'
import ViewVideoComponent from '../../components/ViewVideoComponent'
import { ContextMessage } from './../../Context/ShowMessage'
import UserService from '../../services/UserService'
import { LECTURER } from '../../types'

function StudentUserManual() {
    const [ListTutorials, setListTutorials] = useState<tutorialType[]>([])
    const [searchParams] = useSearchParams()
    const [currenPage, setCurrentPage] = useState<any>(searchParams.get('page') || 1)
    const [postQuestion, setPostQuestion] = useState<{ title: string; question: string }>({
        title: '',
        question: '',
    })
    const [inputSearch, setInputSearch] = useState('')
    const [isShowVideo, setShowVideo] = useState<boolean>(false)
    const [urlVider, setUrlVideo] = useState<string | null>(null)
    const [totalPages, setTotalPages] = useState<number | null>(null)
    const [pageRequest, setPageRequest] = useState<number>(0)
    const [totalPageRequest, setTotalPageRequest] = useState<number>(1)
    const { pushMessage } = useContext(ContextMessage)
    const TypingTimeOutRef = useRef(null)
    const navigate = useNavigate()
    const { setModal, showModal } = useContext(ContextModal)
    const [reques, setRequest] = useState<Questions[]>([])
    const trshowModle = (reques: Questions) => {
        setModal(<CreateFeedbackForm question={reques} />)
        showModal(true)
    }
    const handleNavigate = (value: any) => {
        //navigate by value;
    }
    const viewVideo = (videoUrl: string) => {
        if (videoUrl) {
            setUrlVideo(videoUrl)
        }
        setShowVideo(true)
    }
    const { AttachChidrenSideRight } = useContext(ContextLayout)
    useEffect(() => {
        AttachChidrenSideRight(<CalendarContainer />)
        return () => {
            showModal(false)
        }
    }, [])

    const handleChangeQuestion = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.preventDefault()
        const name = event.target.name
        const value = event.target.value
        setPostQuestion({
            ...postQuestion,
            [name]: value,
        })
    }

    const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const value = event.target.value
        setInputSearch(value)
        setCurrentPage(1)
        navigate('')
    }
    const submitForm = async (events: SyntheticEvent) => {
        events.preventDefault()
        if (postQuestion.title != '' && postQuestion.question != '') {
            const question = {
                title: postQuestion.title,
                content: postQuestion.question,
            }
            const postQuestioned = await QuestionService.postQuestion(question)
            if (postQuestioned) {
                setPostQuestion({ title: '', question: '' })
                if (reques.length == 15) {
                    reques.pop()
                }
                setRequest([postQuestioned, ...reques])
                pushMessage({
                    title: 'Thành Công',
                    type: 'SUCCESS',
                    message: 'Thắc mắc đã được gửi đi',
                })

                //   showMessage(true);
            } else {
                pushMessage({
                    title: 'Thất bại',
                    type: 'ERROR',
                    message: 'Không gửi được thử lại',
                })

                //    showMessage(true);
            }
        } else {
            pushMessage({
                title: 'Thất bại',
                type: 'ERROR',
                message: 'Các trường không được để trống',
            })

            //    showMessage(true);
        }
    }

    // get hướng dẫn
    const getAllTutorial = async (page: number, size: number) => {
        const result = await UserManualService.getTutorial(page, size)
        if (result) {
            const { totalPages, content, pageable, totalElements, size } = result
            setListTutorials(content)
            setTotalPages(totalPages)
        } else {
            return
        }
    }
    const searchTutorial = async (query: string, page?: number, size?: number) => {
        const searched = await UserManualService.searchTutorial(query, page, size)
        if (searched) {
            const { totalPages, content, pageable, totalElements, size } = searched
            setListTutorials(content)
            setTotalPages(totalPages)
        }

        return
    }
    const getQuestionByUserId = async (page?: number, size?: number) => {
        const result = await QuestionService.getQuestiosByUser(page, size)
        if (result) {
            const { totalPages, content, pageable, totalElements, size } = result
            setRequest([...reques, ...content])
            setTotalPageRequest(totalPages)
        } else {
            return
        }
    }
    const handleSetPageReques = () => {
        setPageRequest((prevState) => prevState + 1)
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
        })
        if (searchParams.get('page')) {
            const page = searchParams.get('page')
            setCurrentPage(page)
        }
    }, [searchParams])

    useEffect(() => {
        if (inputSearch != '') {
            if (TypingTimeOutRef.current) {
                clearTimeout(TypingTimeOutRef.current)
            }

            TypingTimeOutRef.current = setTimeout(() => {
                searchTutorial(inputSearch, currenPage - 1, 8)
            }, 500)
        } else {
            clearTimeout(TypingTimeOutRef.current)
            getAllTutorial(currenPage - 1, 8)
        }
    }, [currenPage, inputSearch])
    useEffect(() => {
        if (pageRequest < totalPageRequest) {
            getQuestionByUserId(pageRequest, 15)
        }
    }, [pageRequest])

    return (
        <div className="sc1920:pl-[29px] pt-5 sc1536:pl-[27px] sc1366:pl-[19px] sc1920:pr-[28px] sc1536:pr-[21px] sc1366:pr-[20px]">
            <div className="flex justify-between items-center">
                <h1 className="uppercase text-blue_bg font-bold text-[28px] sc1366:text-[24px]">
                    HDSD TUU - LMS {UserService.hasRole([LECTURER]) ? "GIẢNG VIÊN" : "SINH VIÊN"}
                </h1>

                {/* search */}
                <div className="flex items-center justify-between">
                    <div className="relative flex grow items-center w-full sc1920:w-[360px] sc1536:w-[360px] sc1366:w-[336px] group">
                        <svg
                            className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                        </svg>
                        <input
                            value={inputSearch}
                            type="text"
                            onChange={(event) => handleSearchInput(event)}
                            className="ml-auto grow w-full sc1920:h-[40px] sc1536:h-[40px] sc1366:h-[38px] py-1.5 pl-10 pr-4 leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 focus:bg-gray-100 ring-opacity-90 border-solid border-2"
                            placeholder="Tìm kiếm..."
                        />
                    </div>
                </div>
            </div>

            <div className="mt-7">
                {ListTutorials.length > 0 ? (
                    <div className={clsx('grid', 'grid-cols-4', 'gap-3')}>
                        {ListTutorials.map((tutorial, index) => {
                            return (
                                <UserManualItem
                                    key={index}
                                    value={tutorial?.id}
                                    ListTutorial={tutorial}
                                    onDoubleClick={(videoUrl) => viewVideo(videoUrl)}
                                    isList={true}
                                    roles="STUDENT"
                                />
                            )
                        })}
                    </div>
                ) : (
                    <div className="w-full text-center text-xl min-h-[200px]"> Không tìm thấy hướng dẫn nào!</div>
                )}
                {totalPages > 0 && (
                    <Paging currenPage={currenPage} setCurrentPage={setCurrentPage} total={totalPages} />
                )}
            </div>

            <div className="mt-7 mb-12">
                <form onSubmit={submitForm} method="POST">
                    <div className="flex flex-col mb-5">
                        <label
                            htmlFor="file"
                            className="sc1920:text-[28px] sc1536:text-[28px] sc1366:text-[24px] text-blue_bg font-bold mb-2"
                        >
                            TƯ VẤN - GIẢI ĐÁP THẮC MẮC
                        </label>

                        <div className="w-full  h-auto min-h-[258px] p-5 rounded-xl focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2 border-[#D4D4D4]  text-black overflow-hidden">
                            <label className="text-lg font-medium text-[#636363]">Tiêu đề</label>
                            <input
                                value={postQuestion.title}
                                name="title"
                                onChange={(event) => handleChangeQuestion(event)}
                                className="w-full text-[18px] italic focus:outline-none p-3 my-4 rounded-xl border-solid border-2 border-[#D4D4D4]"
                                type="text"
                            />
                            <label className="text-lg font-medium text-[#636363]">Thắc mắc cần giải đáp</label>
                            <textarea
                                name="question"
                                value={postQuestion.question}
                                onChange={(event) => handleChangeQuestion(event)}
                                className="w-full mt-5 text-[18px] italic focus:outline-none rounded-xl border-solid border-2 border-[#D4D4D4]  p-1.5  text-black"
                                rows={11}
                            ></textarea>

                            <div className="flex justify-end mb-5 mt-7">
                                <button
                                    onClick={() => setPostQuestion({ title: '', question: '' })}
                                    type="reset"
                                    className="px-6 py-[12px] h-[50px] rounded-[10px] border-[1px] border-solid border-light_blue text-primary text-lg font-medium mx-3"
                                >
                                    Xoá
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-[12px] h-[50px] rounded-[10px] bg-light_blue text-[#fff] text-lg font-medium"
                                >
                                    Gửi câu hỏi
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="mt7 mb-5">
                <h5 className="text-left font-bold text-[28px] text-blue_bg mb-4">THẮC MẮC ĐÃ ĐƯỢC GIẢI ĐÁP</h5>
                <table className="manager_table border-y border-solid border-[#6363631a] w-full text-center text-__text_primary">
                    <thead>
                        <tr className="uppercase text-lg font-bold py-12">
                            <td>STT</td>
                            <td>TIÊU ĐỀ</td>
                        </tr>
                    </thead>
                    <tbody>
                        {reques.length > 0 ? (
                            reques.map((reque, index) => {
                                return (
                                    <tr key={index} onClick={() => trshowModle(reque)}>
                                        <td>{index + 1}</td>
                                        <td>{reque?.title ? reque?.title : 'Không có tiêu đề'}</td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={2}>Bạn chưa có thắc mắc nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {reques.length < totalPageRequest && (
                    <div className="w-full p-7 flex flex-col items-center justify-center">
                        <button onClick={handleSetPageReques} className="text-blue_bg hover:underline" name="month">
                            Xem thêm
                        </button>
                    </div>
                )}
            </div>

            {isShowVideo && (
                <ViewVideoComponent urlVider={urlVider ? urlVider : ''} setShowVideo={(ishow) => setShowVideo(ishow)} />
            )}
        </div>
    )
}

export default StudentUserManual
