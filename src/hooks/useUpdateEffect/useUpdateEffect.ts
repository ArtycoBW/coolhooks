import { useEffect, useRef } from 'react'

/**
 * Хук useUpdateEffect работает аналогично useEffect, но пропускает выполнение эффекта при первом рендере.
 *
 * @param {() => void | (() => void | undefined)} effect - Функция, содержащая побочный эффект, который будет выполняться при обновлении зависимостей.
 * @param {React.DependencyList} deps - Массив зависимостей, при изменении которых будет выполняться эффект.
 *
 * @example
 * useUpdateEffect(() => {
 *   console.log('Этот эффект выполнится только при изменении зависимостей');
 * }, [dependency]);
 */
export const useUpdateEffect = (effect: () => void | (() => void | undefined), deps: React.DependencyList) => {
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false

      return // Пропустить выполнение эффекта при первом рендере
    }

    const cleanup = effect() // Выполнить эффект

    return cleanup // Возврат функции очистки, если она предоставлена
  }, deps)
}
