import { createRoot } from 'react-dom/client';
import TresEnRaya from './TresEnRaya';
import './styles.css'

const contenedor = document.querySelector('#root');

const root = createRoot(contenedor!);

root.render(<TresEnRaya />);