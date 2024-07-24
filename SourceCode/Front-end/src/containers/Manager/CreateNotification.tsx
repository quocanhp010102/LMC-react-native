import { useContext, useEffect, useState } from 'react'
import { ContextMessage } from '../../Context/ShowMessage'
import { ContextModal } from './../../Context/ModalContext'

type Props = {
    formDefaultValue?: any
    funcSubmit: (formValue: any) => void
}

const CreateNotification = (props: Props) => {
    const { formDefaultValue, funcSubmit } = props
    const { pushMessage } = useContext(ContextMessage)
    const { showModal } = useContext(ContextModal)
    const parseAuthorities = (authorities: any) => {
        let result = 'ALL'
        if (authorities.length == 1 && authorities[0].name == 'ROLE_STUDENT') {
            result = 'STUDENT'
        }
        if (authorities.length == 1 && authorities[0].name == 'ROLE_LECTURER') {
            result = 'LECTURER'
        }
        return result
    }

    const [submitForm, setSubmitForm] = useState<any>({
        notificationTitle: formDefaultValue ? formDefaultValue.notificationTitle : '',
        notificationContent: formDefaultValue ? formDefaultValue.notificationContent : '',
        authorities: formDefaultValue ? parseAuthorities(formDefaultValue.authorities) : 'ALL',
        notificationTimeEvent: formDefaultValue?.notificationTimeEvent ? formDefaultValue.notificationTimeEvent : null,
    })
    const [isShowDateInput, setShowDateInput] = useState<boolean>(
        formDefaultValue?.notificationTimeEvent ? true : false,
    )

    const changeSubmitForm = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setSubmitForm({ ...submitForm, [event.target.name]: event.target.value })
    }
    const handleShowDateInput = () => {
        setShowDateInput(!isShowDateInput)
    }
    const handleSubmitForm = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        if (submitForm.notificationTitle == '' || submitForm.notificationContent == '') {
            pushMessage({
                title: 'Thông báo',
                type: 'WARN',
                message: 'Chưa nhập đúng dữ liệu',
            })
        } else if (isShowDateInput) {
            const now = new Date()
            const nowDate = new Date(now).getTime()
            const dateCheck = new Date(submitForm.notificationTimeEvent).getTime()
            if (submitForm.notificationTimeEvent && dateCheck > nowDate) {
                funcSubmit(submitForm)
            } else {
                pushMessage({
                    title: 'Thông báo',
                    type: 'WARN',
                    message: 'Thời gian không được để trống hoặc nhỏ hơn ngày hiện tại',
                })
            }
        } else {
            funcSubmit(submitForm)
        }
    }

    return (
        <div className="sc1920:h-[660px] sc1536:w-[715px] sc1536:h-[660px] sc1366:w-[767px] sc1366:h-[700px] p-[36px] sc1920:w-[904px] bg-white rounded-[10px]">
            <div className="flex flex-col justify-around h-full">
                <div className="flex flex-col">
                    <label htmlFor="notificationTitle" className="text-[24px] font-medium mb-2">
                        Tiêu đề:
                    </label>
                    <input
                        type="text"
                        id="notificationTitle"
                        name="notificationTitle"
                        className="grow w-full h-[60px] py-1.5 px-2 leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2  text-black"
                        onChange={(event) => changeSubmitForm(event)}
                        value={submitForm.notificationTitle}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="notificationContent" className="text-[24px] font-medium mb-2">
                        Nội dung thông báo:
                    </label>

                    <textarea
                        className="w-full rounded py-1.5 px-2 focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border text-black"
                        rows={5}
                        id="notificationContent"
                        name="notificationContent"
                        onChange={(event) => {
                            changeSubmitForm(event)
                        }}
                        value={submitForm.notificationContent}
                    ></textarea>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="authorities" className="text-[24px] font-medium mb-2">
                        Đối tượng thông báo:
                    </label>
                    <select
                        id="authorities"
                        name="authorities"
                        className="text-[#636363] text-2xl h-[60px] font-normal  w-[404px] p-1.5  leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2"
                        onChange={(event) => changeSubmitForm(event)}
                        value={submitForm.authorities}
                    >
                        <option value={'ALL'}>All</option>
                        <option value={'STUDENT'}>Sinh viên</option>
                        <option value={'LECTURER'}>Giảng viên</option>
                    </select>
                </div>

                {!formDefaultValue && (
                    <div className="flex items-center">
                        <input
                            onChange={handleShowDateInput}
                            className="w-4 h-4 mr-2 mt-2 mb-2"
                            id="idCarlend"
                            type="checkbox"
                        />
                        <label htmlFor="idCarlend">gửi thông báo lịch</label>
                    </div>
                )}

                {(isShowDateInput || formDefaultValue?.notificationTimeEvent) && (
                    <div className="flex flex-col">
                        <label htmlFor="dateTime" className="text-[24px] font-medium mb-2">
                            {formDefaultValue ? 'Ngày của sự kiện' : 'Chọn thời gian:'}
                        </label>
                        <input
                            className="py-1.5 mb-5 w-2/5 px-2 focus:outline-none focus:ring-2 rounded border-solid border-2"
                            type="datetime-local"
                            id="dateTime"
                            name="notificationTimeEvent"
                            defaultValue={
                                formDefaultValue?.notificationTimeEvent
                                    ? formDefaultValue.notificationTimeEvent.slice(0, 16)
                                    : ''
                            }
                            onChange={(event) => changeSubmitForm(event)}
                        />
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        className="px-6 py-[14px] rounded-[10px] border-[1px] border-solid border-light_blue text-primary text-[18px] font-medium mx-3"
                        onClick={() => showModal(false)}
                    >
                        Huỷ
                    </button>
                    {!formDefaultValue?.notificationTimeEvent && (
                        <button
                            className="px-6 py-[14px] rounded-[10px] bg-light_blue text-[#fff] text-[18px] font-medium"
                            onClick={(event) => handleSubmitForm(event)}
                        >
                            Lưu thông báo
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreateNotification
