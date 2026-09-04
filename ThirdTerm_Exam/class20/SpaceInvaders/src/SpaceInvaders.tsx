import { useEffect, useState } from "react";

type Bloque = {
    x: number
    y: number
}

const PROPORCION_BLOQUE = 0.07
const PROPORCION_PROYECTIL = PROPORCION_BLOQUE / 2
const NUMERO_EXTRATERRESTRES = 5
const PROPORCION_PASO_BASE = 0.03

function obtenerAnchoJuego() {
    const contenedor = document.getElementById('root')
    return contenedor ? contenedor.clientWidth : window.innerWidth
}

function obtenerAltoJuego() {
    return window.innerHeight
}

function obtenerAltoBase() {
    const base = document.querySelector<HTMLDivElement>('.base-jugador')
    return base ? base.clientHeight : obtenerAltoJuego() * 0.06
}

function obtenerAnchoBase() {
    const base = document.querySelector<HTMLDivElement>('.base-jugador')
    return base ? base.clientWidth : obtenerAnchoJuego() * 0.14
}

function obtenerTamanoBloque(alto: number) {
    return alto * PROPORCION_BLOQUE
}

function obtenerTamanoProyectil(alto: number) {
    return alto * PROPORCION_PROYECTIL
}

function crearFilaDeExtraterrestres(ancho: number, alto: number): Array<Bloque> {
    const tamanoBloque = obtenerTamanoBloque(alto)
    const espacio = (ancho - tamanoBloque * NUMERO_EXTRATERRESTRES) / (NUMERO_EXTRATERRESTRES + 1)

    return Array.from({ length: NUMERO_EXTRATERRESTRES }, (_, indice) => ({
        x: espacio + indice * (tamanoBloque + espacio),
        y: 0
    }))
}

function SpaceInvaders() {
    const [anchoJuego, setAnchoJuego] = useState<number>(obtenerAnchoJuego)
    const [altoJuego, setAltoJuego] = useState<number>(obtenerAltoJuego)
    const [altoBase, setAltoBase] = useState<number>(obtenerAltoBase)
    const [anchoBase, setAnchoBase] = useState<number>(obtenerAnchoBase)

    const [posicionBase, setPosicionBase] = useState<number>(
        () => (obtenerAnchoJuego() - obtenerAnchoBase()) / 2
    )

    const [proyectiles, setProyectiles] = useState<Array<Bloque>>([])

    const [extraterrestres, setExtraterrestres] = useState<Array<Bloque>>(
        () => crearFilaDeExtraterrestres(obtenerAnchoJuego(), obtenerAltoJuego())
    )

    const tamanoBloque = obtenerTamanoBloque(altoJuego)
    const tamanoProyectil = obtenerTamanoProyectil(altoJuego)

    useEffect(() => {
        const actualizarDimensiones = () => {
            const nuevoAncho = obtenerAnchoJuego()
            const nuevoAlto = obtenerAltoJuego()
            const nuevoAltoBase = obtenerAltoBase()
            const nuevoAnchoBase = obtenerAnchoBase()
            const nuevoTamanoBloque = obtenerTamanoBloque(nuevoAlto)

            setAnchoJuego(nuevoAncho)
            setAltoJuego(nuevoAlto)
            setAltoBase(nuevoAltoBase)
            setAnchoBase(nuevoAnchoBase)

            setPosicionBase((anterior) =>
                Math.min(Math.max(anterior, 0), Math.max(nuevoAncho - nuevoAnchoBase, 0))
            )

            setExtraterrestres((anteriores) =>
                anteriores.map((bloque) => ({
                    ...bloque,
                    x: Math.min(Math.max(bloque.x, 0), Math.max(nuevoAncho - nuevoTamanoBloque, 0))
                }))
            )
        }

        actualizarDimensiones()
        window.addEventListener('resize', actualizarDimensiones)

        return () => {
            window.removeEventListener('resize', actualizarDimensiones)
        }
    }, []);

    useEffect(() => {
        const pasoBase = anchoJuego * PROPORCION_PASO_BASE

        const manejarTecla = (evento: KeyboardEvent) => {
            if (evento.key === 'ArrowLeft') {
                evento.preventDefault()
                setPosicionBase((anterior) => Math.max(anterior - pasoBase, 0))
                return
            }

            if (evento.key === 'ArrowRight') {
                evento.preventDefault()
                setPosicionBase((anterior) => Math.min(anterior + pasoBase, anchoJuego - anchoBase))
                return
            }

            // Disparar con ESPACIO
            if (evento.key === ' ' && !evento.repeat) {
                evento.preventDefault()
                setProyectiles((anteriores) => [
                    ...anteriores,
                    { x: posicionBase + anchoBase / 2 - tamanoProyectil / 2, y: altoBase }
                ])
            }
        }

        window.addEventListener('keydown', manejarTecla)

        return () => {
            window.removeEventListener('keydown', manejarTecla)
        }
    }, [anchoJuego, anchoBase, altoBase, tamanoProyectil, posicionBase])

    useEffect(() => {
        const pasoProyectil = obtenerTamanoBloque(altoJuego)
        const alturaMaximaProyectil = altoJuego - tamanoProyectil

        const identificadorIntervalo: number = setInterval(() => {
            setProyectiles((anteriores) =>
                anteriores
                    .map((proyectil) => ({ ...proyectil, y: proyectil.y + pasoProyectil }))
                    .filter((proyectil) => proyectil.y < alturaMaximaProyectil)
            )
        }, 1000)

        return () => {
            clearInterval(identificadorIntervalo)
        }
    }, [altoJuego, tamanoProyectil])

    useEffect(() => {
        const pasoAlien = obtenerTamanoBloque(altoJuego)
        const alturaMaximaAlien = altoJuego - altoBase - pasoAlien

        const identificadorIntervalo: number = setInterval(() => {
            setExtraterrestres((anteriores) =>
                anteriores.map((bloque) => {
                    const pasoAleatorio = (Math.floor(Math.random() * 3) - 1) * pasoAlien
                    const siguienteX = Math.min(Math.max(bloque.x + pasoAleatorio, 0), anchoJuego - pasoAlien)
                    const siguienteY = bloque.y + pasoAlien

                    return { ...bloque, x: siguienteX, y: siguienteY >= alturaMaximaAlien ? 0 : siguienteY }
                })
            )
        }, 1000)

        return () => {
            clearInterval(identificadorIntervalo)
        }
    }, [altoJuego, altoBase, anchoJuego])

    useEffect(() => {
        if (proyectiles.length === 0) {
            return
        }

        const extraterrestresImpactados = new Set<number>()
        const proyectilesUsados = new Set<number>()

        extraterrestres.forEach((alien, indiceAlien) => {
            const alienYDesdeAbajo = altoJuego - alien.y - tamanoBloque

            proyectiles.forEach((proyectil, indiceProyectil) => {
                if (proyectilesUsados.has(indiceProyectil)) {
                    return
                }

                const impacto =
                    Math.abs(alien.x - proyectil.x) < tamanoBloque &&
                    Math.abs(alienYDesdeAbajo - proyectil.y) < tamanoBloque

                if (impacto) {
                    extraterrestresImpactados.add(indiceAlien)
                    proyectilesUsados.add(indiceProyectil)
                }
            })
        })

        if (extraterrestresImpactados.size === 0) {
            return
        }
        setExtraterrestres((anteriores) =>
            anteriores.filter((_, indice) => !extraterrestresImpactados.has(indice))
        )

        setProyectiles((anteriores) =>
            anteriores.filter((_, indice) => !proyectilesUsados.has(indice))
        )
    }, [proyectiles, extraterrestres, altoJuego, tamanoBloque])

    return (
        <>
            {/* Nave del jugador — sin texto */}
            <div className="base-jugador" style={{ left: `${posicionBase}px` }} />

            {/* Proyectiles */}
            {proyectiles.map((proyectil, indice) => (
                <div key={indice} style={{
                    position: 'absolute',
                    width: `${tamanoProyectil}px`,
                    height: `${tamanoProyectil * 2.5}px`,
                    left: `${proyectil.x}px`,
                    bottom: `${proyectil.y}px`,
                    background: 'linear-gradient(to top, #facc15, #fde68a)',
                    borderRadius: '3px',
                    boxShadow: '0 0 8px #facc15'
                }} />
            ))}

            {/* Extraterrestres — solo color, sin texto */}
            {extraterrestres.map((bloque, indice) => (
                <div key={indice} style={{
                    position: 'absolute',
                    width: `${tamanoBloque}px`,
                    height: `${tamanoBloque}px`,
                    left: `${bloque.x}px`,
                    top: `${bloque.y}px`,
                    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                    borderRadius: '6px',
                    boxShadow: '0 0 12px #a855f7'
                }} />
            ))}
        </>
    );
}

export default SpaceInvaders;