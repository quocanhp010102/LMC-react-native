import { useCallback, useMemo, useRef, useState } from "react"
import { PAGE_SIZE } from "../constants"
import type { ApiResponse } from "../services"

/**
 * @author CuongPG
 * A hooks to handle pagination response, refresh and pull to refresh
 */
export type Response =
  | ApiResponse<any>
  | {
      success: boolean
      data: any
    }
/**
 * A hooks to handle pagination response, refresh and pull to refresh
 * @param callback A callback will call refresh and load more event fire. it provide page token and page size for pagination api
 * @param pageSize config page size of each call api
 * @param hasContent the array content in contents object
 * @returns A promise contain response from pagination api
 */
export function useHandleResponsePagination<T>(
  callback: (pageToken: number, numberOfPageSize: number) => Promise<Response>,
  pageSize: number = PAGE_SIZE,
  hasContent: boolean = true,
  initData?: T[]
) {
  /**
   *  A state store data that api return will save here
   */
  const [data, setData] = useState<T[] | undefined>(initData)
  /**
   * Current page token
   */
  const pageToken = useRef(0)
  const isLoadingRef = useRef(false)
  /**
   * mark is calling api
   */
  const [isLoading, setLoading] = useState<boolean>(false)
  /**
   * mark is loading more
   */
  const [isLoadMore, setLoadMore] = useState<boolean>(false)
  const isLoadMoreRef = useRef(false)
  /**
   * mark the current page isn't latest page, can request a least one page to load more data
   */
  const hasMore = useRef<boolean>(false)

  const setHasMore = (value: boolean) => {
    hasMore.current = value
  }

  const setPageToken = (value: number) => {
    pageToken.current = value
  }

  const setLoadingRef = (value: boolean) => {
    setLoading(value)
    isLoadingRef.current = value
  }

  const setLoadMoreRef = (value: boolean) => {
    isLoadMoreRef.current = value
  }

  /**
   * handle response from api
   * @param response
   */

  const handleSuccessResponse = (
    response?: Response,
    fromLoadMore?: boolean
  ) => {
    if (fromLoadMore && isLoadingRef.current) return
    setLoadingRef(false)
    setLoadMoreRef(false)

    if (response?.success === true) {
      const result = (
        hasContent ? response?.data?.content : response?.data
      ) as T[]
      const length =
        (hasContent ? response?.data?.content : response?.data)?.length ?? 0
      if (length === 0) {
        if (pageToken.current === 0) {
          setData(result || [])
        }
        setHasMore(false)
      } else if (pageToken.current === 0) {
        if (length < 1) {
          setHasMore(false)
          setData(result)
        } else {
          setPageToken(pageToken.current + 1)
          setData(result)
          setHasMore(true)
        }
      } else if (length < 1) {
        setHasMore(false)
        setData((items) => (items ?? []).concat(result))
      } else {
        setPageToken(pageToken.current + 1)
        setData((items) => (items ?? []).concat(result))
        setHasMore(true)
      }
    } else if (pageToken.current === 0) {
      setData([])
      setHasMore(false)
    }
  }

  const handleFailedResponse = useCallback((error: any) => {
    setHasMore(false)
    setLoadingRef(false)
    setLoadMoreRef(false)
    setLoadMore(false)
  }, [])

  /** reset all state to can refresh data */
  const reload = useCallback(() => {
    // setLoading(false)
    setLoadMore(false)
    setHasMore(false)
    setPageToken(0)
  }, [])

  /** reset data state */
  const resetData = useCallback(() => {
    setData(undefined)
  }, [])

  /**
   * handle response when get data from load more
   */
  const handleLoadMore = useCallback(
    (info?: { distanceFromEnd: number }) => {
      if ((info?.distanceFromEnd ?? 0) < 0) return undefined
      if (
        hasMore.current &&
        !isLoadMore &&
        !isLoadingRef.current &&
        !isLoadMoreRef.current
      ) {
        setLoadMoreRef(true)
        if ((data?.length ?? 0) >= pageSize) {
          setLoadMore(true)
        } else {
          setLoadMore(false)
        }
        return callback(pageToken.current, pageSize)
          .then((response) => {
            handleSuccessResponse(response, true)
            return Promise.resolve(response)
          })
          .catch((ex) => {
            handleFailedResponse(ex)
            return Promise.reject(ex)
          })
          .finally(() => {
            setLoadMore(false)
          })
      }
      return undefined
    },
    [isLoadMore, pageSize, callback, data]
  )

  /**
   * refresh data in page in the first time open page
   */
  const refresh = useCallback(() => {
    if (!isLoadingRef.current) {
      setLoadingRef(true)
      setPageToken(0)
      return callback(0, pageSize)
        .then((response) => {
          handleSuccessResponse(response, false)
          return Promise.resolve(response)
        })
        .catch((ex) => {
          handleFailedResponse(ex)
          return Promise.reject(ex)
        })
    }
    return undefined
  }, [pageSize, callback])

  /**
   * function will use when implementing pull to refresh content
   */

  const pullToRefresh = () => {
    reload()
    return refresh()
  }

  /**
   * a variable mark user is pull to refresh
   */
  const isRefreshing = useMemo(
    () => isLoading && data !== undefined,
    [data, isLoading]
  )

  const isEmpty = useMemo(
    () => data !== undefined && data?.length === 0,
    [data]
  )

  return {
    data: data ?? [],
    isLoadMore,
    isLoading,
    isRefreshing,
    refresh,
    handleLoadMore,
    pullToRefresh,
    resetData,
    setData,
    isEmpty,
    setPageToken,
    setHasMore,
    pageToken,
  }
}
