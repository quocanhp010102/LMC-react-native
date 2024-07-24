import React from 'react'

type props = {
    urlVider: string
    setShowVideo: (ishow: boolean) => void
}
function ViewVideoComponent({ urlVider, setShowVideo }: props) {
    return (
        <div className="fixed z-[999] top-0 left-0 bottom-0 right-0 bg-[#000000] w-full h-full flex justify-center items-center">
            <div className="absolute top-5 right-7 p-2 hover:bg-gray-600">
                <img onClick={() => setShowVideo(false)} className="cursor-pointer w-7 h-7" src="img/clear_24px.png" />
            </div>
            {urlVider === null ? (
                <div className="min-h-[300px] h-auto min-w-[200px] max-h-[90%] max-w-[80%]">
                    không hiển thị được video !
                </div>
            ) : (
                <video className="min-h-[300px] h-auto min-w-[200px] max-h-[90%] max-w-[80%]" autoPlay={true} controls>
                    <source src={urlVider} type="video/mp4" />
                </video>
            )}
        </div>
    )
}

export default ViewVideoComponent
