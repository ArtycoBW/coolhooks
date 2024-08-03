import { useEffect, useRef } from 'react'

/**
 * @name useThrottle
 * @description Хук для выполнения функции не чаще, чем один раз в заданный промежуток времени.
 * @category Utilities
 *
 * @template T - Тип функции, которая будет вызываться с задержкой.
 *
 * @param {T} callback - Функция, которую нужно выполнить с задержкой.
 * @param {number} delay - Задержка в миллисекундах.
 *
 * @returns {T} - Throttled версия переданной функции.
 *
 * @example
 * const handleClick = useThrottle(() => {
 *   setCount((prevCount) => prevCount + 1);
 * }, 1000);
 *
 * const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
 *   handleClick(event);
 * };
 */

export function useThrottle<T extends (...args: never[]) => void>(callback: T, delay: number): T {
  const lastExecTimeRef = useRef<number>(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const callbackRef = useRef<T>(callback)
  const delayRef = useRef<number>(delay)

  // Обновление callback функции при её изменении
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Обновление задержки при её изменении
  useEffect(() => {
    delayRef.current = delay
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [delay])

  // Очистка таймера при размонтировании компонента
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Throttled функция
  const throttledCallback = useRef((...args: Parameters<T>) => {
    const now = Date.now()
    const elapsed = now - lastExecTimeRef.current

    if (elapsed >= delayRef.current) {
      lastExecTimeRef.current = now
      callbackRef.current(...args)
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        lastExecTimeRef.current = Date.now()
        callbackRef.current(...args)
      }, delayRef.current - elapsed)
    }
  }).current

  return throttledCallback as T
}
