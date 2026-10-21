// =====================================================
// INICIO DE SESIÓN
// Los ids (correo, password, btnLogin) se mantienen igual
// porque la prueba de Selenium los usa.
// =====================================================

const formulario = document.getElementById("formularioLogin");
const boton = document.getElementById("btnLogin");
const campoPassword = document.getElementById("password");
const botonVer = document.getElementById("verPassword");
const mensaje = document.getElementById("mensajeError");
const campoCorreo = document.getElementById("correo");
const casillaRecordar = document.getElementById("recordarme");


// Muestra un texto debajo de la contraseña
// tipo = "error" (rojo) o "info" (gris)
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = "sesion-mensaje " + tipo;
}

// Deja el botón como estaba antes de enviar
function restablecerBoton() {
    boton.disabled = false;
    boton.querySelector("span").textContent = "Iniciar sesión";
}


// RECUÉRDAME
// Si la persona lo marcó la vez anterior, se escribe su correo solo.
// Se guarda únicamente el correo (la contraseña NUNCA se guarda).
try {

    const correoGuardado = localStorage.getItem("correoRecordado");

    if (correoGuardado) {
        campoCorreo.value = correoGuardado;
        casillaRecordar.checked = true;
        campoPassword.focus();
    }

} catch (error) {
    // Si el navegador no deja guardar datos, simplemente no se recuerda
}

// Guarda o borra el correo según la casilla
function guardarRecordarme(correo) {

    try {

        if (casillaRecordar.checked) {
            localStorage.setItem("correoRecordado", correo);
        } else {
            localStorage.removeItem("correoRecordado");
        }

    } catch (error) {
        // No pasa nada si no se puede guardar
    }
}


// Ojito: mostrar u ocultar la contraseña
botonVer.addEventListener("click", function () {

    const estaOculta = campoPassword.type === "password";

    campoPassword.type = estaOculta ? "text" : "password";

    botonVer.classList.toggle("activo", estaOculta);

    botonVer.setAttribute(
        "aria-label",
        estaOculta ? "Ocultar contraseña" : "Mostrar contraseña"
    );

});


// Al enviar el formulario (clic en el botón o tecla Enter)
formulario.addEventListener("submit", function (evento) {

    // Evita que la página se recargue
    evento.preventDefault();

    const correo = campoCorreo.value.trim();
    const password = campoPassword.value;

    mostrarMensaje("", "error");

    if (correo === "" || password === "") {
        mostrarMensaje("Escribe tu correo y tu contraseña.", "error");
        return;
    }

    // Mientras se espera la respuesta del servidor
    boton.disabled = true;
    boton.querySelector("span").textContent = "Ingresando...";

    // El servidor de Render a veces tarda en despertar
    const aviso = setTimeout(function () {
        mostrarMensaje("Conectando con el servidor, puede tardar unos segundos...", "info");
    }, 4000);

    fetch("https://citas-medicas-6l2b.onrender.com/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            correo: correo,
            password: password
        })

    })

    .then(respuesta => respuesta.json())

    .then(datos => {

        clearTimeout(aviso);

        if (datos.mensaje === "Inicio de sesión correcto") {

            guardarRecordarme(correo);

            window.location.href = "dashboard.html";

        } else {

            restablecerBoton();
            mostrarMensaje(datos.mensaje, "error");

        }

    })

    .catch(error => {

        clearTimeout(aviso);

        console.log(error);

        restablecerBoton();
        mostrarMensaje("No se pudo conectar con el servidor. Intenta de nuevo.", "error");

    });

});