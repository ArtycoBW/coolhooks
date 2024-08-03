// src/hooks/useDocumentTitle/useDocumentTitle.stories.tsx

import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useDocumentTitle } from './useDocumentTitle'
import classes from './index.module.scss'

const Demo = () => {
  const [title, setTitle] = useDocumentTitle('Cool Hooks')

  return (
    <div className={classes.wrapper}>
      <p className={classes.title}>Заголовок: {title}</p>
      <input defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
    </div>
  )
}

export default {
  title: 'Хуки/useDocumentTitle',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
