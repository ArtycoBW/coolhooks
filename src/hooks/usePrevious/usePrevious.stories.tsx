// src/hooks/usePrevious/usePrevious.stories.tsx

import React, { useState } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import classes from './index.module.scss'
import usePrevious from './usePrevious'

const Demo = () => {
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  return (
    <div className={classes.wrapper}>
      <p className={classes.count}>
        Текущее значение: <code>{count}</code>
      </p>
      <p className={classes.previousCount}>
        Предыдущее значение: <code>{previousCount ?? 'Нет предыдущего значения'}</code>
      </p>
      <div className={classes.buttons}>
        <button type="button" onClick={() => setCount(count + 1)} className={classes.button}>
          Увеличить
        </button>
        <button type="button" onClick={() => setCount(count - 1)} className={classes.button}>
          Уменьшить
        </button>
      </div>
    </div>
  )
}

export default {
  title: 'Хуки/usePrevious',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
