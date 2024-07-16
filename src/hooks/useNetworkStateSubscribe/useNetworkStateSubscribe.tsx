import { useEffect } from 'react'

type NetworkCallback = () => void

/**
 * @name useNetworkStateSubscribe
 * @description Хук для подписки на изменения состояния сети (онлайн/оффлайн) и состояния сетевого подключения.
 * @category Hooks
 *
 * @param {NetworkCallback} callback Функция обратного вызова, вызываемая при изменении состояния сети.
 *
 * @example
 * useNetworkStateSubscribe(() => {
 *   console.log('Изменение состояния сети');
 * });
 */
const useNetworkStateSubscribe = (callback: NetworkCallback) => {
  useEffect(() => {
    const handleOnline = () => callback()
    const handleOffline = () => callback()
    const handleConnectionChange = () => callback()

    // Добавление обработчиков событий для изменения состояния сети
    window.addEventListener('online', handleOnline, { passive: true })
    window.addEventListener('offline', handleOffline, { passive: true })

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

    if (connection) {
      // Добавление обработчика события для изменения состояния сетевого подключения
      connection.addEventListener('change', handleConnectionChange, { passive: true })
    }

    // Очистка обработчиков событий при размонтировании компонента
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)

      if (connection) {
        connection.removeEventListener('change', handleConnectionChange)
      }
    }
  }, [callback])
}

export default useNetworkStateSubscribe
