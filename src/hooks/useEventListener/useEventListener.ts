import { useEffect, useRef } from 'react'

/**
 * @name useEventListener
 * @description Хук для добавления и удаления обработчиков событий для различных типов событий и элементов (HTML элементы, window, document).
 * @param {K} eventName - Имя события, на которое необходимо подписаться.
 * @param {EventHandler<K>} handler - Функция-обработчик события.
 * @param {SupportedEventTarget} [element=window] - Элемент, на который нужно повесить обработчик события. По умолчанию — window.
 * @param {boolean | AddEventListenerOptions} [options] - Опции для addEventListener.
 *
 * @example
 * // Пример использования слушателя события прокрутки на окне:
 * useEventListener('scroll', (event) => {
 *   console.log('Scrolled!', event);
 * });
 *
 * @example
 * // Пример использования слушателя кликов на кнопке:
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * useEffect(() => {
 *   if (buttonRef.current) {
 *     useEventListener('click', (event) => {
 *       console.log('Button clicked!', event);
 *     }, buttonRef.current);
 *   }
 * }, []);
 *
 * @example
 * // Пример использования слушателя события клавиатуры на документе с опциями:
 * useEventListener('keydown', (event) => {
 *   console.log('Key pressed!', event);
 * }, document, { capture: true });
 *
 * @template K
 * @param {K} eventName - Имя события, на которое необходимо подписаться.
 * @param {EventHandler<K>} handler - Функция-обработчик события.
 * @param {SupportedEventTarget} [element=window] - Элемент, на который нужно повесить обработчик события. По умолчанию — window.
 * @param {boolean | AddEventListenerOptions} [options] - Опции для addEventListener.
 */

// Определяем тип для поддерживаемых элементов
type SupportedEventTarget = HTMLElement | Window | Document

// Определяем тип обработчика событий
type EventHandler<K extends keyof WindowEventMap> = (event: WindowEventMap[K]) => void

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: EventHandler<K>,
  element: SupportedEventTarget | null = window, // Разрешаем null здесь
  options?: boolean | AddEventListenerOptions,
) {
  // Используем useRef для сохранения текущего обработчика
  const savedHandler = useRef<EventHandler<K>>(handler)

  // Обновляем ref с обработчиком, только если он изменился
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    // Проверяем, поддерживает ли элемент addEventListener
    const targetElement = element && 'addEventListener' in element ? element : null
    if (!targetElement) return

    // Создаем обертку для вызова текущего обработчика из useRef
    const eventListener = (event: Event) => savedHandler.current(event as WindowEventMap[K])

    // Добавляем обработчик события
    targetElement.addEventListener(eventName, eventListener, options)

    // Убираем обработчик события при размонтировании
    return () => {
      targetElement.removeEventListener(eventName, eventListener, options)
    }
  }, [eventName, element, options]) // Обновляем useEffect только при изменении eventName, element или options
}
