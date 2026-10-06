const boton = document.getElementById("btnLogin");

boton.addEventListener("click", function () {

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    fetch("https://citas-medicas-6l2b.onrender.com", {

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

       if(datos.mensaje === "Inicio de sesión correcto"){

    window.location.href = "dashboard.html";

    }else{

        alert(datos.mensaje);

}

    })

    .catch(error => {

        console.log(error);

        alert("Error al conectar con el servidor");

    });

});