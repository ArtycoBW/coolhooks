import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './routes'
import { useEffect, useState } from 'react'
import { LocalStorageKey, setLocalStorageString } from 'common/helpers/localstorage'

function App() {
  // const { token } = 'qwe'
  // const [appTheme, setAppTheme] = useState('light')

  useEffect(() => {
    const onSendMessage = () => {
      window.parent.postMessage({ message: 'READY' })
    }
    onSendMessage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   window.addEventListener(
  //     'message',
  //     ({ data: { theme, token } }) => {
  //       if (theme) setAppTheme(theme)
  //       if (token) setLocalStorageString(LocalStorageKey.TOKEN, token)
  //     },
  //     false,
  //   )
  // }, [])

  return (
    <Router>
      <Routes />
    </Router>
  )
}

export default App
