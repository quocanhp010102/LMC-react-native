import { FormEvent, useContext, useEffect, ChangeEvent } from 'react';
import { Question } from '../Teacher/QuestionsBank';
import { useState } from 'react';
import { ContextModal } from '../../Context/ModalContext';
import { QuestionBank } from '../../types';

type Props = {
    editQ?: (id, ques:QuestionBank)=>void,
    question?: QuestionBank,
    type: "EDIT" | "ADD" | "VIEW"
    addQ?: (data:QuestionBank)=>void
}


export function FormAddEssayQuestion ({editQ, question, type, addQ}:Props) {
    const [ques, setQues] = useState<QuestionBank>({
        questionName: "",
        answerBanks: [{
            answerName: "",
            answerStatus: 1,
        }]
    });
    const {showModal} = useContext(ContextModal)
  

    useEffect(()=> {
        if(question) {
            if(type === "ADD") {
                setQues({
                    ...question,
                    answerBanks: [{
                        answerName: "",
                        answerStatus: 1,
                    }]
                })
            }else {
                setQues(question)

            }
         
        }
    }, [question])

    const subMitForm = (event:FormEvent<HTMLFormElement>)=> {
        event.preventDefault();
        if(type === "EDIT") {
            editQ(question.id, ques);
        }else {
            addQ(ques);
        }

    }

    return (<div className="w-[854px] h-[629px] p-[44px] bg-white rounded-[10px]">
                    <form className="w-full h-full flex flex-col justify-between" onSubmit={subMitForm}>
                        <h1 className="uppercase text-[28px] text-primary_blue font-bold text-center">{type === "ADD" ? "Tạo câu hỏi Tự luận" : type === "EDIT" ? "Sửa câu hỏi tự luận" : "Xem câu hỏi tự luận" } </h1>
                                <div className="flex flex-col">
                                        <label className="text-lg text-color63 font-medium mb-[14px]">Tiêu đề câu hỏi: </label>
                                        <textarea 
                                           readOnly={type === "VIEW"}
                                        onChange={(event:ChangeEvent<HTMLTextAreaElement>)=> {
                                            setQues({
                                                ...ques,
                                               questionName: event.currentTarget.value
                                            })
                                        }} 
                                        required value={ques?.questionName} className="h-[85px] rounded-md  focus:border-transparent focus:outline-none focus:ring-2 border-[1px] border-solid border-borderColor">

                                        </textarea>
                                </div>

                                <div className="flex flex-col">
                                        <label className="text-lg text-color63 font-medium mb-[14px]">Đáp án: </label>
                                        <textarea
                                         required  
                                         readOnly={type === "VIEW"}
                                         onChange={(event:ChangeEvent<HTMLTextAreaElement>)=> {
                                            setQues({
                                                ...ques,
                                                answerBanks: [
                                                    {
                                                        answerName: event.target.value,
                                                        answerStatus: 1
                                                    }
                                                ]
                                            })
                                        }}
                                        value={ques?.answerBanks[0].answerName} 
                                        className="h-[213px] rounded-md focus:border-transparent focus:outline-none focus:ring-2 border-[1px] border-solid border-borderColor">

                                        </textarea>
                                </div>

                                <div className="flex justify-end">
                                    <button type='reset' onClick={()=>showModal(false)} className="border-[1px] w-[180px] h-[50px] rounded-[10px] border-solid text-lg mr-2 border-light_blue bg-white text-text_light_blue">Hủy</button>
                                   
                                   {type !== 'VIEW' && <button type='submit' className="bg-light_blue w-[180px] h-[50px] rounded-[10px] text-white text-lg">Lưu</button>} 
                                </div> 

                    </form>
             </div>)
}