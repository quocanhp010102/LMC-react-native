import React from 'react'

type props = {
    title?: string
    subtitleEng?: string
}
const Title = ({ title, subtitleEng }: props) => {
    return (
        <div>
            <p className="text-center text-[#373737] sc1920:text-[48px] sc1536:text-[40px] sc1366:text-[36px] font-bold ">{title}</p>
            {subtitleEng && (
                <p className="text-center text-[#373737] sc1920:text-[32px] sc1536:text-[24px] sc1366:text-[20px] my-5">
                    {subtitleEng}
                </p>
            )}

            <div className="home__body-item-line flex justify-center mt-3 m-auto">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default Title
