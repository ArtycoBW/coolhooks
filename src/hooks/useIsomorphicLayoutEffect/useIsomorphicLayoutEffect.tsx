import { isClient } from '@/utils/helpers'
import { useEffect, useLayoutEffect } from 'react'

/**
 * @name useIsomorphicLayoutEffect
 * @description - Хук, условно выбирающий либо `useLayoutEffect`, либо `useEffect` в зависимости от среды выполнения
 * @category Жизненный цикл
 *
 * @example
 * useIsomorphicLayoutEffect(() => console.log('эффект'), [])
 */
export const useIsomorphicLayoutEffect = isClient ? useLayoutEffect : useEffect
