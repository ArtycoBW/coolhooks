// src/hooks/useBoolean/useBoolean.stories.tsx

import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import useBoolean from './useBoolean'
import classes from './index.module.scss'

const Demo = () => {
  const [on, toggle] = useBoolean()

  return (
    <div className={classes.wrapper}>
      <p className={classes.count}>
        Значение: <code>{String(on)}</code>
      </p>
      <div className={classes.buttons}>
        <button type="button" onClick={() => toggle()} className={classes.button}>
          Переключить
        </button>
        <button type="button" onClick={() => toggle(true)} className={classes.button}>
          Установить (true)
        </button>
        <button type="button" onClick={() => toggle(false)} className={classes.button}>
          Установить (false)
        </button>
      </div>
    </div>
  )
}

export default {
  title: 'Хуки/useBoolean',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
