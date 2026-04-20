import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from './assets/vite.svg'
import { Tutor } from './pages/Tutor.jsx'
import heroImg from './assets/hero.png'
import './app.css'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Tutor />
    </>
  )
}
