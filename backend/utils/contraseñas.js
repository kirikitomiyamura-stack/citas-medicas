const crypto = require("crypto");

// Convierte una contraseña en un texto cifrado para guardarlo en la base de datos.
// Resultado: "scrypt$sal$hash"  (la sal es un texto al azar distinto para cada usuario)
function cifrarContrasena(contrasena) {

    const sal = crypto.randomBytes(16).toString("hex");

    const hash = crypto.scryptSync(contrasena, sal, 64).toString("hex");

    return "scrypt$" + sal + "$" + hash;
}


// Compara lo que escribió la persona con lo que hay guardado en la base de datos.
// Funciona con los dos tipos de contraseña:
//   - las nuevas (cifradas, empiezan con "scrypt$")
//   - las viejas (texto normal, como la del administrador)
function verificarContrasena(contrasena, guardada) {

    if (typeof contrasena !== "string" || typeof guardada !== "string") {
        return false;
    }

    // Contraseña vieja guardada como texto normal
    if (!guardada.startsWith("scrypt$")) {
        return contrasena === guardada;
    }

    try {

        const partes = guardada.split("$");

        const sal = partes[1];
        const hashGuardado = Buffer.from(partes[2], "hex");

        const hashNuevo = crypto.scryptSync(contrasena, sal, 64);

        return crypto.timingSafeEqual(hashGuardado, hashNuevo);

    } catch (error) {

        return false;

    }
}


module.exports = {
    cifrarContrasena,
    verificarContrasena
};