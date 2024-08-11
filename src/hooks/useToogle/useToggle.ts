import type { SetStateAction } from 'react'
import { useReducer } from 'react'

/** Тип возвращаемого значения для useToggle */
export type UseToggleReturn<Value> = readonly [Value, (value?: Value) => void]

/**
 * @name useToggle
 * @description - Хук, создающий переключатель
 * @category Utilities
 *
 * @template Value Тип значения
 * @param {Value[]} [values=[false, true]] Значения для переключения
 *
 * @example
 * const [on, toggle] = useToggle();
 *
 * @example
 * const [value, toggle] = useToggle(['light', 'dark'] as const);
 */
export const useToggle = <Value = boolean>(values: readonly Value[] = [false, true] as Value[]) => {
  const [[option], toggle] = useReducer((state: Value[], action: SetStateAction<Value | unknown>) => {
    const value = action instanceof Function ? action(state[0]) : action
    const index = Math.abs(state.indexOf(value))

    return state.slice(index).concat(state.slice(0, index))
  }, values as Value[])

  return [option, toggle as (value?: SetStateAction<Value>) => void] as const
}
