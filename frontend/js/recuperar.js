const boton = document.getElementById("btnEnviar");
const pasoCorreo = document.getElementById("pasoCorreo");
const pasoConfirmacion = document.getElementById("pasoConfirmacion");

boton.addEventListener("click", function () {

    const correo = document.getElementById("correoRecuperar").value.trim();

    if (correo === "" || !correo.includes("@")) {
        alert("Ingresa un correo electrónico válido");
        return;
    }

    fetch("http://localhost:3000/recuperar-password", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ correo: correo })

    })
    .then(respuesta => respuesta.json())
    .then(() => {
        mostrarConfirmacion();
    })
    .catch(error => {
        // Aunque falle la conexión, mostramos el mismo mensaje:
        // por seguridad no revelamos si el correo existe o no en el sistema.
        console.log(error);
        mostrarConfirmacion();
    });

});

function mostrarConfirmacion() {
    pasoCorreo.classList.add("oculto");
    pasoConfirmacion.classList.remove("oculto");
}