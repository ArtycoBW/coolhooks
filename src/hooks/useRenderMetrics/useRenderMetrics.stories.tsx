// src/hooks/useDocumentTitle/useDocumentTitle.stories.tsx

import React, { useState } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import classes from './index.module.scss'
import useRenderMetrics from './useRenderMetrics'

const Demo = () => {
  const [count, setCount] = useState<number>(0)
  const renderMetrics = useRenderMetrics('Счётчик')

  const handleClick = () => {
    setCount((prevCount) => prevCount + 1)
  }

  return (
    <div className={classes.wrapper}>
      <p className={classes.title}>Счетчик: {count}</p>
      <button onClick={handleClick} className={classes.button}>
        Увеличить счетчик
      </button>
      {renderMetrics && (
        <div className={classes.metrics}>
          <h2 className={classes.title}>Метрики рендеров:</h2>
          <p>
            Имя: <span>{renderMetrics.name}</span>
          </p>
          <p>
            Количество рендеров: <span>{renderMetrics.renders}</span>
          </p>
          <p>
            Время с последнего рендера: <span>{renderMetrics.sinceLastRender} секунд</span>
          </p>
          <p>
            Временная метка: <span>{renderMetrics.timestamp}</span>
          </p>
          {renderMetrics.memoryUsage && (
            <p>
              Использование памяти: <span>{renderMetrics.memoryUsage}</span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default {
  title: 'Хуки/useRenderMetrics',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
