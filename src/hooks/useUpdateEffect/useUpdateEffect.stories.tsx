// src/hooks/useUpdateEffect/useUpdateEffect.stories.tsx

import { Meta, StoryFn } from '@storybook/react'
import React, { useState } from 'react'
import { useUpdateEffect } from './useUpdateEffect'
import classes from './index.module.scss'

const Demo = () => {
  const [count, setCount] = useState(0)

  useUpdateEffect(() => {
    console.log('Этот эффект выполнится при изменении count, но не при первом рендере.')

    return () => {
      console.log('Очистка эффекта перед следующим обновлением.')
    }
  }, [count])

  return (
    <div className={classes.wrapper}>
      <p className={classes.count}>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Увеличить</button>
    </div>
  )
}

export default {
  title: 'Хуки/useUpdateEffect',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
