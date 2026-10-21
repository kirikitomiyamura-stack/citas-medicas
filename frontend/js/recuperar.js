// =====================================================
// RECUPERAR CONTRASEÑA
// =====================================================

const formulario = document.getElementById("formularioRecuperar");
const boton = document.getElementById("btnEnviar");
const mensaje = document.getElementById("mensajeRecuperar");
const pasoCorreo = document.getElementById("pasoCorreo");
const pasoConfirmacion = document.getElementById("pasoConfirmacion");


// Muestra un texto debajo del campo
// tipo = "error" (rojo) o "info" (gris)
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = "sesion-mensaje " + tipo;
}

function restablecerBoton() {
    boton.disabled = false;
    boton.querySelector("span").textContent = "Enviar enlace de recuperación";
}

function mostrarConfirmacion(correo) {
    document.getElementById("correoConfirmado").textContent = correo;
    pasoCorreo.classList.add("oculto");
    pasoConfirmacion.classList.remove("oculto");
}


// Al enviar el formulario (botón o tecla Enter)
formulario.addEventListener("submit", function (evento) {

    // Evita que la página se recargue
    evento.preventDefault();

    const correo = document.getElementById("correoRecuperar").value.trim();

    mostrarMensaje("", "error");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        mostrarMensaje("Ingresa un correo electrónico válido.", "error");
        return;
    }

    boton.disabled = true;
    boton.querySelector("span").textContent = "Enviando...";

    // El servidor de Render a veces tarda en despertar
    const aviso = setTimeout(function () {
        mostrarMensaje("Conectando con el servidor, puede tardar unos segundos...", "info");
    }, 4000);

    fetch("https://citas-medicas-6l2b.onrender.com/recuperar", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ correo: correo })

    })
    .then(() => {

        clearTimeout(aviso);

        // Sea cual sea la respuesta del servidor, se muestra el mismo mensaje:
        // por seguridad no revelamos si el correo existe o no en el sistema.
        mostrarConfirmacion(correo);

    })
    .catch(error => {

        // Aquí solo se llega si NO hubo conexión con el servidor
        clearTimeout(aviso);

        console.log(error);

        restablecerBoton();
        mostrarMensaje("No se pudo conectar con el servidor. Intenta de nuevo.", "error");

    });

});