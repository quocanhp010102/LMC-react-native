import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import clsx from 'clsx'

type Props = {
    total: number
    currenPage: any
    setCurrentPage: (page: React.Dispatch<any>) => void
}

function Paging({ total, currenPage, setCurrentPage }: Props) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    let location = useLocation()
    const pathName = location.pathname
    const search = pathName.indexOf('/search')
    const queryStringSearch = location.search
    const indexEqual = queryStringSearch.indexOf('=')
    const indexAnd = queryStringSearch.indexOf('&')
    const queryString =
        indexAnd != -1 ? queryStringSearch.slice(indexEqual + 1, indexAnd) : queryStringSearch.slice(indexEqual + 1)

    let queryPage = '?'
    if (search != -1) {
        queryPage = `?search=${queryString}&`
    }
    const [pages, setPages] = useState<number[]>(() => {
        const newArr = []
        for (let i = 1; i <= total; ++i) {
            newArr.push(i)
        }
        return newArr
    })

    useEffect(() => {
        setPages(() => {
            const newArr = []
            for (let i = 1; i <= total; ++i) {
                newArr.push(i)
            }
            return newArr
        })
    }, [total])
    const renderPading = () => {
        const arr = [1, 2, 3, 4, 5, +currenPage - 1, +currenPage, +currenPage + 1, pages.length]
        let xhtml: any = null
        xhtml = pages.map((page, index) => {
            const isCheck = arr.includes(page)
            return isCheck ? (
                <Link
                    to={`${queryPage}page=${page}`}
                    key={index}
                    className={clsx('mx-6 text-inherit', {
                        activeLink: +page === +currenPage,
                    })}
                >
                    {page}
                </Link>
            ) : page === +currenPage - 2 ? (
                <Link to={`${queryPage}page=${page}`} key={index} className="mx-6 text-inherit">
                    ...
                </Link>
            ) : page === +currenPage + 2 && page !== 6 ? (
                <Link to={`${queryPage}page=${page}`} key={index} className="mx-6 text-inherit">
                    ...
                </Link>
            ) : [1, 2, 3, 4, 5].includes(+currenPage) && page === 7 ? (
                <Link to={`${queryPage}page=${page}`} key={index} className="mx-6 text-inherit">
                    ...
                </Link>
            ) : (
                ''
            )
        })
        return xhtml
    }

    const prePage = () => {
        if (currenPage > 1) {
            navigate(`${queryPage}page=${+currenPage - 1}`)
            setCurrentPage((currenPage - 1) as any)
        }
    }

    const prePageOver = () => {
        if (currenPage > 0) {
            navigate(`${queryPage}page=${1}`)
            setCurrentPage(1 as any)
        }
    }

    const nextPage = () => {
        if (currenPage < total) {
            navigate(`${queryPage}page=${+currenPage + 1}`)
            setCurrentPage(currenPage + 1)
        }
    }

    const nextPageOver = () => {
        if (currenPage < total) {
            navigate(`${queryPage}page=${total}`)
            setCurrentPage(total as any)
        }
    }

    return (
        <div className="sc1920:h-[100px] sc1536:h-[80px] sc1366:h-[80px]  mr-8 flex items-center justify-end text-2xl">
            <span onClick={prePageOver} className="mx-6 mt-1">
                <img src="\img\arrow_left_all.png" width={18} />
            </span>

            <span onClick={prePage} className="mx-6 mt-1">
                <img src="\img\arrow_left.png" width={12} />
            </span>

            {renderPading()}

            <span onClick={nextPage} className="mx-6 mt-1">
                <img src="\img\arrow_right.png" width={12} />
            </span>

            <span onClick={nextPageOver} className="mx-6 mt-1">
                <img src="\img\arrow_right_all.png" width={18} />
            </span>
        </div>
    )
}

export default Paging
