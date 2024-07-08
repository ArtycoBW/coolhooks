import { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import Routes from './routes'

function App() {
  useEffect(() => {
    const onSendMessage = () => {
      window.parent.postMessage({ message: 'READY' })
    }
    onSendMessage()
  }, [])

  return (
    <Router>
      <Routes />
    </Router>
  )
}

export default App
