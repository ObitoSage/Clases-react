import { createRoot } from 'react-dom/client'
import Reloj from './reloj';
import './styles.css';
import SpaceInvaders from './spaceInvaders';

createRoot(document.getElementById('root')!).render(
  <div className='contenedor'>
    <Reloj />
    <SpaceInvaders />
  </div>
)