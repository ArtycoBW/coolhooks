import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useToggle } from './useToggle'
import classes from './index.module.scss'

const Demo = () => {
  const [value, toggle] = useToggle(['blue', 'orange', 'black', 'teal', 'purple', 'red'] as const)

  return (
    <div className={classes.wrapper}>
      <button type="button" onClick={() => toggle()} className={classes.button} style={{ backgroundColor: value }}>
        {value}
      </button>
    </div>
  )
}

export default {
  title: 'Хуки/useToggle',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
