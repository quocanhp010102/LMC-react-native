// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import "./styles.css";s

// import required modules
import { Pagination, Navigation } from "swiper";
type questions = {
    id: number,
    department: string,
    questions: string
}

type Props = {
    questions: questions[],
    chosseQuestion: (id:any)=>void
}

export function TemplateEssayExam({questions, chosseQuestion}:Props) {

    return (
        <div className="w-[1200px] h-[700px] bg-white">
            <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
            clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mt-auto h-full"
      >
          {
              questions.map((que, index)=> {
                return (
            <SwiperSlide className="flex flex-col items-center overflow-y-auto px-[90px]" key={index}>
                <div className="">
                    <h2 className="text-4xl font-bold text-primary_blue text-center p-[20px] break-words">{que.department}</h2>
                    <div className="" dangerouslySetInnerHTML={{__html: que.questions}}>
                           
                    </div>   
                </div> 
                <button onClick={()=>{
                    console.log(que.id)
                    chosseQuestion(que.id)
                    
                    }} className="cursor-pointer relative z-50 bottom-7 self-end w-[100px] h-[40px] mt-6 border-2 rounded-lg mb-3 border-[#000] border-solid">Chọn</button>
            </SwiperSlide>

                )
              })
          }
      </Swiper>
        </div>  

    )

}