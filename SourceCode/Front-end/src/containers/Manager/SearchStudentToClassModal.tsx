import { ArrowRightOutlined } from '@ant-design/icons'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../../components/Loading'
import { ContextModal } from '../../Context/ModalContext'
import { StudentService } from '../../services/StudentService'
import { Student } from '../../types'

type Props = {
    submitFunction?: (event: React.FormEvent<HTMLFormElement>, result: any[]) => void,
    id: string | number
}

function SearchStudentToClassModal(props: Props) {
    const { showModal } = useContext(ContextModal)
    const [listStudentSearch, setListStudent] = useState<any[]>([])
    const [listStudentClass, setStudentClass] = useState<any[]>([])
    const [searchKeyword, setSearchKeyword] = useState<string>(null)
    const params = useParams()
    const refStudentsClass = useRef<HTMLDivElement>(null);
    const refStudentsClassItem = useRef<HTMLDivElement>(null);
    const [currenPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const render = () => {
        let xhtml = []
        xhtml = listStudentClass.map((student, index) => {
            return (
                <div
                    key={student?.id}
                    className="flex items-center justify-between border-b-[1px] border-solid border-[#ccc]"
                >
                    <span className="text-[12px] text-[#333] font-medium">
                        {index + 1 + ': '} {student?.student_code} - {student?.student_fullname}
                    </span>{' '}
                    <span className="ml-2 cursor-pointer mb-[2px]" onClick={() => deleteStudent(student.id)}>
                        &times;
                    </span>
                </div>
            )
        })

        return xhtml
    }



    const renderUser = () => {
        let xhtml = []

        xhtml = listStudentSearch.map((student) => {
            return (
                <div
                    key={student.id}
                    className="flex items-center mt-1 relative cursor-pointer student_list-item"
                    onClick={() => addStudentToClass(student.id)}
             
                >
                    {student?.student_avatar ? (
                        <img
                            src={student?.student_avatar}
                            alt="sinh viên"
                            className="w-10 h-10 object-cover rounded-[100rem]"
                        />
                    ) : (
                        <div className="w-10 flex items-center text-[#fff] font-bold justify-center h-10 rounded-[100rem] bg-[#2196f3]">
                            {student?.student_fullname.slice(0, 1).toUpperCase()}
                        </div>
                    )}
                    <div className="flex flex-col ml-1">
                        <span className="text-sm">{student?.student_code}</span>
                        <span className="text-[#333] text-sm">{student?.student_fullname}</span>
                    </div>
                    <div className="arrow_student">
                        <ArrowRightOutlined />
                    </div>
                </div>
            )
        })

        return xhtml
    }

    const addStudentToClass = (value: any) => {
        let check = listStudentClass.some((student) => +student?.id === +value)
        let student = listStudentSearch.find((student) => +student?.id === +value)

        if (!check) {
            setStudentClass([...listStudentClass, student])
        }
        const arrNew = listStudentSearch
        arrNew.forEach((student, index) => {
            if (+student.id === value) {
                arrNew.splice(index, 1)
            }
        })
        setListStudent([...arrNew])
    }

    const deleteStudent = (studentId: any) => {
        const arrNews = listStudentClass
        setListStudent([...listStudentSearch, arrNews.find((student) => student.id == studentId)])
        setStudentClass(arrNews.filter((student) => student.id != studentId))
        // getStudentData()
    }

    const selectAlltoClass = () => {
        setStudentClass([...listStudentClass, ...listStudentSearch])
        setListStudent([])
    }

    const getStudentData = (page) => {
        setIsLoading(true);
                 StudentService.getListStudentNoInClass(props.id, searchKeyword !== null ? searchKeyword : "", {
                     page,
                     size: 10
                        })
                      .then((data) => {
                          setTotalPage(data.totalPages);
                          setListStudent(
                              [
                                  ...listStudentSearch,                               
                              ].concat(data.content.filter((item: Student) => {
                                return listStudentClass.every((element) => element.id != item.id)
                            }),)

                              
                          )
                          setIsLoading(false);
                      })
                      .catch((err) => { setIsLoading(false);})    
    }

    const getStudentDataSearch = (keyword:string)=> {
        setIsLoading(true);
        StudentService.getListStudentNoInClass(props.id, keyword, {
            currenPage,
            size: 10
               })
             .then((data) => {
                 setTotalPage(data.totalPages);
                 setListStudent(
                     data.content.filter((item: Student) => {
                         return listStudentClass.every((element) => element.id != item.id)
                     }),
                 )
                 setIsLoading(false);
             })
             .catch((err) => { setIsLoading(false);})    
    }

    useEffect(()=> {
        if(searchKeyword !== null) {
                if(searchKeyword !== "") {
                    getStudentDataSearch(searchKeyword)
                }else {
                    getStudentData(currenPage);
                }
        }
    }, [searchKeyword])


    useEffect(()=> {
        if(currenPage <= totalPage - 1) {
            if(searchKeyword !== null && searchKeyword !== "") {
                getStudentDataSearch(searchKeyword)
            }else {
                getStudentData(currenPage)
            }
            
        }
    }, [currenPage])


    useEffect(()=> {
        let timeOut:any;
        if(refStudentsClass && refStudentsClass.current) {
            refStudentsClass.current.addEventListener("scroll", (event)=> {
                const loadData = refStudentsClassItem.current.getBoundingClientRect().bottom > 500 ? refStudentsClassItem.current.getBoundingClientRect().bottom : 1000
                if(loadData <= 900) {
                    clearTimeout(timeOut);
                    timeOut = setTimeout(()=> {
                        setCurrentPage((page)=> page+1)                     
                    }, 500)

                }
                
            })
        }

        return ()=> {
            clearTimeout(timeOut);
            refStudentsClass.current && refStudentsClass.current.removeEventListener("scroll", (event)=> {
                setCurrentPage(1)  
            })
        }
    }, [refStudentsClass.current])

    return (
        <form
            onSubmit={(event) => props.submitFunction(event, listStudentClass)}
            onReset={() => showModal(false)}
            className="h-[750px] p-[41px] w-[904px] flex flex-col justify-between bg-white rounded-[20px] overflow-hidden"
        >
            <h1 className="uppercase text-primary_blue font-bold text-[18px] text-center">THÊM SINH VIÊN</h1>

            <div className="relative flex grow items-center rounded-lg mt-4 w-full group">
                <svg
                    className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                </svg>
                <input
                    type="text"
                    value={searchKeyword}
                    onChange={(event) => {
                        setSearchKeyword(event.target.value)
                        setIsLoading(true);
                    }}
                    className="ml-auto grow w-full h-12 py-1.5 pl-10 pr-4 leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 focus:bg-gray-100 ring-opacity-90 border-solid border-2"
                    // placeholder="Search"
                />
            </div>

            <div className="min-h-[430px] max-h-[430px] flex">
                <div className="flex-1 h-full bg-white">
                    <h1>Danh sách Sinh viên</h1>
                    <div className="h-full hideScroll p-1 overflow-y-auto"  ref={refStudentsClass}>
                        <div ref={refStudentsClassItem}>
                            {renderUser()}
                          
                            {
                                isLoading && <div className='flex justify-center'> <Loading/></div>
                            }

                        </div>
                        </div>
                </div>

                <div className="flex-1 ml-1 h-full">
                    <h1>Sinh viên Lớp học</h1>
                    <div className="h-full hideScroll overflow-y-auto">{render()}</div>
                </div>
            </div>
            <div className="flex pt-3 items-center justify-between">
                <div
                    className="cursor-pointer text-[#2196f3]"
                    onClick={selectAlltoClass}
                    style={{ visibility: listStudentSearch.length == 0 ? 'hidden' : 'visible' }}
                >
                    <span>Chọn tất cả ={'>'}</span>
                </div>

                <div className="mt-[25px]">
                    <button
                        type="reset"
                        className="w-[180px] h-[50px] rounded-[10px] border-[1px] border-solid border-light_blue text-primary text-[18px] font-medium mx-3"
                    >
                        Huỷ
                    </button>
                    <button
                        type="submit"
                        className="w-[180px] h-[50px] rounded-[10px] bg-light_blue text-[#fff] text-[18px] font-medium"
                    >
                        Cập nhật
                    </button>
                </div>
            </div>
        </form>
    )
}

export default SearchStudentToClassModal
