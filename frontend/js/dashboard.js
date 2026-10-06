// Trae los totales para las tarjetas de resumen
fetch("https://citas-medicas-6l2b.onrender.com")
    .then(respuesta => respuesta.json())
    .then(datos => {

        document.getElementById("totalPacientes").textContent = datos.pacientes;
        document.getElementById("totalMedicos").textContent = datos.medicos;
        document.getElementById("totalCitas").textContent = datos.citas;
        document.getElementById("totalConsultorios").textContent = datos.consultorios;

    })
    .catch(error => {
        console.log("Error al cargar los datos:", error);
    });




document.getElementById("fechaActual").textContent =
    fecha.toLocaleDateString("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });