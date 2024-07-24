import { __Date } from '../../types'

type Props = {}

const CreateQuiz = (props: Props) => {
    return (
        <>
            <div className="flex-row flex grow">
                <div className="quiz flex flex-col">
                    <div className="border-solid border-2 border-gray-300 rounded-lg m-10">
                        <h1 className="uppercase font-bold text-4xl text-green-700 p-6 will-change-contents">
                            Giáo dục công dân cuối khoá. Khoá 60 - Khối 2
                        </h1>
                        <p className="p-6 text-gray-600">Link/link</p>
                    </div>
                    <div className="text-green-700 text-2xl px-16">Tạo bài thi trắc nghiệm</div>
                    <div className="rounded-lg border-solid border-2 p-6 m-10 border-gray-300">
                        <form>
                            <label className="text-lg">Tên bài thi</label>
                            <br />
                            <input
                                type="text"
                                id="quiz-name"
                                name="quiz-name"
                                className="rounded-md border-solid border-2 my-2 h-12 border-gray-300 w-full p-2"
                            />
                            <div className="flex flex-row">
                                <div className="w-2/4">
                                    <div className="flex flex-col">
                                        <label className="text-lg">Thời gian mở làm bài</label>
                                        <div className="flex flex-row">
                                            <input
                                                type="datetime-local"
                                                className="rounded-md border-solid border-2 my-2 h-12 border-gray-300 w-full p-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-2/4">
                                    <div className="flex flex-col ml-6">
                                        <label className="text-lg">Giới hạn thời gian mở làm bài</label>
                                        <input
                                            type="text"
                                            id="quiz-name"
                                            name="quiz-name"
                                            className="rounded-md border-solid border-2 my-2 h-12 border-gray-300 w-full p-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateQuiz
