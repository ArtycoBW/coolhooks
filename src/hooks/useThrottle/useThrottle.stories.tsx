// src/hooks/useThrottle/useThrottle.stories.tsx

import React, { useState } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import classes from './index.module.scss'
import { useThrottle } from './useThrottle'

const Demo = () => {
  const [count, setCount] = useState(0)

  const increment = useThrottle(() => {
    setCount((prevCount) => prevCount + 1)
  }, 2000) // Увеличиваем счетчик не чаще, чем один раз в 2 секунды

  return (
    <div className={classes.wrapper}>
      <p className={classes.count}>Кол-во: {count}</p>
      <button onClick={increment} className={classes.button}>
        Инкремент
      </button>
    </div>
  )
}

export default {
  title: 'Хуки/useThrottle',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
