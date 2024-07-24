import { ChangeEvent, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { CheckOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Paging from '../../components/Paging'
import HeaderManager from '../../components/HeaderManager'
import { NewsService } from '../../services/NewsService'
import { News } from '../../types'
import DialogActionSuccess from '../common/DialogActionSuccess'
import { ContextModal } from './../../Context/ModalContext'
import { ContextMessage } from '../../Context/ShowMessage'
import { ContextLayout } from '../../layout/Layout'
import CalendarContainer from '../common/CalendarContainer'
import { fomatDate } from '../fomartDate'
import DialogConfirm from '../common/DialogConfirm'
import SearchStudentModal from './SearchStudentModal'
import Loading from '../../components/Loading'

function ManagerNews() {
    const [listNews, setListNews] = useState<News[]>([])
    const [itemsCheck, setItemCheck] = useState<any[]>([])
    const { AttachChidrenSideRight } = useContext(ContextLayout)
    const [isShowAction, setIsShowAction] = useState<boolean>(() => {
        return itemsCheck.length > 0
    })
    const [searchParams] = useSearchParams()
    const { setModal, showModal} = useContext(ContextModal)
    const [currenPage, setCurrentPage] = useState<any>(searchParams.get('page') || 1)
    const [isLoading, setIsLoading] = useState(true);

    const refCheckboxs = useRef<HTMLInputElement[] | any[]>([])
    const refCheckboxALl = useRef<HTMLInputElement | null>(null)
    const [total, setTotal] = useState<number>(0)
    const [searchText, setSearchText] = useState<string>(null)

    const navigate = useNavigate()
    const { pushMessage } = useContext(ContextMessage)
    useEffect(() => {
        AttachChidrenSideRight(<CalendarContainer />)
         window.scrollBy(0, -document.documentElement.scrollTop)
 
        return ()=> {
            showModal(false);
        }
    }, [])

    useEffect(() => {
        if (searchText !== '' && searchText !== null) {
            getNewBySearch(searchText, currenPage)
        } else {
            getNews(currenPage)
        }
    }, [currenPage])

    useEffect(() => {
        if (searchParams.get('page')) {
            const page = searchParams.get('page')
            setCurrentPage(page)
            window.scrollBy(0, -document.documentElement.scrollTop)
        }
    }, [searchParams])

    const getNews =  (page: any) => {
        setIsLoading(true)
        NewsService.getNewsHome({ page: page - 1, size: 7 }).then((news)=> {
            setListNews(news.content)
            setTotal(news.totalElements)
            setIsLoading(false);
        }).catch(()=> {
            setIsLoading(false);
        })
    }

    useEffect(() => {
        const isCheckAll = itemsCheck.length === listNews.length
        refCheckboxALl.current!.checked = isCheckAll
        setIsShowAction(itemsCheck.length > 0)
    }, [itemsCheck, listNews])

    useEffect(() => {
        let timeout: any
        if(searchText !== null) {
            if (searchText !== '') {
                timeout = setTimeout(() => {
                    getNewBySearch(searchText, 1)
                   
                }, 1000)
            } else {
                getNews(currenPage)
            }
        }

        return () => {
            clearTimeout(timeout)
        }
    }, [searchText])

    const confirmDialog = () => {
       
        setModal(<DialogConfirm title="Bạn chắc chắn muốn xóa tin tức này không?" onClick={() => handleDelete()}/>)
        showModal(true)
    }

    const handleCheckAll = (e: ChangeEvent<HTMLInputElement>) => {
        const isCheckAll = e.currentTarget.checked
        refCheckboxs.current.forEach((item: HTMLInputElement, index) => {
            if (isCheckAll) {
                setItemCheck(listNews.map((item) => item.id))
            } else {
                setItemCheck([])
            }
            item.checked = isCheckAll
        })
    }

    const handleFromItemChekbox = (index: number) => {
        const isChecked = refCheckboxs.current[index].checked
        if (isChecked) {
            setItemCheck([...itemsCheck, listNews[index].id])
        } else {
            const newArr: any[] = itemsCheck
            newArr.splice(index, 1)
            setItemCheck([...newArr])
        }
    }

    const handleAdd = () => {
        navigate('/manager-news/add')

        // showMessage(true)
    }

    const handleDelete = async () => {
        let id = itemsCheck.join(',')
        NewsService.deleteNews(id)
            .then(() => {
                // const newsList = listNews;
                const newsList = listNews.filter((news, index) => {
                    return !itemsCheck.includes(news.id)
                })

                pushMessage({
                    title: 'Thành công',
                    type: 'SUCCESS',
                    message: 'Đã xóa tin tức thành công',
                })

                setListNews([...newsList])
                setItemCheck([])
                // showMessage(true)
                showModal(false);
            })
            .catch((error) => {
                pushMessage({
                    title: 'Thất bại',
                    type: 'ERROR',
                    message: 'Xóa tin tức thất bại',
                })
                showModal(false);
            })
    }

    const handleWarning = () => {}

    const searchByKeyWord = async (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentPage(1);
        navigate("?page=1")
        setSearchText(event.currentTarget.value.trim())
        setIsLoading(true)
    }

    const getNewBySearch =  (text: string, page: any) => {
        NewsService.searchNews(text, { page: page - 1, size: 7 }).then((news)=> {

            setListNews(news.content)
            setTotal(news.totalElements)
            setIsLoading(false)
        }).catch(()=> {
            setIsLoading(false)
        })
    }

    const handleUpdate = () => {
        navigate(`/manager-news/edit/${itemsCheck.pop()}`)
    }

    const changeStatus = async (id: any, isDisplay: number) => {
        let status = isDisplay === 1 ? 0 : 1
        NewsService.updateDisplay(id).then(() => {
            const newsList = listNews

            newsList.forEach((news) => {
                if (news.id === id) {
                    news.news_isDisplay = status.toString()
                }
            })

            setListNews([...newsList])
        })
    }

    return (
        <div className="relative sc1920:m-5  lg:h-auto sc1920:rounded-lg flex sc1920:border-[1px] sc1920:border-solid border-[#D4D4D4] overflow-hidden">
            <div className="w-full rounded-lg">
                <HeaderManager
                    handleUpdate={handleUpdate}
                    isShowWarning={true}
                    isShowAction={isShowAction}
                    handleAdd={handleAdd}
                    handleDelete={confirmDialog}
                    handleWarning={handleWarning}
                    searchByKeyWord={searchByKeyWord}
                    title={'Danh sách tin tức'}
                    isShowAddAction={true}
                />

                <div className="w-full">
                    <table className="manager_table w-full text-center text-__text_primary">
                        <thead>
                            <tr className="uppercase text-lg font-bold py-12">
                                <td className="w-[50px]">
                                    <input
                                        type="checkbox"
                                        ref={refCheckboxALl}
                                        onChange={handleCheckAll}
                                        name=""
                                        hidden
                                        id="all_user"
                                    />
                                    <label htmlFor="all_user" className="checkbox-item">
                                        <CheckOutlined />
                                    </label>
                                </td>
                                <td>STT</td>

                                <td className="w-[50px]"></td>
                                <td>Tiêu đề</td>

                                <td>TÓM TẮT NỘI DUNG</td>

                                <td className="w-[150px]">Ngày đăng</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                isLoading ? <tr>
                                            <td colSpan={6}>
                                                <Loading/>
                                            </td>
                                        </tr> : (

                                    listNews.length > 0 ? (
                                        listNews.map((news, index) => {
                                            return (
                                                <tr key={news.id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            name="user_item"
                                                            onChange={() => handleFromItemChekbox(index)}
                                                            ref={(element) => {
                                                                refCheckboxs.current[index] = element
                                                            }}
                                                            hidden
                                                            id={`userItem_${index}`}
                                                        />
                                                        <label htmlFor={`userItem_${index}`} className="checkbox-item">
                                                            <CheckOutlined />
                                                        </label>
                                                    </td>

                                                    <td>{(7)*(currenPage - 1) + index + 1}</td>
                                                    <td
                                                        onClick={() => changeStatus(news.id, +news.news_isDisplay)}
                                                            align="center"
                                                    >
                                                        <span>
                                                        <img
                                                            src={`\/img\/${
                                                                news.news_isDisplay === '1'
                                                                    ? 'star_rate_18px.png'
                                                                    : 'star_rate_emptypx.png'
                                                            }`}
                                                            alt=""
                                                        />

                                                        </span>
                                                    </td>

                                                    <td>
                                                        <Link to={`/manager-news/edit/${news?.id}`}>{news?.news_title}</Link>
                                                    </td>

                                                    <td dangerouslySetInnerHTML={{ __html: news?.news_description }}></td>

                                                    <td>
                                                        {news.news_created_date
                                                            ? fomatDate(news?.news_created_date.toLocaleString())
                                                            : ''}
                                                             {news.news_date
                                                            ? fomatDate(news?.news_date.toLocaleString())
                                                            : ''}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6}>Hiện tại chưa có tin tức</td>
                                        </tr>
                                    )
                                        )
                            }
                        </tbody>
                    </table>

                    {<Paging currenPage={currenPage} setCurrentPage={setCurrentPage} total={Math.ceil(total / 7)} />}
                </div>
            </div>
        </div>
    )
}

export default ManagerNews
