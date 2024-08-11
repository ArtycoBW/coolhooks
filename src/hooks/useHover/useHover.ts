import { useState, useRef, useEffect, RefObject } from 'react'

/** Опции для useHover */
export interface UseHoverOptions {
  /** Начальное состояние наведения (по умолчанию: false) */
  initialIsHovered?: boolean
  /** Указать, использовать ли обработчик 'mouseenter' вместо 'mouseover' */
  useMouseEnter?: boolean
  /** Указать, использовать ли обработчик 'mouseleave' вместо 'mouseout' */
  useMouseLeave?: boolean
}

/** Возвращаемый тип useHover */
export interface UseHoverReturn<T extends HTMLElement> {
  /** Булево значение, указывающее, наведена ли мышь на элемент */
  isHovered: boolean
  /** Ссылка на элемент, для которого отслеживается состояние наведения */
  ref: RefObject<T>
}

/**
 * @name useHover
 * @description - Хук, управляющий состоянием наведения на элемент
 * @category Utilities
 *
 * @param {UseHoverOptions} [options] Опции для настройки поведения хука
 * @param {boolean} [options.initialIsHovered=false] Начальное состояние наведения
 * @param {boolean} [options.useMouseEnter=false] Указать, использовать ли обработчик 'mouseenter' вместо 'mouseover'
 * @param {boolean} [options.useMouseLeave=false] Указать, использовать ли обработчик 'mouseleave' вместо 'mouseout'
 * @returns {UseHoverReturn<T>} Объект, содержащий текущее состояние наведения и ссылку на элемент
 *
 * @example
 * const { isHovered, ref } = useHover<HTMLDivElement>();
 *
 * <div ref={ref}>
 *   {isHovered ? 'Мышь над элементом' : 'Мышь не над элементом'}
 * </div>
 *
 * @example
 * const { isHovered, ref } = useHover<HTMLButtonElement>({ initialIsHovered: true });
 *
 * <button ref={ref}>
 *   {isHovered ? 'Наведено' : 'Не наведено'}
 * </button>
 */
export function useHover<T extends HTMLElement>(options?: UseHoverOptions): UseHoverReturn<T> {
  const { initialIsHovered = false, useMouseEnter = false, useMouseLeave = false } = options || {}

  // Состояние для отслеживания, наведена ли мышь
  const [isHovered, setIsHovered] = useState<boolean>(initialIsHovered)

  // Ссылка на элемент, к которому будет привязан обработчик событий
  const ref = useRef<T>(null)

  // Обработчики событий для наведения и ухода мыши
  const handleMouseOver = () => setIsHovered(true)
  const handleMouseOut = () => setIsHovered(false)

  useEffect(() => {
    const node = ref.current

    if (node) {
      // Используем либо mouseenter/mouseleave, либо mouseover/mouseout в зависимости от опций
      const mouseEnterEvent = useMouseEnter ? 'mouseenter' : 'mouseover'
      const mouseLeaveEvent = useMouseLeave ? 'mouseleave' : 'mouseout'

      // Добавляем обработчики событий
      node.addEventListener(mouseEnterEvent, handleMouseOver)
      node.addEventListener(mouseLeaveEvent, handleMouseOut)

      // Функция очистки для удаления обработчиков событий
      return () => {
        node.removeEventListener(mouseEnterEvent, handleMouseOver)
        node.removeEventListener(mouseLeaveEvent, handleMouseOut)
      }
    }
  }, [useMouseEnter, useMouseLeave])

  return { isHovered, ref }
}
