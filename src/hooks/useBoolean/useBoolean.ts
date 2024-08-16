import { useState } from 'react'

/** Тип возвращаемого значения для useBoolean */
type UseBooleanReturn = [
  /** Текущее значение булева состояния */
  value: boolean,
  /** Функция для переключения булева состояния */
  toggle: (value?: boolean) => void,
]

/**
 * @name useBoolean
 * @description - Хук предоставляет булево состояние и функцию для переключения булева значения
 * @category Utilities
 *
 * @param {boolean} [initialValue=false] Начальное булево значение
 * @returns {UseBooleanReturn} Объект, содержащий значение булева состояния и утилитарные функции для его изменения
 *
 * @example
 * const [on, toggle] = useBoolean()
 */

const useBoolean = (initialValue = false): UseBooleanReturn => {
  const [value, setValue] = useState(initialValue)
  const toggle = (value?: boolean) => setValue((prevValue) => value ?? !prevValue)

  return [value, toggle]
}

export default useBoolean
