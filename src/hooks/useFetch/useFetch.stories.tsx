// src/hooks/useFetch/useFetch.stories.tsx

import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import classes from './index.module.scss'
import useFetch from './useFetch'

interface User {
  name: {
    first: string
    last: string
  }
  email: string
  picture: {
    large: string
  }
}

const Demo = () => {
  const { data, error, loading, refetch } = useFetch<{ results: User[] }>('https://randomuser.me/api/')

  if (loading)
    return (
      <div className={classes.wrapper}>
        <p className={classes.info}>Загрузка...</p>
      </div>
    )

  if (error)
    return (
      <div className={classes.wrapper}>
        <p className={classes.info}>Ошибка: {error.message}</p>
      </div>
    )

  const { name, email, picture } = data?.results[0] ?? {}

  return (
    <div className={classes.wrapper}>
      <img src={picture?.large} alt={`${name?.first} ${name?.last}`} />
      <h1 className={classes.info}>
        {name?.first} {name?.last}
      </h1>
      <p className={classes.email}>{email}</p>
      <button onClick={refetch}>Обновить данные</button>
    </div>
  )
}

export default {
  title: 'Хуки/useFetch',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
