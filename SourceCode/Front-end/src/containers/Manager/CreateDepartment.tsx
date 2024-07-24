import React, { ChangeEvent, useContext, useState } from 'react'
import { ContextMessage } from '../../Context/ShowMessage'
import { DepartmentService } from '../../services/DepartmentService'
import { NewsService } from '../../services/NewsService'
import { UploadService } from '../../services/UploadService'
import { Department, stateType } from '../../types'
import { ContextModal } from './../../Context/ModalContext'

type Props = {
    update?: (data: any) => void
    itemUpdate?: stateType
    called: () => void
    push?: (data: any) => void
}

function CreateDepartment({ called, push, itemUpdate, update }: Props) {
    const [file, setFiles] = useState<File | null>(null)
    const [name, setNameFiles] = useState<string | null>(null)
    const { pushMessage } = useContext(ContextMessage)
    const [formValue, setSearchValue] = useState({
        nameDeparment: itemUpdate ? itemUpdate.department_name : '',
        type: itemUpdate ? itemUpdate.department_type : '0',
    })

    const { showModal } = useContext(ContextModal)

    const handleChangeFile = (events: ChangeEvent<HTMLInputElement>) => {
        const file: File = events.target.files![0]

        if (file.type.match('image/*')) {
            setNameFiles(file.name)
            setFiles(file)
        } else {
        }
    }

    const deleteFileName = () => {
        setFiles(null)
        setNameFiles(null)
    }

    const handleChangeSearch = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        event.preventDefault()
        const name = event.target.name
        const value = event.target.value
        setSearchValue({
            ...formValue,
            [name]: value,
        })
    }
    // handle submit
    const SubmitCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (!itemUpdate) {
            if (formValue.nameDeparment === '' || file === null) {
                return pushMessage({
                    title: 'Có lỗi',
                    type: 'ERROR',
                    message: 'Chưa nhập đầy đủ thông tin !',
                })
            } else {
                const resutl = async (isput?: boolean) => {
                    let formData = new FormData()
                    formData.append('file', file)
                    const url = await UploadService.uploadFile(formData)
                    if (url) {
                        const data = {
                            department_name: formValue.nameDeparment,
                            department_type: formValue.type,
                            department_image: url,
                        }
                        const result = await DepartmentService.postDeparment(data)

                        // set lại các state về mặc định
                        if (result) {
                            push(result)

                            pushMessage({
                                title: 'Thành Công',
                                type: 'SUCCESS',
                                message: 'Thêm chuyên ngành thành công !',
                            })
                            setFiles(null)
                            setSearchValue({
                                nameDeparment: '',
                                type: '1',
                            })
                            setNameFiles(null)
                            showModal(false)
                            called()
                            NewsService.postNewToHistory({
                                method: 'POST',
                                name: result.department_name,
                            })
                            return result
                        }
                    } else {
                        pushMessage({
                            title: 'không gửi được ảnh',
                            type: 'ERROR',
                            message: 'Thêm chuyên ngành thất bại !',
                        })
                        return
                    }
                }
                resutl()
            }
        } else {
            let data: Department
            if (file) {
                let formData = new FormData()
                formData.append('file', file)
                const url = await UploadService.uploadFile(formData)
                if (url) {
                    data = {
                        id: itemUpdate.id,
                        department_name: formValue.nameDeparment,
                        department_type: formValue.type,
                        department_image: url,
                    }
                }
            } else {
                data = {
                    id: itemUpdate.id,
                    department_image: itemUpdate.department_image,
                    department_name: formValue.nameDeparment,
                    department_type: formValue.type,
                }
            }

            const isCheck =
                data.department_image != itemUpdate.department_image ||
                data.department_name != itemUpdate.department_name ||
                data.department_type != itemUpdate.department_type
                    ? true
                    : false
            if (isCheck) {
                const result = await DepartmentService.putDepartment(data, itemUpdate.id)
                if (result) {
                    update(result)
                    pushMessage({
                        title: 'Thành Công',
                        type: 'SUCCESS',
                        message: 'Sửa chuyên ngành thành công !',
                    })
                    NewsService.postNewToHistory({
                        method: 'PUT',
                        name: result.department_name,
                    })
                    setFiles(null)
                    setSearchValue({
                        nameDeparment: '',
                        type: '1',
                    })
                    setNameFiles(null)
                    called()
                }
            } else {
                pushMessage({
                    title: 'Cảnh báo',
                    type: 'WARN',
                    message: 'Không có gì thay đổi !',
                })
            }
            showModal(false)
        }
    }

    return (
        <div className="h-[700px] p-[34px] sc1366:w-[767px] sc1536:w-[767px] sc1920:w-[1080px] bg-white rounded-3xl">
            <h1 className="text-[36px] text-primary_blue text-center font-bold">
                {' '}
                {itemUpdate ? 'SỬA CHUYÊN NGÀNH ĐÀO TẠO' : 'TẠO MỚI NGÀNH ĐÀO TẠO'}
            </h1>
            <div className="flex flex-col justify-around h-full">
                <div className="flex flex-col">
                    <label htmlFor="title" className="text-lg font-medium mb-2">
                        Tên chuyên ngành:
                    </label>
                    <input
                        value={formValue.nameDeparment}
                        name="nameDeparment"
                        onChange={(event) => handleChangeSearch(event)}
                        type="text"
                        required
                        id="title"
                        className="ml-auto grow w-full h-[60px] py-1.5  leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2  text-black"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="title" className="text-lg font-medium mb-2">
                        Chương trình đào tạo:
                    </label>

                    <select
                        name="type"
                        value={formValue.type}
                        onChange={(event) => handleChangeSearch(event)}
                        className="text-color63 text-2xl h-[60px] font-normal  w-[404px] p-1.5  leading-normal rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 border-solid border-2"
                    >
                        <option value="0">Cơ bản</option>
                        <option value="1">Nâng cao</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="file" className="text-lg font-medium mb-2">
                        Tải lên hình ảnh:
                    </label>
                    <div
                        className="rounded-[10px] h-[127px]  border-[1px]  p-3 border-solid border-[#D0D0D0]"
                        style={{
                            background: 'rgba(99, 99, 99, 0.1)',
                        }}
                    >
                        <div className="flex items-center h-full justify-center">
                            <label className="text-[40px] flex text-primary font-medium" htmlFor="upload_file">
                                <img src="/img/PathUpload.png" alt="123" className="mr-[36px]" />
                                Tải Lên
                                <input
                                    type="file"
                                    required
                                    onChange={handleChangeFile}
                                    accept={'image/*'}
                                    hidden
                                    id="upload_file"
                                />
                            </label>
                            {/* <label
                                htmlFor="upload_file"
                                className="rounded-lg p-3 border-[1px] border-solid w-[120px] border-[#D0D0D0] text-lg   text-color63 flex items-center justify-center"
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

                <div className="flex justify-end">
                    <button
                        className="px-6 py-[14px] rounded-[10px] border-[1px] border-solid border-text_light_blue text-primary text-lg font-medium mx-3"
                        onClick={() => showModal(false)}
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={(event) => SubmitCreate(event)}
                        className="px-6 py-[14px] rounded-[10px] bg-text_light_blue text-[#fff] text-lg font-medium"
                    >
                        {itemUpdate ? 'Sửa chuyên ngành' : 'Lưu chuyên ngành mới'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateDepartment
