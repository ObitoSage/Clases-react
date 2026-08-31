import { useState, type CSSProperties } from "react";

type marca = 'X' | 'O';
type celda = marca | null;
type tablero = celda[];

const tableroInicial: tablero = Array<celda>(9).fill(null);

export const TresEnRaya = () => {
    const [tablero, setTablero] = useState<tablero>(tableroInicial);
    const [turno, setTurno] = useState<marca>('X');

    const marcarCelda = (indice: number): void => {
        if (tablero[indice] !== null) {
            return;
        }
        setTablero(tablero.map((celda, posicion) => {
            return posicion === indice ? turno : celda;
        }));
        setTurno(turno === 'X' ? 'O' : 'X');
    };




    return (
        <div style={styles.container}>
            <h2 style={styles.titulo}>Turno actual: {turno}</h2>
            <table style={styles.tabla}>
                <tbody>
                    {[0, 1, 2].map((fila) => {
                        return (
                            <tr key={fila}>
                                {tablero.slice(fila * 3, fila * 3 + 3).map((celda, columna) => {
                                    const indice = fila * 3 + columna;
                                    return (
                                        <td
                                            key={columna}
                                            style={styles.celda}
                                            onClick={() => marcarCelda(indice)}
                                        >
                                            {celda}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};




const styles: { [key: string]: CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '50px',
    },
    titulo: {
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    tabla: {
        borderCollapse: 'collapse',
        margin: '0 auto',
    },
    celda: {
        width: '90px',
        height: '90px',
        border: '3px solid #646cff',
        textAlign: 'center',
        fontSize: '40px',
        fontWeight: 'bold',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'background-color 0.2s',
    },
};

