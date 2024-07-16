// src/hooks/useCounter/useCounter.stories.tsx

import React, { useState } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import classes from './index.module.scss'
import useNetworkStateSubscribe from './useNetworkStateSubscribe'

const Demo = () => {
  const [networkState, setNetworkState] = useState<string>('online')

  useNetworkStateSubscribe(() => {
    setNetworkState(navigator.onLine ? 'online' : 'offline')
  })

  return (
    <div className={classes.wrapper}>
      <h1 className={classes.title}>Статус сети: {networkState}</h1>
    </div>
  )
}

export default {
  title: 'Хуки/useNetworkStateSubscribe',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
