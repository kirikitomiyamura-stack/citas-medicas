const buscadorTratamiento = document.getElementById("buscarTratamiento");
const tarjetasTratamiento = document.querySelectorAll(".tarjeta-tratamiento");
const sinResultadosTratamientos = document.getElementById("sinResultadosTratamientos");

buscadorTratamiento.addEventListener("input", function () {

    const texto = this.value.trim().toLowerCase();
    let visibles = 0;

    tarjetasTratamiento.forEach(tarjeta => {

        const coincide = tarjeta.textContent.toLowerCase().includes(texto);

        tarjeta.style.display = coincide ? "block" : "none";

        if (coincide) visibles++;

    });

    sinResultadosTratamientos.style.display = visibles === 0 ? "block" : "none";

});
