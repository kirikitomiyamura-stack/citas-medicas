// =====================================================
// REGISTRO
// Crea una cuenta nueva llamando a /registro del backend.
// =====================================================

const formulario = document.getElementById("formularioRegistro");
const boton = document.getElementById("btnRegistro");
const mensaje = document.getElementById("mensajeRegistro");

const campoNombre = document.getElementById("nombreRegistro");
const campoCorreo = document.getElementById("correoRegistro");
const campoRol = document.getElementById("rolRegistro");
const campoPassword = document.getElementById("passwordRegistro");
const campoConfirmar = document.getElementById("confirmarPassword");

const barras = document.querySelectorAll(".fuerza-barra span");
const textoFuerza = document.getElementById("textoFuerza");


// Muestra un texto debajo de los campos
// tipo = "error" (rojo) o "info" (gris)
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = "sesion-mensaje " + tipo;
}

function restablecerBoton() {
    boton.disabled = false;
    boton.querySelector("span").textContent = "Crear cuenta";
}


// Ojitos: mostrar u ocultar cada contraseña
document.querySelectorAll(".ver-clave").forEach(function (botonOjo) {

    botonOjo.addEventListener("click", function () {

        const campo = document.getElementById(botonOjo.dataset.objetivo);

        const estaOculta = campo.type === "password";

        campo.type = estaOculta ? "text" : "password";

        botonOjo.classList.toggle("activo", estaOculta);

        botonOjo.setAttribute(
            "aria-label",
            estaOculta ? "Ocultar contraseña" : "Mostrar contraseña"
        );

    });

});


// Calcula qué tan fuerte es una contraseña (de 0 a 4 barras)
function evaluarPassword(texto) {

    if (texto.length === 0) {
        return { puntos: 0, mensaje: "Usa al menos 8 caracteres" };
    }

    if (texto.length < 8) {
        return { puntos: 1, mensaje: "Muy corta: mínimo 8 caracteres" };
    }

    let puntos = 1;

    if (/[a-z]/.test(texto) && /[A-Z]/.test(texto)) puntos++;   // mayúsculas y minúsculas
    if (/\d/.test(texto)) puntos++;                              // números
    if (/[^A-Za-z0-9]/.test(texto)) puntos++;                    // símbolos

    const nombres = ["", "Débil", "Aceptable", "Buena", "Fuerte"];

    return { puntos: puntos, mensaje: nombres[puntos] };
}

// Cada vez que escribe, se pintan las barras
campoPassword.addEventListener("input", function () {

    const resultado = evaluarPassword(campoPassword.value);

    barras.forEach(function (barra, i) {
        barra.className = i < resultado.puntos ? "nivel" + resultado.puntos : "";
    });

    textoFuerza.textContent = resultado.mensaje;

});


// Al enviar el formulario (botón o tecla Enter)
formulario.addEventListener("submit", function (evento) {

    // Evita que la página se recargue
    evento.preventDefault();

    const nombre = campoNombre.value.trim();
    const correo = campoCorreo.value.trim();
    const rol = campoRol.value;
    const password = campoPassword.value;

    mostrarMensaje("", "error");

    // ---------- Validaciones ----------

    if (nombre.length < 3) {
        mostrarMensaje("Escribe tu nombre completo.", "error");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        mostrarMensaje("Escribe un correo válido.", "error");
        return;
    }

    if (rol === "") {
        mostrarMensaje("Elige tu rol.", "error");
        return;
    }

    if (password.length < 8) {
        mostrarMensaje("La contraseña debe tener al menos 8 caracteres.", "error");
        return;
    }

    if (password !== campoConfirmar.value) {
        mostrarMensaje("Las contraseñas no coinciden.", "error");
        return;
    }

    // ---------- Enviar al servidor ----------

    boton.disabled = true;
    boton.querySelector("span").textContent = "Creando cuenta...";

    // El servidor de Render a veces tarda en despertar
    const aviso = setTimeout(function () {
        mostrarMensaje("Conectando con el servidor, puede tardar unos segundos...", "info");
    }, 4000);

    fetch("https://citas-medicas-6l2b.onrender.com/registro", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            nombre: nombre,
            correo: correo,
            password: password,
            rol: rol
        })

    })

    .then(respuesta => respuesta.json().then(datos => ({ ok: respuesta.ok, datos: datos })))

    .then(resultado => {

        clearTimeout(aviso);

        if (resultado.ok) {

            // Se oculta el formulario y se muestra el mensaje de éxito
            document.getElementById("correoCreado").textContent = correo;
            document.getElementById("pasoFormulario").classList.add("oculto");
            document.getElementById("pasoExito").classList.remove("oculto");

        } else {

            restablecerBoton();
            mostrarMensaje(resultado.datos.mensaje || "No se pudo crear la cuenta.", "error");

        }

    })

    .catch(error => {

        clearTimeout(aviso);

        console.log(error);

        restablecerBoton();
        mostrarMensaje("No se pudo conectar con el servidor. Intenta de nuevo.", "error");

    });

});