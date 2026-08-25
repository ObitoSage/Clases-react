
const BOMBA: string = "\u{1F4A3}";

let explotado: boolean = false;


const casillas = document.querySelectorAll("td");


function explotar(): void {
    explotado = true;

    casillas.forEach(function (casilla) {
        casilla.textContent = "X";
        casilla.style.color = "red";
    });
}

casillas.forEach(function (casilla) {
    casilla.addEventListener("click", function () {
        if (explotado) return;

        if (casilla.textContent === BOMBA) {
            explotar();
        } else {
            casilla.style.color = "#128163";
        }
    });
});
