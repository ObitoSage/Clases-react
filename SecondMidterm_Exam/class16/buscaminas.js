"use strict";
let elementList = document.querySelectorAll("td");
for (const element of elementList) {
    element.addEventListener("click", function () {
        console.log(element.textContent);
        console.log("--");
        if (element.classList.contains("mine")) {
            for (const item of elementList) {
                item.textContent = "💣";
            }
        }
    });
}
