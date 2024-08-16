// src/hooks/useHover/useHover.stories.tsx

import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import useHover from './useHover'
import classes from './index.module.scss'

const Demo = () => {
  const { isHovered, ref } = useHover<HTMLDivElement>({
    initialIsHovered: false,
    useMouseEnter: true,
    useMouseLeave: true,
  })

  return (
    <div className={classes.wrapper}>
      <div ref={ref} className={`${classes.hoverBox} ${isHovered ? classes.hovered : ''}`}>
        <p className={classes.text}>{isHovered ? 'Мышь над элементом' : 'Мышь не над элементом'}</p>
      </div>
    </div>
  )
}

export default {
  title: 'Хуки/useHover',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
