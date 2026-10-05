const tarjetas = document.querySelectorAll(".consultorio-card");
const botonesFiltro = document.querySelectorAll(".filtro");
const inputBuscar = document.getElementById("buscarConsultorio");
const sinResultados = document.getElementById("sinResultados");

let filtroActivo = "todos";

// Actualiza los contadores de arriba según los datos actuales de las tarjetas
function actualizarContadores() {

    let disponibles = 0;
    let ocupados = 0;

    tarjetas.forEach(function (card) {
        if (card.dataset.estado === "disponible") disponibles++;
        if (card.dataset.estado === "ocupado") ocupados++;
    });

    document.getElementById("totalGeneral").textContent = tarjetas.length;
    document.getElementById("totalDisponibles").textContent = disponibles;
    document.getElementById("totalOcupados").textContent = ocupados;
}

// Aplica el filtro de estado + el texto de búsqueda al mismo tiempo
function aplicarFiltros() {

    const texto = inputBuscar.value.toLowerCase().trim();
    let visibles = 0;

    tarjetas.forEach(function (card) {

        const coincideEstado = filtroActivo === "todos" || card.dataset.estado === filtroActivo;
        const coincideTexto = card.textContent.toLowerCase().includes(texto);

        if (coincideEstado && coincideTexto) {
            card.style.display = "block";
            visibles++;
        } else {
            card.style.display = "none";
        }

    });

    sinResultados.style.display = visibles === 0 ? "block" : "none";
}

// Botones de filtro (Todos / Disponibles / Ocupados)
botonesFiltro.forEach(function (boton) {

    boton.addEventListener("click", function () {

        botonesFiltro.forEach(function (b) { b.classList.remove("activo"); });
        boton.classList.add("activo");

        filtroActivo = boton.dataset.filtro;
        aplicarFiltros();

    });

});

// Buscador en vivo
inputBuscar.addEventListener("input", aplicarFiltros);

actualizarContadores();
aplicarFiltros();