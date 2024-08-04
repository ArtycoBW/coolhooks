// src/hooks/useOnDemandPolling/useOnDemandPolling.stories.tsx

import React, { useCallback, useState } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useOnDemandPolling } from './useOnDemandPolling'
import classes from './index.module.scss'

const Demo = () => {
  const [data, setData] = useState<string>('Загрузка...')
  const [interval, setInterval] = useState<number>(5000)
  const [error, setError] = useState<string | null>(null)

  // Симуляция запроса к серверу
  const fetchData = useCallback(async () => {
    try {
      const randomNumber = Math.random() * 100
      console.log(`Полученные данные: ${randomNumber.toFixed(2)}`) // Вывод случайного числа в консоль

      // Симулирование ошибки в 10% случаев
      if (Math.random() < 0.1) {
        throw new Error('Ошибка случайного запроса')
      }

      setData(`Полученные данные: ${randomNumber.toFixed(2)}`) // Обновление состояния данных
      setError(null) // Сброс ошибки при успешном запросе
    } catch (err) {
      setError((err as Error).message) // Установка сообщения об ошибке
      console.error('Ошибка при запросе:', err) // Вывод ошибки в консоль
    }
  }, [])

  // Обработчик ошибок
  const handleError = useCallback((error: Error) => {
    console.error('Ошибка опроса:', error)
    setError(error.message)
  }, [])

  // Использование хука useOnDemandPolling
  const { changeInterval, startPolling, stopPolling } = useOnDemandPolling({
    initialInterval: interval,
    onPoll: fetchData,
    enabled: true,
    maxAttempts: 3,
    onError: handleError,
    immediateStart: true,
  })

  return (
    <div className={classes.wrapper}>
      <p className={classes.info}>
        Данные с сервера: <code>{error ? `Ошибка: ${error}` : data}</code>
      </p>
      <div className={classes.buttons}>
        <button type="button" onClick={() => changeInterval(10000)} className={classes.button}>
          Установить интервал на 10 секунд
        </button>
        <button type="button" onClick={() => changeInterval(3000)} className={classes.button}>
          Установить интервал на 3 секунды
        </button>
        <button type="button" onClick={startPolling} className={classes.button}>
          Начать опрос
        </button>
        <button type="button" onClick={stopPolling} className={classes.button}>
          Остановить опрос
        </button>
      </div>
    </div>
  )
}

export default {
  title: 'Хуки/useOnDemandPolling',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
