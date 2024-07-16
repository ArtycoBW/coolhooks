// Интерфейс NetworkInformation описывает объект с информацией о сети
interface NetworkInformation extends EventTarget {
  readonly type?: string // Тип соединения (например, 'wifi', 'cellular')
  readonly effectiveType?: string // Эффективный тип соединения (например, '4g', '3g')
  readonly downlinkMax?: number // Максимальная пропускная способность соединения в мегабитах в секунду
  readonly downlink?: number // Эффективная пропускная способность соединения в мегабитах в секунду
  readonly rtt?: number // Время задержки в миллисекундах
  readonly saveData?: boolean // Информация о включенном режиме экономии трафика
  readonly onchange?: EventListenerOrEventListenerObject // Событие, вызываемое при изменении состояния сети
}

// Расширяем интерфейс Navigator, чтобы добавить поддержку свойств connection, mozConnection и webkitConnection
interface Navigator {
  connection?: NetworkInformation // Информация о текущем сетевом соединении
  mozConnection?: NetworkInformation // Информация о сетевом соединении для браузеров Mozilla
  webkitConnection?: NetworkInformation // Информация о сетевом соединении для браузеров на основе WebKit
}
