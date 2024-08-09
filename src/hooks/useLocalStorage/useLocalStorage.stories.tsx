import React, { useEffect, useRef } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import classes from './index.module.scss'
import useLocalStorage from './useLocalStorage'
import createDrawing from '@/utils/helpers/createDrawing'

const Demo = () => {
  const [drawing, saveDrawing] = useLocalStorage('drawing', null as string | null)
  const ref = useRef<HTMLCanvasElement | null>(null)

  const handleSaveDrawing = (drawing: string) => {
    saveDrawing(drawing)
  }

  useEffect(() => {
    createDrawing(ref.current, drawing, handleSaveDrawing)
  }, [drawing, handleSaveDrawing])

  return (
    <section className={classes.wrapper}>
      <div className={classes.buttons}>
        <button className="link" onClick={() => window.location.reload()}>
          Перегрузить страницу
        </button>
        <button
          className="link"
          onClick={() => {
            window.localStorage.clear()
            window.location.reload()
          }}>
          Очистить Local Storage
        </button>
      </div>
      <figure>
        <canvas
          ref={ref}
          width={400}
          height={400}
          style={{ border: '1px solid red', borderRadius: '10px', backgroundColor: '#F37022' }}
        />
        <figcaption
          style={{
            textAlign: 'center',
            color: '#F37022',
            fontSize: '20px',
          }}>
          (Нарисуйте что-нибудь)
        </figcaption>
      </figure>
    </section>
  )
}

export default {
  title: 'Хуки/useLocalStorage',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
