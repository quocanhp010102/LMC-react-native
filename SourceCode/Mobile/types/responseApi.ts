export interface IPrams {
  page: number
  size: number
  sort?: string
  [key: string]: any
}

export interface IResponseData<T> {
  data: T[]
  size: number
  totalElements: number
  totalPages: number
  [key: string]: any
}
