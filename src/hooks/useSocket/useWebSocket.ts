import { useState, useEffect, useRef, useCallback } from 'react'

// Типы для состояний и сообщений WebSocket
type WebSocketStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED'
type WebSocketMessage = string | ArrayBuffer | Blob

interface UseWebSocketOptions {
  shouldReconnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
  protocols?: string | string[]
}

interface WebSocketHook {
  status: WebSocketStatus
  message: WebSocketMessage | null
  sendMessage: (message: WebSocketMessage) => void
  closeConnection: () => void
  reconnect: () => void
  error: Event | null
}

/**
 * @name useWebSocket
 * @description Хук для работы с WebSocket, поддерживающий автоматическое переподключение и отправку сообщений.
 *
 * @param {string} url - URL WebSocket сервера.
 * @param {UseWebSocketOptions} [options] - Опции для настройки WebSocket.
 * @param {boolean} [options.shouldReconnect=true] - Флаг для автоматического переподключения при разрыве соединения.
 * @param {number} [options.reconnectInterval=5000] - Интервал в миллисекундах между попытками переподключения.
 * @param {number} [options.maxReconnectAttempts=Infinity] - Максимальное количество попыток переподключения.
 * @param {string | string[]} [options.protocols] - Протоколы для подключения WebSocket.
 *
 * @returns {WebSocketHook} Объект с текущим состоянием WebSocket, функциями отправки и закрытия соединения, переподключения и ошибкой.
 *
 * @example
 * const { status, message, sendMessage, closeConnection, reconnect, error } = useWebSocket('ws://localhost:8080', {
 *   shouldReconnect: true,
 *   reconnectInterval: 5000,
 *   maxReconnectAttempts: 5,
 *   protocols: undefined,
 * });
 *
 * @example
 * // Отправка сообщения
 * sendMessage('Привет, сервер!');
 *
 * @example
 * // Закрытие соединения
 * closeConnection();
 *
 * @example
 * // Повторное подключение
 * reconnect();
 */
export const useWebSocket = (url: string, options: UseWebSocketOptions = {}): WebSocketHook => {
  const { shouldReconnect = true, reconnectInterval = 5000, maxReconnectAttempts = Infinity, protocols } = options

  const [status, setStatus] = useState<WebSocketStatus>('CONNECTING')
  const [message, setMessage] = useState<WebSocketMessage | null>(null)
  const [error, setError] = useState<Event | null>(null)
  const websocketRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef<number>(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const clearReconnectTimeout = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
  }

  const connect = useCallback(() => {
    const ws = new WebSocket(url, protocols)

    setStatus('CONNECTING')

    ws.onopen = () => {
      setStatus('OPEN')
      setError(null)
      reconnectAttemptsRef.current = 0 // Сброс попыток переподключения
    }

    ws.onmessage = (event) => {
      setMessage(event.data)
    }

    ws.onerror = (event) => {
      setError(event)
    }

    ws.onclose = (event) => {
      setStatus('CLOSED')

      // Проверка на случайное закрытие соединения
      if (event.code !== 1000 && shouldReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1
        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, reconnectInterval)
      }
    }

    websocketRef.current = ws
  }, [url, protocols, shouldReconnect, reconnectInterval, maxReconnectAttempts])

  const sendMessage = useCallback((msg: WebSocketMessage) => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(msg)
    } else {
      console.error('WebSocket не открыт. Текущее состояние: ', websocketRef.current?.readyState)
    }
  }, [])

  const closeConnection = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close(1000, 'Соединение закрыто клиентом')
      reconnectAttemptsRef.current = 0
    }
  }, [])

  const reconnect = useCallback(() => {
    if (websocketRef.current && websocketRef.current.readyState !== WebSocket.CLOSED) {
      websocketRef.current.close(1000, 'Ручное переподключение')
    }
    clearReconnectTimeout()
    reconnectAttemptsRef.current = 0
    connect()
  }, [connect])

  useEffect(() => {
    connect()

    return () => {
      clearReconnectTimeout()
      websocketRef.current?.close(1000, 'Компонент размонтирован')
    }
  }, [connect])

  return {
    status,
    message,
    sendMessage,
    closeConnection,
    reconnect,
    error,
  }
}
