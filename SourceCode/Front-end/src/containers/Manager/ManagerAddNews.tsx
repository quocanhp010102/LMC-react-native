import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TextEditor from '../../components/TextEditor'
import { ContextModal } from '../../Context/ModalContext'
import { ContextMessage } from '../../Context/ShowMessage'
import { ContextLayout } from '../../layout/Layout'
import { NewsService } from '../../services/NewsService'
import { UploadService } from '../../services/UploadService'
import { News } from '../../types'
import CalendarContainer from '../common/CalendarContainer'

function ManagerAddNews() {
    const [newsData, setNewsData] = useState<News>(() => {
        return {
            news_content: '',
            news_description: '',
            news_display_date: new Date(),
            news_image: '',
            news_title: '',
        }
    })

    const [contentNews, setContentNews] = useState<string>()
    const { pushMessage } = useContext(ContextMessage)

    const navigate = useNavigate()
    const [file, setFiles] = useState<File | null>()
    const [urlAvatar, setUrlAvatar] = useState<string | null>(null)
    const {AttachChidrenSideRight} = useContext(ContextLayout);
    const {showModal} = useContext(ContextModal);

  

    const refDelayInput = useRef<HTMLInputElement>()


    const hanldeChangeFile = (events: ChangeEvent<HTMLInputElement>) => {
        const file: File = events.target.files![0]
        if (file.type.match('image/*')) {
            setUrlAvatar(URL.createObjectURL(file))
            setFiles(file)
        }
    }

    const deleteFileName = () => {
        setFiles(null)
        setUrlAvatar(null)
    }

    const params = useParams()

    useEffect(()=> {
        AttachChidrenSideRight(<CalendarContainer/>);
        return ()=> {
            showModal(false);
        }
    }, [])

    useEffect(() => {
        if (params?.id) {
            ;(async () => {
                const data: News = await NewsService.getNewsById(params?.id)
              
                setNewsData({
                    ...data,
                })
                setContentNews(data.news_content)
                setUrlAvatar(data.news_image)
            })()
        }
    }, [params?.id])

    const goBack = () => {
        setNewsData({
            news_content: '',
            news_description: '',
            news_display_date: new Date(),
            news_image: '',
            news_title: '',
        })
        setContentNews('')
        navigate(-1)
    }

    const onChangeInputTime = (event: ChangeEvent<HTMLInputElement>) => {
        const { target } = event
        if (target.checked) {
            setNewsData({
                ...newsData,
                news_display_date: new Date(),
            })
        }
    }

    const changeDelayDate = (event: ChangeEvent<HTMLInputElement>) => {
        const { target } = event
        if (target.checked) {
            setNewsData({
                ...newsData,
                news_display_date: event.target.valueAsDate,
            })
        }
    }

    const convertFormData = () => {
        const formData = new FormData()
        if (file) {
            formData.append('file', file)
        }
        return formData
    }

    const onSubmitForm = async (event: React.SyntheticEvent) => {
        event.preventDefault()
        let urlFile
        if (file) {
            urlFile = await UploadService.uploadFile(convertFormData())
        }
        if (params.id) {
            NewsService.updateNews(params.id, {
                ...newsData,
                news_image: urlFile ? urlFile : newsData.news_image,
                news_content: contentNews,
                id: params.id,
            })
                .then(async (news) => {
                    pushMessage({
                        title: 'Thành Công',
                        type: 'SUCCESS',
                        message: 'Đã cập nhật thành công tin tức',
                    })
                    const data = await NewsService.postNewToHistory({
                        method: 'PUT',
                        name: news.news_title
                      
                    })

                    goBack()
                })
                .catch(() => {
                    pushMessage({
                        title: 'Thất bại',
                        type: 'ERROR',
                        message: 'Lưu tin tức thất bại',
                    })
                })
        }
        {
            NewsService.postNews({
                ...newsData,
                news_content: contentNews,
                news_image: urlFile ? urlFile : null,
            })
                .then(async (news) => {
                    pushMessage({
                        title: 'Thành Công',
                        type: 'SUCCESS',
                        message: 'Đã thêm tin tức thành công',
                    })

                    const data = await NewsService.postNewToHistory({
                        method: 'POST',
                        name: news.news_title
                        
                    })
                    goBack()
                })
                .catch(() => {
                    pushMessage({
                        title: 'Thất bại',
                        type: 'ERROR',
                        message: 'Thêm tin tức thất bại',
                    })
                })
        }
    }

    const changEventDelayTime = (event: ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked

        refDelayInput.current.disabled = !checked
    }

    const resetForm = () => {
        setContentNews('')
        setNewsData({
            news_content: '',
            news_title: '',
            news_display_date: null,
            news_description: '',
            news_image: '',
            news_isDisplay: '',
        })

        setFiles(null), setUrlAvatar(null)
    }

    return (
        <>
            <div className="flex m-6  items-center cursor-pointer" onClick={goBack}>
                <span>
                    <img src="\img\goback.png" />
                </span>
                <span className="ml-2 uppercase text-xl text-[#636363] font-bold">Quay lại</span>
            </div>
            <div className="relative m-6 lg:h-auto rounded-lg border-[1px]  border-solid border-[#D4D4D4] overflow-hidden">
                <div className="lg:w-[100%] rounded-lg">
                    <div className="p-[23px] flex border-b-[1px] border-solid border-[#D4D4D4] justify-between items-center">
                        <h1 className="uppercase text-primary_blue font-bold text-[40px]">
                            {params?.id ? 'CHỈNH SỬA TIN TỨC' : 'Tạo tin tức mới'}
                        </h1>
                    </div>

                    <form className="p-[23px]" onSubmit={onSubmitForm}>
                        <div className="grid grid-cols-1 gap-x-4">
                            <div className="flex flex-col">
                                <label htmlFor="title" className="text-lg font-medium mb-2">
                                    Tiêu đề tin tức *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    required
                                    name="news_title"
                                    value={newsData?.news_title}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                        setNewsData({
                                            ...newsData,
                                            news_title: event.currentTarget.value,
                                        })
                                    }}
                                    className="ml-auto grow w-full h-12 py-1.5  leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2 pl-1"
                                />
                            </div>

                            <div className="flex flex-col mt-6">
                                <label htmlFor="description" className="text-lg font-medium mb-2">
                                    Mô tả *
                                </label>
                                <input
                                    type="text"
                                    required
                                    name="news_description"
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                        setNewsData({
                                            ...newsData,
                                            news_description: event.currentTarget.value,
                                        })
                                    }}
                                    value={newsData?.news_description}
                                    id="description"
                                    className="ml-auto grow w-full pl-1 h-12 py-1.5  leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2"
                                />
                            </div>

                            <div className="flex flex-col mt-6">
                                <label htmlFor="count" className="text-lg font-medium mb-2">
                                    Nội dung tin tức *
                                </label>
                                {/* <div className='ml-auto grow focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2'> */}
                                <TextEditor
                                    onChange={(value: string) => setContentNews(value)}
                                    value={contentNews || ''}
                                />

                                {/* </div> */}
                            </div>

                            <div className="grid mt-6">
                                <div className="flex flex-col">
                                    <label htmlFor="file" className="text-lg font-medium mb-2">
                                        Tải lên ảnh tin tức:
                                    </label>
                                    <div className="grid grid-cols-2 rounded-[10px]  border-[1px]  p-3 border-solid border-borderColor">
                                        <div className="flex flex-col">
                                            <p>Tải lên ảnh định dạng PNG, JPEG. ( Tối đa ....mb)</p>
                                            <label
                                                htmlFor="upload_file"
                                                className="my-auto rounded-lg p-3 border-[1px] border-solid w-[120px] border-borderColor text-lg   text-color63 flex items-center justify-center"
                                            >
                                                <img src="\img\PathUpload.png" className='w-[29px] h-[28px]' alt="upload file" />{' '}
                                                <span className="ml-1 text-primary">Tải lên</span>
                                                <input
                                                    type="file"
                                                    onChange={hanldeChangeFile}
                                                    accept={'image/*'}
                                                    hidden
                                                    id="upload_file"
                                                />
                                            </label>
                                        </div>
                                        <div className="">
                                            <p>Xem trước ảnh tải lên:</p>

                                            <div className="w-[250px] h-[141px] flex items-center justify-center rounded-lg bg-[#E0E0E0]">
                                                <img
                                                    className="max-w-full max-h-full object-contain"
                                                    src={urlAvatar ? urlAvatar : '/img/img_link.png'}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="flex flex-col mt-6">
                                <label htmlFor="count" className="text-lg font-medium mb-2">
                                    Cài đặt thời gian đăng tải *
                                </label>
                                <div className="w-full p-6 border-[1px] border-solid border-[#D4D4D4] rounded-md">
                                    <div className="flex  text-[#636363] font-medium text-lg">
                                        <div className="flex-1 flex">
                                            <input
                                                type="radio"
                                                onChange={onChangeInputTime}
                                                name="post_now"
                                                hidden
                                                id="postnow"
                                            />
                                            <label htmlFor="postnow" className="label-radio mt-[7px]"></label>
                                            <label htmlFor="postnow" className="ml-2">
                                                Đăng ngay khi hoàn thành
                                            </label>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    hidden
                                                    onChange={changEventDelayTime}
                                                    name="post_now"
                                                    id="delaypost"
                                                />
                                                <label htmlFor="delaypost" className="label-radio"></label>
                                                <label htmlFor="delaypost" className="ml-2">
                                                    Hẹn giờ đăng
                                                </label>
                                            </div>
                                            <div className="flex flex-col ml-5 mt-2">
                                                <span>Thời gian truy cập</span>
                                                <div className="flex items-center mt-1">
                                                    <div className="p-3 ml-2 outline-none border-[1px] border-solid border-[#D4D4D4] rounded-md">
                                                        <input
                                                            ref={refDelayInput}
                                                            type="datetime-local"
                                                            disabled
                                                            onChange={changeDelayDate}
                                                            className="outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div className="flex mt-8 justify-end">
                                <button
                                    type="reset"
                                    onClick={resetForm}
                                    className="px-6 py-[14px] rounded-[10px] border-[1px] border-solid border-text_light_blue text-primary text-lg font-medium mx-3"
                                >
                                    Huỷ
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-[14px] rounded-[10px] bg-text_light_blue text-[#fff] text-lg font-medium"
                                >
                                    Hoàn thành
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ManagerAddNews
