import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

/**
 * Пользовательский хук React, который наблюдает за мутациями на указанном целевом элементе и вызывает обратный вызов, когда происходят мутации.
 *
 * @param {MutationCallback} callback - Функция, которая будет вызвана при обнаружении мутации.
 * @param {MutationObserverInit} options - Опции для настройки MutationObserver.
 * @param {HTMLElement | (() => HTMLElement) | null} target - Целевой элемент для наблюдения за мутациями.
 * @return {RefObject<Element>} Ссылка на наблюдаемый элемент.
 */
function useMutationObserver<Element extends HTMLElement>(
  callback: MutationCallback,
  options: MutationObserverInit,
  target?: HTMLElement | (() => HTMLElement) | null,
) {
  const observer = useRef<MutationObserver>()
  const ref: RefObject<Element> = useRef(null)

  useEffect(() => {
    const targetElement = typeof target === 'function' ? target() : target

    if (targetElement || ref.current) {
      observer.current = new MutationObserver(callback)
      observer.current.observe(targetElement || ref.current!, options)
    }

    return () => {
      observer.current?.disconnect()
    }
  }, [callback, options])

  return ref
}

export default useMutationObserver
