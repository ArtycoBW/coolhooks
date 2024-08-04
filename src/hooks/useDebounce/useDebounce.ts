import { useEffect, useRef } from 'react'

/**
 * @name useDebounce
 * @description Хук для отложенного выполнения функции на заданный промежуток времени.
 * @category Utilities
 *
 * @template T - Тип функции, которая будет вызываться с задержкой.
 *
 * @param {T} callback - Функция, которую нужно выполнить с задержкой.
 * @param {number} delay - Задержка в миллисекундах.
 *
 * @returns {T} - Debounced версия переданной функции.
 *
 * @example
 * const handleSearch = useDebounce((value: string) => {
 *   console.log('Searching for:', value);
 *   // Здесь можно выполнить сетевой запрос или другую логику
 * }, 300);
 *
 * const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
 *   setSearchTerm(event.target.value);
 *   handleSearch(event.target.value);
 * };
 */
function useDebounce<T extends (...args: never[]) => void>(callback: T, delay: number): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const callbackRef = useRef<T>(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const debouncedCallback = useRef((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args)
    }, delay)
  }).current

  return debouncedCallback as T
}

export default useDebounce
