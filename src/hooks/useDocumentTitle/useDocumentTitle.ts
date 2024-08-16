import { useRef, useState } from 'react'
import useMutationObserver from '../useMutationObserver/useMutationObserver'
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect'

/** Тип опций для хука useDocumentTitle */
export interface UseDocumentTitleOptions {
  /** Восстановить предыдущий заголовок при размонтировании компонента */
  restoreOnUnmount?: boolean
}

/** Тип возвращаемого значения хука useDocumentTitle */
export type UseDocumentTitleReturn = [
  /** Текущий заголовок */
  title: string,

  /** Функция для обновления заголовка */
  setTitle: (title: string) => void,
]

/**
 * @name useDocumentTitle
 * @description - Хук, который управляет заголовком документа и позволяет его обновлять
 * @category Browser
 *
 * @param {string} [value] Начальный заголовок. Если не указан, будет использован текущий заголовок документа.
 * @param {boolean} [options.restoreOnUnmount] Восстановить предыдущий заголовок при размонтировании компонента.
 * @returns {UseDocumentTitleReturn} Массив, содержащий текущий заголовок и функцию для его обновления.
 *
 * @example
 * const [title, setTitle] = useDocumentTitle();
 */
function useDocumentTitle(value?: string, options?: UseDocumentTitleOptions): UseDocumentTitleReturn {
  const prevTitleRef = useRef(document.title)
  const [title, setTitle] = useState(value ?? document.title)

  useMutationObserver(
    () => {
      if (document.title !== title) {
        setTitle(document.title)
      }
    },
    { childList: true },
    document.head.querySelector('title'),
  )

  useIsomorphicLayoutEffect(() => {
    if (options?.restoreOnUnmount) {
      return () => {
        document.title = prevTitleRef.current
      }
    }
  }, [options?.restoreOnUnmount])

  const set = (value: string) => {
    const updatedValue = value.trim()
    if (updatedValue.length > 0) {
      document.title = updatedValue
      setTitle(updatedValue)
    }
  }

  useIsomorphicLayoutEffect(() => {
    if (typeof value === 'string') {
      set(value)
    }
  }, [value])

  return [title, set]
}

export default useDocumentTitle
