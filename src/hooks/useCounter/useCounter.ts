import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

/** Опции для useCounter */
export interface UseCounterOptions {
  /** Минимальное значение счетчика */
  min?: number
  /** Максимальное значение счетчика */
  max?: number
}

/** Возвращаемый тип useCounter */
export interface UseCounterReturn {
  /** Текущее значение счетчика */
  count: number
  /** Функция для установки конкретного значения счетчика */
  set: Dispatch<SetStateAction<number>>
  /** Функция для сброса счетчика до начального значения */
  reset: () => void
  /** Функция для увеличения счетчика */
  inc: (value?: number) => void
  /** Функция для уменьшения счетчика */
  dec: (value?: number) => void
}

export interface UseCounter {
  (initialValue?: number, options?: UseCounterOptions): UseCounterReturn

  (options: UseCounterOptions & { initialValue?: number }, initialValue?: never): UseCounterReturn
}

/**
 * @name useCounter
 * @description - Хук, управляющий счётчиком с функционалом увеличения, уменьшения, сброса и установки значения
 * @category Utilities
 *
 * @overload
 * @param {number} [initialValue=0] Начальное числовое значение
 * @param {number} [options.min=Number.NEGATIVE_INFINITY] Минимальное значение счетчика
 * @param {number} [options.max=Number.POSITIVE_INFINITY] Максимальное значение счетчика
 * @returns {UseCounterReturn} Объект, содержащий текущее значение счетчика и функции для взаимодействия с ним

 * @overload
 * @param {number} [params.initialValue=0] Начальное числовое значение
 * @param {number} [params.min=Number.NEGATIVE_INFINITY] Минимальное значение счетчика
 * @param {number} [params.max=Number.POSITIVE_INFINITY] Максимальное значение счетчика
 * @returns {UseCounterReturn} Объект, содержащий текущее значение счетчика и функции для взаимодействия с ним
 *
 * @example
 * const { count, dec, inc, reset, set } = useCounter(5);
 *
 * @example
 * const { count, dec, inc, reset, set } = useCounter({ initialValue: 5, min: 0, max: 10 });
 */
export const useCounter = ((...params: unknown[]) => {
  const initialValue =
    typeof params[0] === 'number'
      ? params[0]
      : (params[0] as UseCounterOptions & { initialValue?: number })?.initialValue
  const { max = Number.POSITIVE_INFINITY, min = Number.NEGATIVE_INFINITY } =
    typeof params[0] === 'number'
      ? ((params[1] ?? {}) as UseCounterOptions)
      : ((params[0] ?? {}) as UseCounterOptions & { initialValue?: number })

  const [count, setCount] = useState(initialValue ?? 0)

  const inc = (value = 1) => {
    setCount((prevCount) => {
      if (typeof max === 'number' && count === max) return prevCount

      return Math.max(Math.min(max, prevCount + value), min)
    })
  }

  const dec = (value = 1) => {
    setCount((prevCount) => {
      if (typeof min === 'number' && prevCount === min) return prevCount

      return Math.min(Math.max(min, prevCount - value), max)
    })
  }

  const reset = () => {
    const value = initialValue ?? 0
    if (typeof max === 'number' && value > max) return setCount(max)
    if (typeof min === 'number' && value < min) return setCount(min)
    setCount(value)
  }

  const set = (value: SetStateAction<number>) => {
    setCount((prevCount) => {
      const updatedCount = Math.max(min, Math.min(max, typeof value === 'number' ? value : value(prevCount)))

      return updatedCount
    })
  }

  return { count, set, inc, dec, reset } as const
}) as UseCounter
