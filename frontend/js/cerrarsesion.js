let segundos = 5;
const contador = document.getElementById("contador");

const intervalo = setInterval(() => {

    segundos--;
    contador.textContent = segundos;

    if (segundos <= 0) {
        clearInterval(intervalo);
        window.location.href = "login.html";
    }

}, 1000);

document.querySelector(".boton-secundario").addEventListener("click", () => {
    clearInterval(intervalo);
});
