import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { NotifycationService } from '../services/NotifycationService'
import { NotifyType } from '../types/NotifyType'
import { fomatDate } from '../containers/fomartDate'
import { type } from 'os'
import InfiniteScroll from 'react-infinite-scroll-component'

type propsNotifycation = {
    handleSetNotifyListProps: (a: null) => void
    notifycationPush: NotifyType
    handleClickNotify?: (notify: NotifyType) => void
}
function Notifycation({ notifycationPush, handleSetNotifyListProps, handleClickNotify }: propsNotifycation) {
    const [isRead, setRead] = useState(true)
    const [isLoad, setIsload] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState<number>(0)
    const [notifyList, setNotifyList] = useState<NotifyType[]>([])
    const [idNotify, setIdnNotify] = useState<number | null>(-1)
    const [totalPageNumber, setTotalPageNumber] = useState<number | null>(null)
    const [totalElement, setTotalElement] = useState<number | null>(null)
    const classActive = ` text-[#ffffff] font-bold bg-primary_blue`
    const classtUnActive = ` bg-[#C4C4C4] text-stone-400`
    const handleChangeRead = () => {
        if (!isRead) {
            setRead(true)
            setHasMore(true)
            setNotifyList([])
            setPage(0)
        }
    }
    const handleChangeUnRead = () => {
        if (isRead) {
            setHasMore(true)
            setRead(false)
            setNotifyList([])
            setPage(0)
        }
    }
    const handleClickPutNotify = async (notify: NotifyType) => {
        const status = notify.notificationStatus
        if (notify.id === idNotify) {
            setIdnNotify(null)
        } else {
            setIdnNotify(notify.id)
        }

        if (status == 0) {
            const newNotifyPut = { ...notify }
            newNotifyPut.notificationStatus = '1'

            const puted = await NotifycationService.putNotifycation(notify.id, newNotifyPut)
            const newState = notifyList.map((item) => {
                if (item.id === newNotifyPut.id) {
                    item = newNotifyPut
                }
                return item
            })
            setNotifyList(newState)
            handleClickNotify(newNotifyPut)
        }
    }
    const callNotifycation = async (page?: Number, size?: Number) => {
        setIsload(true)
        const result = await NotifycationService.getNotifycation(page, size)
        if (result) {
            const { totalPages, content, pageable, totalElements, size } = result
            setNotifyList([...notifyList, ...content])
            setTotalPageNumber(totalPages)
            setTotalElement(totalElements)
            setIsload(false)
        }
    }
    const callNotifycationUnRead = async (page?: Number, size?: Number) => {
        setIsload(true)
        const result = await NotifycationService.getNotifycationunRead(page, size)
        if (result) {
            const { totalPages, content, pageable, totalElements, size } = result
            setNotifyList([...notifyList, ...content])
            setTotalPageNumber(totalPages)
            setTotalElement(totalElements)
            setIsload(false)
        }
    }
    const handleScrolling = () => {
        if (notifyList.length >= totalElement) {
            setHasMore(false)
        } else {
            setPage((prevState) => {
                if (prevState < totalPageNumber - 1) {
                    return prevState + 1
                } else {
                    return prevState
                }
            })
        }
    }

    useEffect(() => {
        if (notifycationPush) {
            if (notifyList.length == 0 || notifyList.length >= totalElement) {
                setNotifyList([notifycationPush, ...notifyList])
                setTotalElement((prevState) => prevState + 1)
                handleSetNotifyListProps(null)
            } else {
                const newState = notifyList
                newState.pop()
                setNotifyList([notifycationPush, ...newState])
                setTotalElement((prevState) => prevState + 1)
                handleSetNotifyListProps(null)
            }
        }
    }, [notifycationPush])
    useEffect(() => {
        if (isRead) {
            callNotifycation(page, 20)
        } else {
            callNotifycationUnRead(page, 20)
        }
    }, [page, isRead])

    return (
        <div
            className={`bg-[#FBFBFB] pt-5 pl-7 pb-9 pr-9 h-[894px] w-[506px] right-0 z-[9999] border-l-2  border-b-2 border-solid border-[#D4D4D4]`}
        >
            <div className="h-1/6">
                <h4 className="text-4xl font-bold text-left mb-4">Thông báo</h4>
                <div>
                    <button
                        className={'text-lg rounded-lg mr-0 px-10 py-1' + (isRead ? classActive : classtUnActive)}
                        onClick={handleChangeRead}
                    >
                        Tất cả
                    </button>

                    <button
                        className={'text-lg rounded-lg px-10 py-1 ' + (!isRead ? classActive : classtUnActive)}
                        onClick={handleChangeUnRead}
                    >
                        Chưa đọc
                    </button>
                </div>
                <p className="text-2xl  text-[#3C3C3C] mt-5">Hôm nay</p>
            </div>

            {/* {!isRead ? (
                <div className="over-hidden overflow-y-scroll h-5/6 w-full scroll-smooth mt-3">
                    {notifyList.map((notify, index) => {
                        return (
                            <div key={index} className={notify.id === idNotify ? 'mb-6 bg-[#f5f5f5]' : 'mb-6'}>
                                <div
                                    onClick={() => handleClickPutNotify(notify)}
                                    className="flex items-center justify-start cursor-pointer"
                                >
                                    {notify?.receiverImg ? (
                                        <img className="w-[80px] mr-[20px] p-[10px]" src={notify?.receiverImg} />
                                    ) : (
                                        <img className="w-[80px] mr-4" src="/img/persionNotifycation.png" />
                                    )}
                                    <div className="w-[70%]">
                                        <p className="text-lg text-[#636363] mb-[10px] text-justify font-medium">
                                            {notify.notificationTitle ? notify.notificationTitle : 'thông báo'}
                                        </p>
                                        <p className="text-xs text-left font-light">
                                            {fomatDate(notify.notificationTime)}
                                        </p>
                                    </div>

                                    {notify?.notificationStatus == 0 ? (
                                        <div>
                                            <div className="w-3 h-3 bg-light_blue rounded-full"></div>
                                        </div>
                                    ) : undefined}
                                </div>
                                {idNotify && idNotify === notify.id && (
                                    <div className="w-full px-5 py-1">
                                        <p>{notify.notificationContent}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : ( */}

            {notifyList.length > 0 ? (
                <div className="over-hidden overflow-y-scroll h-5/6 w-full scroll-smooth mt-3">
                    <InfiniteScroll
                        className="over-hidden"
                        dataLength={notifyList.length}
                        next={handleScrolling}
                        hasMore={hasMore}
                        loader={
                            <div className="w-full h-auto min-h-[50px] flex justify-center items-center bg-transparen">
                                <LoadingOutlined style={{ fontSize: 24 }} spin />
                            </div>
                        }
                        height={690}
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>Hiển thị tất cả các bản ghi!</b>
                            </p>
                        }
                    >
                        {notifyList.length > 0 &&
                            notifyList.map((notify, index) => {
                                return (
                                    <div key={index} className={notify.id === idNotify ? 'mb-6 bg-[#f5f5f5]' : 'mb-6'}>
                                        <div
                                            onClick={() => handleClickPutNotify(notify)}
                                            className="flex items-center justify-start cursor-pointer"
                                        >
                                            {notify?.receiverImg ? (
                                                <img
                                                    className="w-[80px] mr-[20px] p-[10px]"
                                                    src={notify?.receiverImg}
                                                />
                                            ) : (
                                                <img className="w-[80px] mr-4" src="/img/persionNotifycation.png" />
                                            )}
                                            <div className="w-[70%]">
                                                <p className="text-lg text-[#636363] mb-[10px] text-left font-medium">
                                                    {notify.notificationTitle ? notify.notificationTitle : 'thông báo'}
                                                </p>
                                                <p className="text-xs text-left font-light">
                                                    {fomatDate(notify.notificationTime)}
                                                </p>
                                            </div>

                                            {notify?.notificationStatus == 0 ? (
                                                <div>
                                                    <div className="w-3 h-3 bg-light_blue rounded-full"></div>
                                                </div>
                                            ) : undefined}
                                        </div>
                                        {idNotify && idNotify === notify.id && (
                                            <div className="w-full px-5 py-1">
                                                <p>{notify.notificationContent}</p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                    </InfiniteScroll>
                </div>
            ) : (
                <div className="h-full w-full flex justify-center items-center">
                    <span className="mr-2 text-base text-[black]">KHÔNG CÓ THÔNG BÁO NÀO!</span>
                    <LoadingOutlined style={{ fontSize: 24 }} spin />
                </div>
            )}

            {/* )} */}
        </div>
    )
}

export default Notifycation
