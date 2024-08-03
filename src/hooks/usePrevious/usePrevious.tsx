import { useEffect, useRef } from 'react'

/**
 * @name usePrevious
 * @description Хук для сохранения предыдущего значения переменной между рендерами.
 * @category Utilities
 *
 * @template T - Тип сохраняемого значения.
 *
 * @param {T} value - Текущее значение.
 *
 * @returns {T | undefined} - Предыдущее значение или undefined, если предыдущего значения нет.
 *
 * @example
 * const ExampleComponent: React.FC = () => {
 *   const [count, setCount] = useState(0)
 *   const previousCount = usePrevious(count)
 *
 *   return (
 *     <div>
 *       <p>Current count: {count}</p>
 *       <p>Previous count: {previousCount ?? 'No previous value'}</p>
 *       <button onClick={() => setCount(count + 1)}>Increment</button>
 *     </div>
 *   )
 * }
 */
export function usePrevious<T>(value: T): T | undefined {
  // Создаем ref для хранения предыдущего значения
  const ref = useRef<T | undefined>(undefined)

  // Используем useEffect для обновления ref при изменении value
  useEffect(() => {
    ref.current = value
  }, [value])

  // Возвращаем предыдущее значение
  return ref.current
}
