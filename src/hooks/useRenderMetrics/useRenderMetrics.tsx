import { useEffect, useRef, useCallback, useMemo } from 'react'

/** Интерфейс для метрик рендеров */
interface RenderMetrics {
  name: string
  renders: number
  sinceLastRender: number
  timestamp: string
  memoryUsage?: string
}

/** Расширение интерфейса Performance для включения опциональной памяти */
interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number
  }
}

/**
 * @name useRenderMetrics
 * @description - Хук, который отслеживает метрики рендеров компонента, включая количество рендеров,
 * время с последнего рендера и использование памяти.
 * @param {string} [name='Unknown'] Имя компонента для идентификации в логах.
 * @param {boolean} [logMetrics=true] Флаг для включения/выключения логирования метрик.
 * @returns {RenderMetrics | null} Объект с метриками рендеров или null в продакшен-окружении.
 * @example
 * const renderMetrics = useRenderMetrics('MyComponent');
 */
export function useRenderMetrics(name = 'Unknown', logMetrics = true): RenderMetrics | null {
  // Счетчик рендеров
  const renderCount = useRef<number>(0)
  // Время последнего рендера
  const lastRenderTime = useRef<number | null>(null)
  // Текущее время
  const currentTime: number = Date.now()

  // Увеличиваем счетчик рендеров
  renderCount.current++

  // Обновляем время последнего рендера при каждом рендере
  useEffect(() => {
    lastRenderTime.current = Date.now()
  })

  // Время с последнего рендера в секундах
  const sinceLastRender: number = lastRenderTime.current ? (currentTime - lastRenderTime.current) / 1000 : 0

  // Форматирование использования памяти
  const formatMemoryUsage = useCallback((memoryUsage: number): string => {
    const mb = memoryUsage / (1024 * 1024)
    const gb = memoryUsage / (1024 * 1024 * 1024)
    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`
    } else {
      return `${mb.toFixed(2)} MB`
    }
  }, [])

  // Использование памяти
  let memoryUsage: string | undefined = undefined
  const performance = window.performance as PerformanceWithMemory

  // Проверяем, поддерживается ли измерение памяти
  if (performance.memory) {
    memoryUsage = formatMemoryUsage(performance.memory.usedJSHeapSize)
  }

  // Форматирование временной метки в читаемую строку
  const formatTimestamp = useCallback((timestamp: number): string => {
    const date = new Date(timestamp)

    return date.toLocaleString()
  }, [])

  // Мемоизируем объект метрик для оптимизации
  const metrics = useMemo<RenderMetrics>(
    () => ({
      name,
      renders: renderCount.current,
      sinceLastRender,
      timestamp: formatTimestamp(currentTime),
      memoryUsage,
    }),
    [name, renderCount.current, sinceLastRender, currentTime, memoryUsage, formatTimestamp],
  )

  // Если не в продакшен-окружении и логирование включено, логируем метрики
  if (process.env.NODE_ENV !== 'production' && logMetrics) {
    console.log(metrics)
  }

  return metrics
}
