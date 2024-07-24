import clsx from "clsx"
import { Question } from "../Teacher/QuestionsBank"
import { useEffect, useState, FormEvent, useContext } from 'react';
import { ChangeEvent } from 'react';
import { ContextModal } from "../../Context/ModalContext";
import { QuestionBank } from "../../types";
type Props = {
    question: QuestionBank
    addQ?: (data:QuestionBank) => void
    editQ?: (id:any, data:QuestionBank) => void
    type: "ADD" | "EDIT" | "VIEW"
}

export function FormAddQuestion ({question, addQ, editQ, type}:Props) {
    
    const [ques, setQues] = useState<QuestionBank>({
        questionName: "",
        answerBanks: [{
            answerName: "",
            answerStatus: 0,
        },
        {
            answerName: "",
            answerStatus: 0,
        },
        {
            answerName: "",
            answerStatus: 0,
        },
        {
            answerName: "",
            answerStatus: 0,
        }
    
    ]
    });

    const {showModal} = useContext(ContextModal)
console.log(question);
    useEffect(()=> {
        if(type === "ADD") {
            setQues({...question, answerBanks:[{
                answerName: "",
                answerStatus: 0,
            },
            {
                answerName: "",
                answerStatus: 0,
            },
            {
                answerName: "",
                answerStatus: 0,
            },
            {
                answerName: "",
                answerStatus: 0,
            }
        
        ]});
        }else {

            setQues({...ques,...question});
        }
    }, [question])


    const handleChangeAnswer = (event:ChangeEvent<HTMLInputElement>, index) => {
        const checked =event.target.checked;
        console.log(checked);
        const qa = ques.answerBanks;
        qa[index].answerStatus = checked ? 1: 0;
        qa.forEach((item, i)=> {
            if(i !== index) {
                item.answerStatus = 0
            }else {
                
            }
        })

        setQues({
            ...ques,
            answerBanks:qa
        })
    }

    const handleChangeAnswerQ = (event:ChangeEvent<HTMLInputElement>, index) => {
       const arr = ["A", "B", "C", "D"]
        const value = event.target.value;
        const qa = ques.answerBanks;
      
        qa[index].answerName = value;
       
   

        setQues({
            ...ques,
            answerBanks:qa
        })
    }


    const subMitForm = (event:FormEvent<HTMLFormElement>)=> {
            event.preventDefault();
            if(type === "ADD") {
                addQ(ques)
            }else {
                editQ(question.id, ques);
            }
    }


 
    return (   
        <div>
            <form onSubmit={subMitForm} className="h-[629px] w-[854px] rounded-[10px] p-[44px] bg-white flex flex-col justify-between">
                <h1 className="uppercase  text-[#014F59] font-bold text-[28px] mb-5 text-center">{type === "ADD" ? "Tạo câu hỏi trắc nghiệm" : type === "EDIT" ? "Sửa câu hỏi trắc nghiệm" : "Xem câu hỏi trắc nghiệm" } </h1>
        
                            <div>
                                <textarea
                                    placeholder="Nhập câu hỏi..."
                                    name="questionsName"
                                    className="w-full mb-[20px] h-[103px] border border-solid focus:border-transparent focus:outline-none focus:ring-2 border-[#D4D4D4] py-2 px-6 rounded-[10px] flex flex-row"
                                    onChange={(event) => {setQues({
                                        ...ques,
                                        questionName: event.target.value
                                    })}}
                                    readOnly={type === "VIEW"}
                                    value={ques?.questionName}
                                />
                                            {ques.answerBanks.map((value, idx) => {
                                                return (
                                                    <div className="flex justify-between items-center" key={idx}>
                                                        <input
                                                            placeholder={`Đáp án ${idx}`}
                                                            name={`answer_${idx}`}
                                                            required
                                                            readOnly={type === "VIEW"}
                                                            className="col-span-11 w-[727px] h-[50px] mb-[10px] border border-solid focus:border-transparent focus:outline-none focus:ring-2 border-[#D4D4D4] py-2 px-6 rounded-[10px]"
                                                            value={ques?.answerBanks[idx].answerName}
                                                            onChange={(event) => handleChangeAnswerQ(event, idx)}
                                                        />
                                                    <div>
                                                            <input  
                                                                type="radio"
                                                                hidden
                                                                required
                                                                readOnly={type === "VIEW"}
                                                                checked={+value.answerStatus === 0 ? false : true}
                                                                onChange={(event) => handleChangeAnswer(event, idx)}
                                                                name="post_now"
                                                                id={`Answer_${idx}`}
                                                            />
                                                            <label htmlFor={`Answer_${idx}`} className="label-radio"></label>
                    
        
                                                    </div>
                                                    </div>
                                                )
                                            })}  
        
                                </div>
                            
                            <div className="flex justify-end">
                                    <button type="reset" onClick={()=>showModal(false)} className="border-[1px] w-[180px] h-[50px] rounded-[10px] border-solid text-lg mr-2 border-light_blue bg-white text-text_light_blue">Hủy</button>
                               {type !== "VIEW" && <button type="submit" className="bg-light_blue w-[180px] h-[50px] rounded-[10px] text-white text-lg">Lưu</button>}      
                            </div>                      
        </form>
            

        </div>
    )
}