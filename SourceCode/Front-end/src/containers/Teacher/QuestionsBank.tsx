import clsx from "clsx";
import { AddCircle } from "iconsax-react";
import { ChangeEvent, useContext, useEffect, useState } from "react";import { QuestionBankItem } from "../../components/QuestionBankItem";
;
import { ContextModal } from "../../Context/ModalContext";
import { ContextMessage } from "../../Context/ShowMessage";
import { ContextLayout } from "../../layout/Layout";
import { CourseService } from "../../services/CourseService";
import { DepartmentService } from "../../services/DepartmentService";
import { Course, Department, QuestionBank } from "../../types";
import CalendarContainer from "../common/CalendarContainer";
import { CreateQuestionBank } from "../common/CreateQuestionBank";
import { QuestionBankService } from '../../services/QuestionBankService';
import useInView from "../../hooks/useInView";
import Loading from "../../components/Loading";

type questionAnser = {
    id: string | number,
    title: string,
    isMatch: boolean,
}
export type Question = {
    id?: number,
    type?: 0 | 1,
    title?: string,
    answer?: string,
    department?: {
        id: string | number,
        name?: string
    },
    course?: {
        id: string | number,
        name?: string
    },
    questionAnser?: questionAnser[]
}

export function QuestionsBank(){
    const {AttachChidrenSideRight} = useContext(ContextLayout);
    const {showModal, setModal} = useContext(ContextModal);
    const [isFilter, setIsFilter] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([])
    const {pushMessage} = useContext(ContextMessage)
    const [department, setDepartment] = useState<Department[]>([]);
    const [courses, setCourses] = useState<Course[]>([])
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(1);


    const [searchText, setSearchText] = useState<string>(null);

    const [filter, setFilter] = useState<{
        departmentId: number,
        courseId:number,
        questionType: number
    }>({
        departmentId: -1,
        courseId: -1,
        questionType: -1
    })

    const {isInView, ref} = useInView();
   

    const filterFunction = async (filter)=> {
        const  {
            departmentId,
            courseId,
            questionType
        } = filter;
       setLoading(true);
        if(departmentId === -1 &&courseId === -1 && questionType === -1 && searchText === null) {
            getQuestionBank(0, false)
            setCurrentPage(0)
        }else {
            setCurrentPage(0)
            getQuestionByFilter(0,filter, false);
    
        }
       
    }


   const  getQuestionByFilter = async (page,filter, isPush) => {
  QuestionBankService.getByFilter({
        ...filter,
        searchText,
        page: page,
        size: 12
    }).then(data => {
        const newArray = isPush ?  [...questionBanks, ...data.content] : data.content;
        setQuestionBanks(newArray)
        setTotalPage(data.totalPages)
        setLoading(false)

    }).catch(()=> {
        setLoading(false)
    });
    }

    


    useEffect(()=> {
        AttachChidrenSideRight(<CalendarContainer/>)

    
        // setLoading(false);
        return ()=> {
            showModal(false);
        }
    }, [])


    useEffect(()=> {
        const  {
            departmentId,
            courseId,
            questionType
        } = filter;
        setLoading(true);
        if(departmentId === -1 && courseId === -1 && questionType === -1 &&  searchText === null && searchText  === "") {
            getQuestionBank(currentPage, currentPage === 0 ? false : true)
        }else {
            getQuestionByFilter(currentPage,filter,  currentPage === 0 ? false : true);
        }
    }, [currentPage])


    useEffect(()=> {
        let timeOut:any;
        if(searchText !== null) {
            setLoading(true);
            if(searchText.trim() !== "") {
                timeOut = setTimeout(()=> {
                    QuestionBankService.getByFilter({...filter, searchText, page: 0, size: 12}).then(data => {
                        setQuestionBanks(data.content)
                        setTotalPage(data.totalPages)
                        setLoading(false)
                    }).catch(()=> {
                        setLoading(false)
                    });



                }, 1000)
            }else {
                const  {
                    departmentId,
                    courseId,
                    questionType
                } = filter;
                if(departmentId === -1 && courseId === -1 && questionType === -1) {
                    getQuestionBank(currentPage, false)
                }else {
                    getQuestionByFilter(currentPage,filter, false);
                }
                setCurrentPage(0);
            }


        }

       return ()=> {
            clearTimeout(timeOut);
        }
    }, [searchText])




  


    const getQuestionBank =  (page, isPush)=> {
       
         QuestionBankService.getQuestionBank({page: page, size: 12}).then(data=> {
            const newArray = isPush ?  [...questionBanks].concat(data.content) : data.content;
          setQuestionBanks(newArray)
          setTotalPage(data.totalPages)
            setLoading(false)
        }).catch(()=> {
            setLoading(false)

        });

    }


    useEffect(()=> {
        if(isFilter && department.length === 0) {
            getDepartment();      
        }      

    }, [isFilter])

    const getDepartment = async ()=> {
        const department = await DepartmentService.getDepartment();
        setDepartment(department.content);
    }


    const handleAdd = ()=> {
        setModal(<CreateQuestionBank addQ={addQ} />);
        showModal(true);
    }


    const addQ = (data)=> {
        QuestionBankService.addQuestionBank(data).then((dt)=> {
           setQuestionBanks([dt,...questionBanks])
            pushMessage({
                type: "SUCCESS",
                title: "Thành công",
                message: "Thêm câu hỏi thành công"
            })
            showModal(false);

        }).catch(()=> {
            pushMessage({
                type: "ERROR",
                title: "Thất bại",
                message: "Thêm câu hỏi thất bại"
            })
            showModal(false);

        })
    }

    const deleteQ = (id:any) => {

        QuestionBankService.deleteQuestion(id).then(()=> {
            const data = questionBanks.filter(item => item.id !== id);
    
            setQuestionBanks([...data]);
            showModal(false);
            pushMessage({
                type: "SUCCESS",
                title: "Thành công",
                message: "Xóa câu hỏi thành công"
            })

        }).catch(()=> {
            pushMessage({
                type: "ERROR",
                title: "Thất bại",
                message: "Xóa câu hỏi thất bại"
            })
        })

    }

    const handleFilterDepartment = (event:ChangeEvent<HTMLSelectElement>)=> {

        setFilter({
            ...filter,
            departmentId: +event.target.value,
            courseId: +event.target.value === -1 ? -1 : filter.courseId
        })

   

        const id = +event.target.value;
        const dt = department.find(depart => depart.id === id);
        setCourses(dt?.courses || []);


        filterFunction({
            ...filter,
            courseId:  +event.target.value === -1 ? -1 : filter.courseId,
            departmentId: id
        })
       

    }

    const editQ = (id:any, ques:QuestionBank) => {
        QuestionBankService.editQuestion(id, ques).then((dt)=> {
            const data = questionBanks;
            data.forEach((item, index)=> {
                if(item.id === id) {
                    data.splice(index, 1, ques)
                    return;
                }
            })
    
     
            setQuestionBanks([...data]);
            pushMessage({
                type: "SUCCESS",
                title: "Thành công",
                message: "Sửa câu hỏi thành công"
            })
            showModal(false);
            
        }).catch(()=> {
            pushMessage({
                type: "ERROR",
                title: "Thất bại",
                message: "Sửa câu hỏi thất bại"
            })
            showModal(false);
        })
       
    }

   useEffect(()=> {
   if(isInView) {
       if(currentPage < totalPage - 1) {
            setCurrentPage((current)=> current + 1);
       }
   }
   }, [isInView])


   const onChangeToSearch = (event:ChangeEvent<HTMLInputElement>)=> {
       setSearchText(event.target.value)
   }




    return (
        <div className="relative lg:h-auto sc1920:rounded-lg flex sc1920:p-6 overflow-hidden">
        <div className="w-[100%] py-[27px] border-[1px] sc1920:border-solid border-[#D4D4D4]  rounded-lg">
            <div className={clsx("flex  px-[27px]  justify-between items-center", {"mb-6": isFilter})}>
                <h1 className="uppercase text-primary_blue font-bold text-2xl">Ngân hàng câu hỏi</h1>

                {/* search */}
                <div className="flex items-center justify-between">
                    <div
                            className="flex items-center w-[85px] mr-3 h-10 justify-center rounded-md bg-btn_bg cursor-pointer"
                            onClick={handleAdd}
                        >
                        <span>
                            <AddCircle size="20" className="text-primary_blue" />
                        </span>
                        <span className="text-[15px] ml-1 text-primary_blue font-bold">Thêm</span>
                    </div>
                    <div className="relative flex grow items-center w-full sc1366:271px sc1920:w-[377px] h-10 group">
                        <svg
                            className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                        </svg>
                        <input
                            value={searchText || ""}
                            onChange={onChangeToSearch}
                            type="text"
                            className="ml-auto grow w-full h-10 py-1.5 pl-10 pr-4 leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 focus:bg-gray-100 ring-opacity-90 border-solid border-2"
                            placeholder="Tìm kiếm..."
                        />
                    </div>
                    <div
                            className="flex items-center ml-3 h-10 justify-center w-10 rounded-md bg-btn_bg cursor-pointer"
                            onClick={()=> setIsFilter(!isFilter)}
                        >
                         <img src="/img/filter.png" alt="filter" />
                    </div>
                   
                </div>
            </div>
            {
                isFilter ? (
                    <div className={clsx("pt-6  px-[27px] w-full flex justify-between", {"border-t-2 border-solid border-borderColor": isFilter} )}>
                            <div className="w-auto">
                                <span className="text-lg font-medium text-[#014F59] mb-[11px]">Chuyên Ngành:</span>
                                <div>
                                    <select
                                     onChange={handleFilterDepartment} 
                                    className="w-[300px]  text-base text-sub_text_color rounded-[10px] border-solid   focus:border-transparent focus:outline-none focus:ring-2  border-2 h-[50px] mr-4 border-gray-300 p-2">
                
                                    <option  value={-1}>Tất cả</option>
                                                {
                                                  department.length > 0 && department.map((dp, index)=>{
                                                        return (
                                                            <option key={index} value={dp.id}>{dp.department_name}</option>

                                                        )
                                                    })
                                                }
                                            
                                    </select>
                                </div>
                            </div>

                            <div className="w-auto">
                                <span className="text-lg font-medium text-[#014F59] mb-[11px]">Khóa học:</span>
                                <div>
                                    <select 
                                     onChange={(event:ChangeEvent<HTMLSelectElement>)=>{
                                        setFilter({
                                            ...filter,
                                            courseId: +event.target.value
                                        })
                                        filterFunction({
                                            ...filter,
                                            courseId: +event.target.value
                                        })
                                }} 
                                    className="w-[450px] text-base text-sub_text_color rounded-[10px] border-solid   focus:border-transparent focus:outline-none focus:ring-2  border-2 h-[50px] mr-4 border-gray-300 p-2">
        
                                    <option  value={-1}>Tất cả</option>
                                                {
                                                    courses.map((course, index)=> {
                                                        return (

                                                            <option key={index} value={course.id}>{course.courseName}</option>
                                                        )
                                                    })
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="w-auto">
                                <span className="text-lg font-medium text-[#014F59] mb-[11px]">Dạng câu hỏi:</span>
                                <div>
                                    <select
                                     onChange={(event:ChangeEvent<HTMLSelectElement>)=>{
                                        setFilter({
                                            ...filter,
                                            questionType: +event.target.value
                                        })

                                        filterFunction({
                                            ...filter,
                                            questionType: +event.target.value
                                        })
                                }} 
                                    className="w-[256px] text-base text-sub_text_color rounded-[10px] border-solid focus:border-transparent focus:outline-none focus:ring-2  border-2 h-[50px] border-gray-300 p-2">
                                        <option  value={-1}>Tất cả</option>
                                                <option value={0}>Trắc nghiệm</option>
                                                <option value={1}>Tự luận</option>
                                    </select>
                                </div>
                            </div>


                    </div>

                ): ""
            }

            <div className="w-[100%] px-[27px] mt-6 grid grid-cols-2 gap-5">

                {
                    questionBanks.map((item, index)=> {
                        return (
                             
                              <div key={index}  ref={questionBanks.length > 8 && questionBanks.length - 3 === index ? ref : null}>
                             <QuestionBankItem  deleteQ={deleteQ} editQ={editQ} question={item} index={index} />
                        </div>
                          )
                            
                        
                    })
                }
                {
                    isLoading ? (
                <div className="flex col-span-2 justify-center items-center w-[100%]">
                        <Loading/>
                </div>

                    ): ""
                }

            </div>

           
        </div>
    </div>
    )
}