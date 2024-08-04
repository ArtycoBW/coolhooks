// src/hooks/useWebSocket/useWebSocket.stories.tsx

import React, { useState, useEffect } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useWebSocket } from './useWebSocket'
import classes from './index.module.scss'

const Demo = () => {
  const [message, setMessage] = useState<string>('Ожидание сообщения...')
  const [error, setError] = useState<string | null>(null)
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0)

  const {
    status,
    sendMessage,
    closeConnection,
    reconnect,
    message: wsMessage,
    error: wsError,
  } = useWebSocket('ws://localhost:8080', {
    shouldReconnect: true,
    reconnectInterval: 5000,
    maxReconnectAttempts: 5,
    protocols: undefined, // Или конкретные протоколы, если нужны
  })

  useEffect(() => {
    if (wsMessage) {
      setMessage(`Получено сообщение: ${wsMessage}`)
    }
  }, [wsMessage])

  useEffect(() => {
    if (wsError) {
      setError(`Ошибка WebSocket: ${(wsError as ErrorEvent).message}`)
    }
  }, [wsError])

  // Обработчик попыток переподключения
  useEffect(() => {
    if (status === 'CONNECTING') {
      setReconnectAttempts((prev) => prev + 1)
    }
  }, [status])

  return (
    <div className={classes.wrapper}>
      <p className={classes.info}>
        Статус WebSocket: <code>{status}</code>
      </p>
      <p className={classes.info}>{error ? <code>{error}</code> : message}</p>
      <p className={classes.info}>
        Попытки подключения: <code>{reconnectAttempts}</code>
      </p>
      <div className={classes.buttons}>
        <button type="button" onClick={() => sendMessage('Привет, сервер!')} className={classes.button}>
          Отправить сообщение
        </button>
        <button type="button" onClick={() => sendMessage('Ещё одно сообщение')} className={classes.button}>
          Отправить ещё одно сообщение
        </button>
        <button type="button" onClick={closeConnection} className={classes.button}>
          Закрыть соединение
        </button>
        <button type="button" onClick={reconnect} className={classes.button}>
          Повторное подключение
        </button>
        <button type="button" onClick={() => window.location.reload()} className={classes.button}>
          Перезагрузить страницу
        </button>
      </div>
    </div>
  )
}

export default {
  title: 'Хуки/useWebSocket',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
