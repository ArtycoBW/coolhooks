// src/hooks/useCounter/useCounter.stories.tsx

import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import useCounter from './useCounter'
import classes from './index.module.scss'

const Demo = () => {
  const { count, inc, dec, reset, set } = useCounter()

  return (
    <div className={classes.wrapper}>
      <p className={classes.count}>
        Кол-во: <code>{count}</code>
      </p>
      <div className={classes.buttons}>
        <button type="button" onClick={() => inc()} className={classes.button}>
          Инкремент
        </button>
        <button type="button" onClick={() => dec()} className={classes.button}>
          Дикремент
        </button>
        <button type="button" onClick={() => set(5)} className={classes.button}>
          Задать (5)
        </button>
        <button type="button" onClick={reset} className={classes.button}>
          Сбросить
        </button>
      </div>
    </div>
  )
}

export default {
  title: 'Хуки/useCounter',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
