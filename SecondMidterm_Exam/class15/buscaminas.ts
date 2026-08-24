/*
 * Buscaminas - clase 15
 * La tabla esta escrita en buscaminas.html y el diseno en buscaminas.css.
 * Aqui TypeScript solo escucha los clics.
 *
 * Para generar buscaminas.js:  tsc buscaminas.ts
 */

// El 💣 del HTML, escrito con su codigo Unicode para que lo reconozca
// igual este puesto como emoji o como la entidad &#128163;
const BOMBA: string = "\u{1F4A3}";

let explotado: boolean = false;

// El DOM nos entrega todas las casillas (td) de la tabla
const casillas = document.querySelectorAll("td");

// Al pisar una bomba, todas las casillas se convierten en una X roja
function explotar(): void {
    explotado = true;

    casillas.forEach(function (casilla) {
        casilla.textContent = "X";
        casilla.style.color = "red";
    });
}

// Le ponemos un clic a cada casilla
casillas.forEach(function (casilla) {
    casilla.addEventListener("click", function () {
        if (explotado) return;

        if (casilla.textContent === BOMBA) {
            explotar();                          // era una bomba
        } else {
            casilla.style.color = "#128163";     // era 😎: se queda destapada
        }
    });
});
