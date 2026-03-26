import { useState } from 'react'

export default function App() {
  // Roteamento por estado, conforme definido no ProjetoRaquel.md
  const [view, setView] = useState('HomeView')

  return (
    <div>
      <h1>PT Periodização</h1>
      <p>View atual: {view}</p>
      <button onClick={() => setView('TrainerHome')}>Simular Login PT</button>
    </div>
  )
}
