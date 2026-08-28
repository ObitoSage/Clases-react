import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import KeysExamples from './keysExamples.tsx'
import Contador from './contador.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <KeysExamples />
    <Contador />
  </>
)