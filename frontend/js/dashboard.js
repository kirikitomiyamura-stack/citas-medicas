// =====================================================
// DATOS DE EJEMPLO
// Cuando el backend esté listo, estos arreglos se
// reemplazan por datos que lleguen con fetch().
// =====================================================

const pacientes = [
    { nombre: "Juan Pérez",  documento: "123456789" },
    { nombre: "María Gómez", documento: "987654321" }
];

const especialidades = ["Medicina general", "Pediatría", "Cardiología"];

const medicos = [
    { id: 1, nombre: "Dr. Juan Pérez",   especialidad: "Cardiología",      consultorio: 1 },
    { id: 2, nombre: "Dra. María Gómez", especialidad: "Pediatría",        consultorio: 2 },
    { id: 3, nombre: "Dr. Luis Herrera", especialidad: "Medicina general", consultorio: 3 }
];

const horas = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];

// Citas que ya están tomadas. Cada texto tiene: id del médico | fecha | hora
const citasOcupadas = [
    "2|2026-10-08|08:30",
    "2|2026-10-08|10:30",
    "1|2026-10-08|09:30"
];


// =====================================================
// LO QUE VA ELIGIENDO LA PERSONA
// Empiezan vacías y se llenan al hacer clic.
// =====================================================

let especialidadElegida = "";
let medicoElegido = null;     // aquí se guarda el objeto completo del médico
let diaElegido = "";          // formato 2026-10-08
let diaTexto = "";            // formato "jueves, 8 de octubre"
let horaElegida = "";


// =====================================================
// ELEMENTOS DEL HTML QUE VOY A USAR
// =====================================================

const selectPaciente = document.getElementById("paciente");
const listaEspecialidades = document.getElementById("listaEspecialidades");
const listaMedicos = document.getElementById("listaMedicos");
const listaDias = document.getElementById("listaDias");
const listaHoras = document.getElementById("listaHoras");
const mensaje = document.getElementById("mensaje");


// =====================================================
// 1. PACIENTES (el select)
// =====================================================

function cargarPacientes() {
    for (let i = 0; i < pacientes.length; i++) {
        const opcion = document.createElement("option");
        opcion.value = pacientes[i].nombre;
        opcion.textContent = pacientes[i].nombre + " · " + pacientes[i].documento;
        selectPaciente.appendChild(opcion);
    }
}


// =====================================================
// 2. ESPECIALIDADES (botones redondos)
// =====================================================

function mostrarEspecialidades() {
    listaEspecialidades.innerHTML = "";

    for (let i = 0; i < especialidades.length; i++) {
        const nombre = especialidades[i];

        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = nombre;

        // si es la elegida, le pongo la clase "elegido" para que se pinte azul
        if (nombre === especialidadElegida) {
            boton.classList.add("elegido");
        }

        boton.addEventListener("click", function () {
            especialidadElegida = nombre;

            // al cambiar de especialidad se borra lo que dependía de ella
            medicoElegido = null;
            horaElegida = "";

            mostrarEspecialidades();
            mostrarMedicos();
            mostrarHoras();
            actualizarResumen();
        });

        listaEspecialidades.appendChild(boton);
    }
}


// =====================================================
// 3. MÉDICOS (solo los de la especialidad elegida)
// =====================================================

function mostrarMedicos() {
    listaMedicos.innerHTML = "";

    if (especialidadElegida === "") {
        listaMedicos.innerHTML = '<p class="ayuda">Primero elige una especialidad.</p>';
        return;
    }

    let hayMedicos = false;

    for (let i = 0; i < medicos.length; i++) {
        const medico = medicos[i];

        // me salto los que no son de esa especialidad
        if (medico.especialidad !== especialidadElegida) {
            continue;
        }

        hayMedicos = true;

        const tarjeta = document.createElement("button");
        tarjeta.type = "button";
        tarjeta.className = "medico";

        if (medicoElegido !== null && medicoElegido.id === medico.id) {
            tarjeta.classList.add("elegido");
        }

        // las iniciales: primera letra del nombre sin "Dr." ni "Dra."
        const partes = medico.nombre.split(" ");
        const iniciales = partes[1][0] + partes[2][0];

        tarjeta.innerHTML =
            '<span class="iniciales">' + iniciales + '</span>' +
            '<span><b>' + medico.nombre + '</b>' +
            '<small>' + medico.especialidad + ' · Consultorio ' + medico.consultorio + '</small></span>';

        tarjeta.addEventListener("click", function () {
            medicoElegido = medico;
            horaElegida = "";

            mostrarMedicos();
            mostrarHoras();
            actualizarResumen();
        });

        listaMedicos.appendChild(tarjeta);
    }

    if (hayMedicos === false) {
        listaMedicos.innerHTML = '<p class="ayuda">No hay médicos en esta especialidad.</p>';
    }
}


// =====================================================
// 4. DÍAS (los próximos 4 días, sin domingos)
// =====================================================

// Convierte una fecha en texto 2026-10-08
function fechaATexto(fecha) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");   // los meses empiezan en 0
    const dia = String(fecha.getDate()).padStart(2, "0");
    return anio + "-" + mes + "-" + dia;
}

function mostrarDias() {
    listaDias.innerHTML = "";

    const fecha = new Date();
    let cuantos = 0;

    while (cuantos < 4) {

        // getDay() devuelve 0 si es domingo: ese día no se atiende
        if (fecha.getDay() !== 0) {

            // copio la fecha para que cada botón guarde la suya
            const fechaBoton = new Date(fecha);
            const valor = fechaATexto(fechaBoton);

            const boton = document.createElement("button");
            boton.type = "button";
            boton.textContent = fechaBoton.toLocaleDateString("es-CO", { weekday: "short", day: "numeric" });

            if (valor === diaElegido) {
                boton.classList.add("elegido");
            }

            boton.addEventListener("click", function () {
                diaElegido = valor;
                diaTexto = fechaBoton.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
                horaElegida = "";

                mostrarDias();
                mostrarHoras();
                actualizarResumen();
            });

            listaDias.appendChild(boton);
            cuantos++;
        }

        // paso al día siguiente
        fecha.setDate(fecha.getDate() + 1);
    }
}


// =====================================================
// 5. HORAS
// =====================================================

function mostrarHoras() {
    listaHoras.innerHTML = "";

    if (medicoElegido === null) {
        listaHoras.innerHTML = '<p class="ayuda">Primero elige un médico.</p>';
        return;
    }

    if (diaElegido === "") {
        listaHoras.innerHTML = '<p class="ayuda">Ahora elige un día.</p>';
        return;
    }

    for (let i = 0; i < horas.length; i++) {
        const hora = horas[i];
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = hora;

        // armo el texto igual que los de la lista citasOcupadas
        const clave = medicoElegido.id + "|" + diaElegido + "|" + hora;

        if (citasOcupadas.includes(clave)) {
            boton.classList.add("ocupada");
            boton.disabled = true;          // no se puede hacer clic
        }

        if (hora === horaElegida) {
            boton.classList.add("elegido");
        }

        boton.addEventListener("click", function () {
            horaElegida = hora;
            mostrarHoras();
            actualizarResumen();
        });

        listaHoras.appendChild(boton);
    }
}


// =====================================================
// 6. RESUMEN Y PASOS
// =====================================================

// Si hay un valor lo muestra, si no, muestra una raya
function textoONada(valor) {
    if (valor === "" || valor === null) {
        return "—";
    }
    return valor;
}

function actualizarResumen() {
    document.getElementById("resPaciente").textContent = selectPaciente.value;
    document.getElementById("resEspecialidad").textContent = textoONada(especialidadElegida);
    document.getElementById("resFecha").textContent = textoONada(diaTexto);
    document.getElementById("resHora").textContent = textoONada(horaElegida);

    if (medicoElegido === null) {
        document.getElementById("resMedico").textContent = "—";
        document.getElementById("resConsultorio").textContent = "—";
    } else {
        document.getElementById("resMedico").textContent = medicoElegido.nombre;
        document.getElementById("resConsultorio").textContent = medicoElegido.consultorio;
    }

    mensaje.textContent = "";
    mensaje.className = "";

    actualizarPasos();
}

// Pinta los pasos de arriba según lo que ya se eligió
function actualizarPasos() {
    const paso1 = document.getElementById("paso1");
    const paso2 = document.getElementById("paso2");
    const paso3 = document.getElementById("paso3");

    // primero les quito todo
    paso1.className = "paso";
    paso2.className = "paso";
    paso3.className = "paso";

    if (especialidadElegida === "") {
        paso1.classList.add("actual");
    } else if (medicoElegido === null || diaElegido === "" || horaElegida === "") {
        paso1.classList.add("hecho");
        paso2.classList.add("actual");
    } else {
        paso1.classList.add("hecho");
        paso2.classList.add("hecho");
        paso3.classList.add("actual");
    }
}


// =====================================================
// 7. BOTONES CONFIRMAR Y CANCELAR
// =====================================================

document.getElementById("btnConfirmar").addEventListener("click", function () {

    // reviso que no falte nada
    if (especialidadElegida === "" || medicoElegido === null || diaElegido === "" || horaElegida === "") {
        mensaje.textContent = "Falta elegir especialidad, médico, día y hora.";
        mensaje.className = "error";
        return;
    }

    // guardo la cita como ocupada (por ahora solo en la página)
    citasOcupadas.push(medicoElegido.id + "|" + diaElegido + "|" + horaElegida);

    horaElegida = "";   // la hora ya no está "elegida", ahora está ocupada
    mostrarHoras();     // vuelvo a pintar las horas para que esa quede tachada

    mensaje.textContent = "¡Cita confirmada para " + selectPaciente.value + "!";
    mensaje.className = "ok";

    actualizarPasos();
});

document.getElementById("btnCancelar").addEventListener("click", function () {
    // vuelvo todo a como estaba al abrir la página
    especialidadElegida = "";
    medicoElegido = null;
    diaElegido = "";
    diaTexto = "";
    horaElegida = "";

    mostrarEspecialidades();
    mostrarMedicos();
    mostrarDias();
    mostrarHoras();
    actualizarResumen();
});

// si cambian de paciente, se actualiza el resumen
selectPaciente.addEventListener("change", actualizarResumen);


// =====================================================
// AL ABRIR LA PÁGINA
// =====================================================

cargarPacientes();
mostrarEspecialidades();
mostrarMedicos();
mostrarDias();
mostrarHoras();
actualizarResumen();