import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Paging from '../../components/Paging'
import HeaderManager from '../../components/HeaderManager'
import { ContextLayout } from '../../layout/Layout'
import CalendarContainer from '../common/CalendarContainer'
import { ClassService } from '../../services/ClassService'
import Loading from '../../components/Loading'
import { ContextModal } from '../../Context/ModalContext'

type ClassDepartment = {
    id?: string
    classroomName?: string
    classroomCode?: string
    classroomTotalStudent?: number
    department: {
        id: string
        department_name?: string
        department_type?: string
        department_image?: string
    }
}


const SIZE = 10;

function ManagerClassDepartment() {
    const [listClass, setListClass] = useState<ClassDepartment[]>([])
    const [itemsCheck, setItemCheck] = useState<any[]>([])
    const [isShowAction, setIsShowAction] = useState<boolean>(() => {
        return itemsCheck.length > 0
    })

    const [searchParams] = useSearchParams()
    const [currenPage, setCurrentPage] = useState<any>(searchParams.get('page') || 1)
    const [total, setTotal] = useState<number>(1)
    const [searchText, setSearchText] = useState<string>(null)
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate()

    const { AttachChidrenSideRight } = useContext(ContextLayout)
    const {showModal} = useContext(ContextModal);

    useEffect(() => {
        AttachChidrenSideRight(<CalendarContainer />)
        return ()=> {
            showModal(false);
        }
    }, [])

    useEffect(() => {
        if (searchParams.get('page')) {
            const page = searchParams.get('page')        
            setCurrentPage(page)
        }
    }, [searchParams])

    useEffect(()=> {
        if (searchText !== '' && searchText !== null) {
            getClassSearch(searchText, currenPage)
        } else {
            getClass(currenPage)
        }
    }, [currenPage])

    useEffect(() => {
        let timeout:any;
        if(searchText !== null) {
            setIsLoading(true)
            timeout   = setTimeout(() => {
                if (searchText !== '') {
                    getClassSearch(searchText, currenPage)
                } else {
                    getClass(currenPage)
                }

            }, 1000)
        }

        return () => {
            clearTimeout(timeout)
        }
    }, [searchText])

    const getClass = async (page: any) => {
        setIsLoading(true);
        ClassService.getClasses({
            page: page - 1,
            size: SIZE,
            sort: "classroom_name,asc" 
        }).then((data)=> {
            setListClass(data.content)
            setTotal(data.totalElements)
            setIsLoading(false)
            if(data.content.length === 0) {
                if(currenPage > 1) {
            
                   navigate(`?page=${currenPage - 1}`);
                   setCurrentPage((page)=> page - 1);
                }
            } 
        }).catch((erorr)=> {

            setIsLoading(false);
        })
    }

    const getClassSearch = async (text: any, page: any) => {
      
        ClassService.searchClassRomeByAdmin(text, { page: page - 1, size: SIZE, sort: "classroom_name,asc" }).then((data)=> {
         
            setListClass(data.content)
            setTotal(data?.totalElements)
             setIsLoading(false);
            
        }).catch((error)=> {
            setIsLoading(false);
        })
    }

    const handleAdd = () => {
        navigate('/manager-classes/add')
    }

    const handleDelete = () => {}

    const handleWarning = () => {}

    const searchByKeyWord = (event: ChangeEvent<HTMLInputElement>) => {
      
        setSearchText(event.target.value.trim())
        setCurrentPage(1)
    }

    const handleUpdate = () => {

        navigate(`/manager-classes/update/${itemsCheck.pop()}`)
    }

    return (
        <div className="relative lg:h-auto sc1920:m-5 sc1920:rounded-lg flex border-[1px] border-solid border-[#D4D4D4] overflow-hidden">
            <div className="lg:w-[100%] rounded-lg">
                <HeaderManager
                    searchByKeyWord={searchByKeyWord}
                    isShowAction={isShowAction}
                    title="Quản lý Lớp học"
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                    handleUpdate={handleUpdate}
                    handleWarning={handleWarning}
                    isShowWarning={false}
                    isShowAddAction={true}
                />

                <div className="w-full">
                    <table className="manager_table w-full text-center text-__text_primary">
                        <thead>
                            <tr className="uppercase text-lg font-bold py-12">
                                {/* <td>
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
                                </td> */}
                                <td>STT</td>

                                {/* <td>Mã Chuyên ngành</td> */}
                                <td>Tên Chuyên ngành</td>

                                <td>Mã Lớp</td>

                                <td>Tên lớp</td>
                                <td>Sĩ số</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                isLoading ? (
                                    <tr className=''>
                                        <td colSpan={5}><Loading size={32} /></td>
                                    </tr>

                                ): (
                                    listClass.map((value, index) => {
                                        return (
                                            <tr key={index}>
                                                {/* <td>
                                                    <input
                                                        type="checkbox"
                                                        name="user_item"
                                                        onChange={() => handleFromItemChekbox(value.id)}
                                                        ref={(element) => {
                                                            refCheckboxs.current[index] = element
                                                        }}
                                                        hidden
                                                        id={`userItem_${index}`}
                                                    />
                                                    <label htmlFor={`userItem_${index}`} className="checkbox-item">
                                                        <CheckOutlined />
                                                    </label>
                                                </td> */}
        
                                                <td>{(SIZE)*(currenPage - 1) + index + 1}</td>
        
                                                {/* <td>{value.department.department_name}</td> */}
                                                <td>{value.department.department_name}</td>
                                                <td>{value?.classroomCode}</td>
                                                <td className="cursor-pointer hover:text-[#35baf6] hover:underline duration-100">
                                                    <Link to={`${value.id}`}>{value.classroomName}</Link>
                                                </td>
        
                                                <td>{value.classroomTotalStudent ? value.classroomTotalStudent : 0}</td>
                                            </tr>
                                        )
                                    })
                                )
                            }
                        </tbody>
                    </table>

                    {<Paging currenPage={currenPage} setCurrentPage={setCurrentPage} total={Math.ceil(total / SIZE)} />}
                </div>
            </div>
        </div>
    )
}

export default ManagerClassDepartment
