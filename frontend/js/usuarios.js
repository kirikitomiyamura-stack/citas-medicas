const buscadorUsuario = document.getElementById("buscarUsuario");
const filasUsuario = document.querySelectorAll("#cuerpoTablaUsuarios tr");
const sinResultadosUsuarios = document.getElementById("sinResultadosUsuarios");
const botonesEstado = document.querySelectorAll(".toggle-estado");

buscadorUsuario.addEventListener("input", function () {

    const texto = this.value.trim().toLowerCase();
    let visibles = 0;

    filasUsuario.forEach(fila => {

        const coincide = fila.textContent.toLowerCase().includes(texto);

        fila.style.display = coincide ? "table-row" : "none";

        if (coincide) visibles++;

    });

    sinResultadosUsuarios.style.display = visibles === 0 ? "block" : "none";

});

botonesEstado.forEach(boton => {

    boton.addEventListener("click", function () {

        const activo = this.dataset.activo === "true";

        if (activo) {
            this.dataset.activo = "false";
            this.textContent = "Inactivo";
            this.classList.remove("activo");
            this.classList.add("inactivo");
        } else {
            this.dataset.activo = "true";
            this.textContent = "Activo";
            this.classList.remove("inactivo");
            this.classList.add("activo");
        }

    });

});
