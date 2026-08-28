import { createRoot } from 'react-dom/client'
import './index.css'
import KeysExamples from './keysExamples.tsx'
import Contador from './contador.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <KeysExamples />
    <Contador />
  </>
)