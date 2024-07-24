import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { ContextMessage } from '../../Context/ShowMessage'
import { NewsService } from '../../services/NewsService'
import { UploadService } from '../../services/UploadService'
import { UserManualService } from '../../services/UserManualService'
import DialogActionSuccess from '../common/DialogActionSuccess'
import { tutorialType } from '../TypeProps/TutorialProps'
import { ContextModal } from './../../Context/ModalContext'

type Props = {
    pushTutorial?: (data: any) => void
    itemUpdate?: tutorialType
}

function CreateUserManual({ pushTutorial, itemUpdate }: Props) {
    const [file, setFiles] = useState<File | null>(null)
    const [imageFile, setImageFiles] = useState<File | null>(null)
    const [name, setNameFiles] = useState<string | null>(null)
    const [urlAvatar, setUrlAvatar] = useState<string | null>(null)
    const { pushMessage } = useContext(ContextMessage)
    const [valueForm, setValueForm] = useState<tutorialType>({
        tutorial_title: '',
        tutorial_video: '',
        tutorial_image: '',
        id: 0,
        tutorial_isDisplay: '',
        tutorial_createdDate: '',
        authorities: [{ name: 'ROLE_STUDENT' }, { name: 'ROLE_LECTURER' }],
    })

    const { setModal, showModal } = useContext(ContextModal)
    console.log(itemUpdate)

    const returnSelectValue = () => {
        let selectValue
        if (valueForm) {
            if (valueForm.authorities.length > 1 || valueForm.authorities.length == 0) {
                selectValue = 'ALL'
            } else {
                const value = valueForm.authorities[0].name
                selectValue = value
            }
        }
        return selectValue
    }
    // xử lí input
    const handleChangeInput = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        event.preventDefault()
        const name = event.target.name
        const value = event.target.value
        const type = event.target.type
        if (type === 'select-one') {
            if (value != 'ALL') {
                const valueSel = [{ name: value }]
                setValueForm({
                    ...valueForm,
                    authorities: valueSel,
                })
            } else {
                setValueForm({
                    ...valueForm,
                    authorities: [{ name: 'ROLE_STUDENT' }, { name: 'ROLE_LECTURER' }],
                })
            }
        } else {
            setValueForm({
                ...valueForm,
                [name]: value,
            })
        }
    }

    // chọn file bài hướng dẫn

    const hanldeChangeFile = (events: ChangeEvent<HTMLInputElement>) => {
        const file: File = events.target.files![0]

        if (file.type.match('video/*')) {
            setNameFiles(file.name)
            setFiles(file)
        }
    }

    const hanldeChangeImageFile = (events: ChangeEvent<HTMLInputElement>) => {
        const file: File = events.target.files![0]
        if (file.type.match('image/*')) {
            setUrlAvatar(URL.createObjectURL(file))
            setImageFiles(file)
        }
    }
    // xóa file hướng dẫn đã chọn

    const deleteFileName = () => {
        setFiles(null)
        setNameFiles(null)
    }

    // submit tạo hướng dẫn
    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (file && imageFile && valueForm.tutorial_title != '') {
            const formdata = new FormData()
            formdata.append('files', file)
            formdata.append('files', imageFile)
            const urlVideo = await UploadService.uploadMultiFile(formdata)
            if (urlVideo) {
                const { id, tutorial_isDisplay, ...result } = valueForm
                const data = {
                    ...result,
                    tutorial_createdDate: new Date(),
                    tutorial_video: urlVideo[0],
                    tutorial_image: urlVideo[1],
                }
                const TutorialProgress = await UserManualService.postTutorial(data)
                pushMessage({
                    title: 'Thành Công',
                    type: 'SUCCESS',
                    message: 'Thêm hướng dẫn thành công!',
                })
                NewsService.postNewToHistory({
                    method: 'POST',
                    name: TutorialProgress.tutorial_title,
                })
                pushTutorial(TutorialProgress)
            } else {
                pushMessage({
                    title: 'Thất bại',
                    type: 'ERROR',
                    message: 'không thể thêm hướng dẫn!',
                })
            }
        } else {
            pushMessage({
                title: 'Thông báo',
                type: 'ERROR',
                message: 'thông tin chưa hợp lệ!',
            })
            return
        }
    }

    const handleUpdate = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (itemUpdate && valueForm.tutorial_title != '') {
            let newValueForm = valueForm
            if (valueForm.authorities.length == 0) {
                newValueForm.authorities = [{ name: 'ROLE_STUDENT' }, { name: 'ROLE_LECTURER' }]
            }
            if (imageFile) {
                const formdata = new FormData()
                formdata.append('file', imageFile)
                const urlVideo = await UploadService.uploadFile(formdata)
                if (urlVideo) {
                    newValueForm.tutorial_image = urlVideo
                }
            }
            const isCheck =
                imageFile ||
                itemUpdate.tutorial_title != newValueForm.tutorial_title ||
                itemUpdate.authorities.length != newValueForm.authorities.length
                    ? true
                    : false
            if (isCheck) {
                const updated = await UserManualService.putTutorialById(itemUpdate.id, newValueForm)
                if (updated) {
                    pushMessage({
                        title: 'Thành Công',
                        type: 'SUCCESS',
                        message: 'Cập nhật thành công!',
                    })
                    NewsService.postNewToHistory({
                        method: 'PUT',
                        name: updated.tutorial_title,
                    })
                }
                pushTutorial(updated)
            } else {
                pushMessage({
                    title: 'Cảnh báo',
                    type: 'WARN',
                    message: 'Không có gì thay đổi!',
                })
            }

            showModal(false)
        }
    }

    useEffect(() => {
        if (itemUpdate) {
            setValueForm(itemUpdate)
        }
    }, [])

    return (
        <div className="sc1920:h-[1014px] sc1366:h-[750px] sc1536:h-[800px] p-[41px] w-[904px] bg-white rounded-3xl">
            <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col">
                    <label htmlFor="title" className="text-lg font-medium mb-2">
                        Tiêu đề:
                    </label>
                    <input
                        name="tutorial_title"
                        onChange={(event) => handleChangeInput(event)}
                        type="text"
                        id="title"
                        value={valueForm.tutorial_title}
                        className="ml-auto grow w-full h-[60px] py-1.5  leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2  text-black"
                    />
                </div>

                {itemUpdate ? null : (
                    <div className="flex flex-col">
                        <label htmlFor="file" className="text-lg font-medium mb-2">
                            Tải lên video hướng dẫn:
                        </label>
                        <div
                            className="rounded-[10px] h-[127px]  border-[1px]  p-3 border-solid border-borderColor"
                            style={{
                                background: 'rgba(99, 99, 99, 0.1)',
                            }}
                        >
                            <div className="flex items-center h-full justify-center">
                                <label className="text-[40px] flex text-primary font-medium" htmlFor="upload_file">
                                    <img src="\img\PathUpload.png" alt="123" className="mr-[36px] " />
                                    Tải Lên
                                    <input
                                        type="file"
                                        required
                                        onChange={hanldeChangeFile}
                                        accept={'video/*'}
                                        hidden
                                        id="upload_file"
                                    />
                                </label>
                                {/* <label
                                htmlFor="upload_file"
                                className="rounded-lg p-3 border-[1px] border-solid w-[120px] border-borderColor text-lg   text-[#636363] flex items-center justify-center"
                            >
                                <img src="\img\upload.png" alt="upload file" /> <span className="ml-1">Tải lên</span>
                               
                            </label> */}
                                {/* <p className="ml-4">Tải lên định dạng jpg,png, ... ( Tối đa ....mb)</p> */}
                                {name ? (
                                    <div className="p-2 max-w-[350px] ml-4 mt-2 max-h-[43px] flex justify-between items-center">
                                        <p className="">{name.length <= 30 ? name : name.slice(0, 27) + '...'}</p>{' '}
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                    // </div>
                )}
                <div className="grid mt-6 mb-5">
                    <div className="flex flex-col">
                        <label htmlFor="file" className="text-lg font-medium mb-2">
                            Tải lên ảnh cho hướng dẫn:
                        </label>
                        <div className="grid grid-cols-2 rounded-[10px]  border-[1px]  p-3 border-solid border-borderColor">
                            <div className="flex flex-col">
                                <p>Tải lên ảnh định dạng PNG, JPEG. ( Tối đa ....mb)</p>
                                <label
                                    htmlFor="upload_image_file"
                                    className="my-auto rounded-lg p-3 border-[1px] border-solid w-[120px] border-borderColor text-lg   text-[#636363] flex items-center justify-center"
                                >
                                    <img src="\img\PathUpload.png" className="w-[20px] h-[20px]" alt="upload file" />{' '}
                                    <span className="ml-1 text-primary">Tải lên</span>
                                    <input
                                        type="file"
                                        onChange={hanldeChangeImageFile}
                                        accept={'image/*'}
                                        hidden
                                        id="upload_image_file"
                                    />
                                </label>
                            </div>
                            <div className="">
                                <p>Xem trước ảnh tải lên:</p>

                                <div className="w-[250px] h-[141px] flex items-center justify-center rounded-lg bg-[#E0E0E0]">
                                    <img
                                        className="max-w-full max-h-full object-contain"
                                        // src={urlAvatar ? urlAvatar : ''}
                                        src={
                                            itemUpdate
                                                ? urlAvatar
                                                    ? urlAvatar
                                                    : itemUpdate.tutorial_image
                                                : urlAvatar
                                                ? urlAvatar
                                                : ''
                                        }
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="title" className="text-lg font-medium mb-2">
                        Đối tượng hướng dẫn:
                    </label>
                    <select
                        name="authorities"
                        onChange={(event) => handleChangeInput(event)}
                        value={valueForm ? returnSelectValue() : 'All'}
                        className="text-[#636363] text-2xl h-[60px] font-normal  w-[404px] p-1.5  leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2"
                    >
                        <option value="ALL">Tất cả</option>
                        <option value="ROLE_STUDENT">Sinh viên</option>
                        <option value="ROLE_LECTURER">Giảng viên</option>
                    </select>
                </div>

                <div className="flex justify-end">
                    <button
                        className="px-6 py-[14px] rounded-[10px] border-[1px] border-solid border-color63 text-primary text-lg font-medium mx-3"
                        onClick={() => showModal(false)}
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={itemUpdate ? (event) => handleUpdate(event) : (event) => handleSubmit(event)}
                        className="px-6 py-[14px] rounded-[10px] bg-light_blue text-white text-lg font-medium"
                    >
                        {itemUpdate ? 'Lưu thay đổi' : 'Tạo HDSD'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateUserManual
