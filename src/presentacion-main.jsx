import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PresentationApp from './presentacion.jsx'

createRoot(document.getElementById('presentation-root')).render(
  <StrictMode>
    <PresentationApp />
  </StrictMode>
)
