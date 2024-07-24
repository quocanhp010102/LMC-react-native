
export  interface QueryType<T>{

    data: {
        content: T[],
        totalsElement: number,
        totalsPage: number
    }
    isFetching?: boolean,
    isPreviousData?:boolean
    isLoading?: boolean
    [key: string]: any

}

export type QueryTypeNoPage<T> = {
    data: T[]
    sFetching?: boolean
    isPreviousData?:boolean
    isLoading?: boolean
    [key: string]: any
}