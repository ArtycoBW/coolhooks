// src/hooks/useDebounce/useDebounce.stories.tsx

import React, { useState } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import useDebounce from './useDebounce'
import classes from './index.module.scss'

const Demo = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const handleSearch = useDebounce((value: string) => {
    setDebouncedSearchTerm(value)
    console.log('Поиск:', value)
  }, 1000)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    handleSearch(event.target.value)
  }

  return (
    <div className={classes.wrapper}>
      <input type="text" value={searchTerm} onChange={handleChange} placeholder="Поиск..." />
      <p className={classes.result}>
        Отложенный поиск: <code>{debouncedSearchTerm}</code>
      </p>
    </div>
  )
}

export default {
  title: 'Хуки/useDebounce',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
