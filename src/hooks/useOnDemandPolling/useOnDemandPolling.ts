import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * @typedef {Object} PollingOptions
 * @property {number} initialInterval - Начальный интервал в миллисекундах для опроса.
 * @property {() => Promise<void>} onPoll - Асинхронная функция, вызываемая при каждом опросе.
 * @property {boolean} [enabled=true] - Флаг, указывающий, включён ли опрос. По умолчанию включен.
 * @property {number} [maxAttempts=5] - Максимальное количество попыток опроса при ошибках.
 * @property {(error: Error) => void} [onError] - Функция-обработчик ошибок, вызываемая при ошибках опроса.
 * @property {boolean} [immediateStart=false] - Флаг для немедленного начала опроса после первой загрузки.
 */

/**
 * @typedef {Object} UseOnDemandPollingReturn
 * @property {(newInterval: number) => void} changeInterval - Функция для изменения интервала опроса.
 * @property {() => void} startPolling - Функция для начала опроса.
 * @property {() => void} stopPolling - Функция для остановки опроса.
 */

/**
 * @name useOnDemandPolling
 * @description Хук для выполнения опроса сервера с возможностью динамического изменения интервала.
 * @category Hooks
 *
 * @param {PollingOptions} options - Опции для настройки опроса.
 * @param {number} options.initialInterval - Начальный интервал в миллисекундах.
 * @param {() => Promise<void>} options.onPoll - Асинхронная функция для выполнения запроса.
 * @param {boolean} [options.enabled=true] - Включает или отключает опрос.
 * @param {number} [options.maxAttempts=5] - Максимальное количество попыток опроса при ошибках.
 * @param {(error: Error) => void} [options.onError] - Обработчик ошибок.
 * @param {boolean} [options.immediateStart=false] - Немедленный запуск опроса после инициализации.
 * @returns {UseOnDemandPollingReturn} Объект с функциями для управления опросом.
 *
 * @example
 * const { changeInterval, startPolling, stopPolling } = useOnDemandPolling({
 *   initialInterval: 5000,
 *   onPoll: async () => { console.log('Polling...') },
 *   enabled: true,
 *   maxAttempts: 3,
 *   onError: (error) => console.error(error),
 *   immediateStart: true,
 * });
 *
 * @example
 * // Изменение интервала опроса
 * changeInterval(3000);
 *
 * @example
 * // Начало и остановка опроса
 * startPolling();
 * stopPolling();
 */

interface PollingOptions {
  initialInterval: number // начальный интервал в миллисекундах
  onPoll: () => Promise<void> // асинхронная функция, которая будет вызываться при каждом опросе
  enabled?: boolean // флаг для включения/отключения опроса
  maxAttempts?: number // максимальное количество попыток опроса при возникновении ошибок
  onError?: (error: Error) => void // обработчик ошибок
  immediateStart?: boolean // флаг для немедленного начала опроса
}

export function useOnDemandPolling({
  initialInterval,
  onPoll,
  enabled = true,
  maxAttempts = 5,
  onError,
  immediateStart = false,
}: PollingOptions) {
  const [currentInterval, setCurrentInterval] = useState(initialInterval)
  const [attemptCount, setAttemptCount] = useState(0)
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null)
  const savedCallback = useRef(onPoll)

  // Сохранение последней версии onPoll для использования в setInterval
  useEffect(() => {
    savedCallback.current = onPoll
  }, [onPoll])

  /**
   * Функция для изменения интервала опроса.
   *
   * @param {number} newInterval - Новый интервал в миллисекундах.
   */
  const changeInterval = useCallback((newInterval: number) => {
    setCurrentInterval(newInterval)
  }, [])

  /**
   * Функция для выполнения опроса с обработкой ошибок.
   *
   * @returns {Promise<void>}
   */
  const executePoll = useCallback(async () => {
    try {
      await savedCallback.current()
      setAttemptCount(0)
    } catch (error) {
      if (onError) {
        onError(error as Error)
      }
      if (attemptCount < maxAttempts) {
        setAttemptCount(attemptCount + 1)
      } else {
        stopPolling()
      }
    }
  }, [attemptCount, maxAttempts, onError])

  /**
   * Функция для начала опроса.
   */
  const startPolling = useCallback(() => {
    if (intervalIdRef.current === null) {
      if (immediateStart) {
        executePoll()
      }
      intervalIdRef.current = setInterval(() => {
        executePoll()
      }, currentInterval)
    }
  }, [currentInterval, executePoll, immediateStart])

  /**
   * Функция для остановки опроса.
   */
  const stopPolling = useCallback(() => {
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current)
      intervalIdRef.current = null
    }
  }, [])

  // Управление состоянием опроса при изменении enabled
  useEffect(() => {
    if (enabled) {
      startPolling()
    } else {
      stopPolling()
    }

    return () => stopPolling()
  }, [enabled, startPolling, stopPolling])

  // Эффект для изменения интервала
  useEffect(() => {
    if (intervalIdRef.current !== null) {
      stopPolling()
      startPolling()
    }
  }, [currentInterval, startPolling, stopPolling])

  return { changeInterval, startPolling, stopPolling }
}
