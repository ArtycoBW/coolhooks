import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * @name useFetch
 * @description Хук для выполнения HTTP-запросов с поддержкой кэширования и отмены
 * @param url - URL, по которому выполняется запрос
 * @param options - Настройки запроса
 * @returns { data, error, loading, refetch } - Состояние загрузки, данные и ошибки
 *
 * @example
 * const { data, error, loading, refetch } = useFetch('https://api.example.com/data');
 */

export function useFetch<T>(url: string, options?: RequestInit) {
  const cache = useRef<{ [url: string]: { data: T; timestamp: number } }>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [currentUrl, setCurrentUrl] = useState<string>(url)
  const abortController = useRef<AbortController | null>(null)

  const fetchData = useCallback(async () => {
    if (abortController.current) {
      abortController.current.abort()
    }
    abortController.current = new AbortController()

    const cacheDuration = 5 * 60 * 1000 // 5 минут
    const cachedResponse = cache.current[currentUrl]
    if (cachedResponse && Date.now() - cachedResponse.timestamp < cacheDuration) {
      setData(cachedResponse.data)
      setLoading(false)

      return
    }

    try {
      setLoading(true)
      const response = await fetch(currentUrl, {
        ...options,
        signal: abortController.current.signal,
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const result: T = await response.json()
      cache.current[currentUrl] = { data: result, timestamp: Date.now() }
      setData(result)
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setError(error)
      }
    } finally {
      setLoading(false)
      abortController.current = null
    }
  }, [currentUrl, options])

  const refetch = useCallback(() => {
    setCurrentUrl(`${url}?timestamp=${new Date().getTime()}`)
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, error, loading, refetch }
}
