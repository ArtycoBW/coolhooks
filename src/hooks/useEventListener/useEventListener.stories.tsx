// src/hooks/useEventListener/useEventListener.stories.tsx

import React, { useState, useRef } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useEventListener } from './useEventListener'
import classes from './index.module.scss'

const Demo = () => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [keyPressed, setKeyPressed] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Слушатель события движения мыши на документе
  useEventListener(
    'mousemove',
    (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    },
    document,
  )

  // Слушатель события нажатия клавиши на документе
  useEventListener(
    'keydown',
    (event) => {
      setKeyPressed(event.key)
    },
    document,
  )

  // Слушатель события наведения на элемент
  const ref = useRef<HTMLDivElement>(null)
  useEventListener('mouseover', () => setIsHovered(true), ref.current)
  useEventListener('mouseout', () => setIsHovered(false), ref.current)

  return (
    <div className={classes.wrapper}>
      <div ref={ref}>
        <p
          className={classes.info}
          style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.3s' }}>
          {isHovered ? 'Ты надо мной!' : 'Наведи на меня'}
        </p>
      </div>
      <p className={classes.info} style={{ color: 'black' }}>
        Положение мыши: X: <code>{mousePosition.x}</code>, Y: <code>{mousePosition.y}</code>
      </p>
      <p className={classes.info}>
        Последнее нажатая клавиша: <code>{keyPressed || 'None'}</code>
      </p>
    </div>
  )
}

export default {
  title: 'Хуки/useEventListener',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
