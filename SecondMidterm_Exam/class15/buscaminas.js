"use strict";
const BOMBA = "\u{1F4A3}";
let explotado = false;

const casillas = document.querySelectorAll("td");

function explotar() {
    explotado = true;
    casillas.forEach(function (casilla) {
        casilla.textContent = "X";
        casilla.style.color = "red";
    });
}

casillas.forEach(function (casilla) {
    casilla.addEventListener("click", function () {
        if (explotado)
            return;
        if (casilla.textContent === BOMBA) {
            explotar();
        }
        else {
            casilla.style.color = "#128163";
        }
    });
});
