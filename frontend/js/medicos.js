const tarjetas = document.querySelectorAll(".medico-card");
const botonesFiltro = document.querySelectorAll(".filtro");
const inputBuscar = document.getElementById("buscarMedico");
const sinResultados = document.getElementById("sinResultados");

let especialidadActiva = "todos";

// Aplica el filtro de especialidad + el texto de búsqueda al mismo tiempo
function aplicarFiltros() {

    const texto = inputBuscar.value.toLowerCase().trim();
    let visibles = 0;

    tarjetas.forEach(function (card) {

        const coincideEspecialidad =
            especialidadActiva === "todos" || card.dataset.especialidad === especialidadActiva;

        const coincideTexto = card.textContent.toLowerCase().includes(texto);

        if (coincideEspecialidad && coincideTexto) {
            card.style.display = "block";
            visibles++;
        } else {
            card.style.display = "none";
        }

    });

    sinResultados.style.display = visibles === 0 ? "block" : "none";
}

// Botones de filtro por especialidad
botonesFiltro.forEach(function (boton) {

    boton.addEventListener("click", function () {

        botonesFiltro.forEach(function (b) { b.classList.remove("activo"); });
        boton.classList.add("activo");

        especialidadActiva = boton.dataset.especialidad;
        aplicarFiltros();

    });

});

// Buscador en vivo
inputBuscar.addEventListener("input", aplicarFiltros);

aplicarFiltros();