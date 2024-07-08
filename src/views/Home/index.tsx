import { useCounter } from '@/hooks/useCounter/useCounter'
import classes from './index.module.scss'

const HomeView = () => {
  const { count, inc, dec, reset, set } = useCounter()

  return (
    <div className={classes.wrapper}>
      <p>
        Count: <code>{count}</code>
      </p>
      <div className={classes.buttons}>
        <button type="button" onClick={() => inc()}>
          Increment
        </button>
        <button type="button" onClick={() => dec()}>
          Decrement
        </button>
        <button type="button" onClick={() => set(5)}>
          Set (5)
        </button>
        <button type="button" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default HomeView
