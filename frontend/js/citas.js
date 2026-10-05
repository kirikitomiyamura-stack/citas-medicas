const buscadorCita = document.getElementById("buscarCita");
const filtrosCita = document.querySelectorAll("#filtrosCita .filtro");
const filas = document.querySelectorAll("#cuerpoTablaCitas tr");
const sinResultadosCitas = document.getElementById("sinResultadosCitas");

let estadoCitaActivo = "todas";

function aplicarFiltrosCitas() {

    const texto = buscadorCita.value.trim().toLowerCase();
    let visibles = 0;

    filas.forEach(fila => {

        const coincideEstado = estadoCitaActivo === "todas" || fila.dataset.estado === estadoCitaActivo;
        const coincideTexto = fila.textContent.toLowerCase().includes(texto);

        if (coincideEstado && coincideTexto) {
            fila.style.display = "table-row";
            visibles++;
        } else {
            fila.style.display = "none";
        }

    });

    sinResultadosCitas.style.display = visibles === 0 ? "block" : "none";

}

buscadorCita.addEventListener("input", aplicarFiltrosCitas);

filtrosCita.forEach(boton => {

    boton.addEventListener("click", () => {

        filtrosCita.forEach(b => b.classList.remove("activo-filtro"));
        boton.classList.add("activo-filtro");

        estadoCitaActivo = boton.dataset.estado;
        aplicarFiltrosCitas();

    });

});
