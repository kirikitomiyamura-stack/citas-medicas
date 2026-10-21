const conexion = require("../config/db");
const { cifrarContrasena, verificarContrasena } = require("../utils/contrasenas");


function login(req, res) {

    const { correo, password } = req.body;

    // Se busca el usuario por su correo y después se compara la contraseña
    const sql = `
        SELECT *
        FROM usuarios
        WHERE correo = ?
    `;

    conexion.query(sql, [correo], (error, resultado) => {

        if (error) {
            console.log(error);
            return res.status(500).json({
                mensaje: "Error del servidor"
            });
        }

        if (resultado.length > 0 && verificarContrasena(password, resultado[0].contrasena)) {

            res.json({
                mensaje: "Inicio de sesión correcto"
            });

        } else {

            res.status(401).json({
                mensaje: "Correo o contraseña incorrectos"
            });

        }

    });

}


function registro(req, res) {

    const { nombre, correo, password, rol } = req.body;

    // Roles que se pueden elegir al registrarse.
    // El Administrador NO está en la lista a propósito.
    const rolesPermitidos = ["Medico", "Recepcionista"];

    // ---------- Validaciones ----------

    if (typeof nombre !== "string" || nombre.trim().length < 3 || nombre.trim().length > 100) {
        return res.status(400).json({ mensaje: "Escribe tu nombre completo" });
    }

    const correoLimpio = typeof correo === "string" ? correo.trim().toLowerCase() : "";

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio);

    if (!correoValido || correoLimpio.length > 100) {
        return res.status(400).json({ mensaje: "Escribe un correo válido" });
    }

    if (typeof password !== "string" || password.length < 8 || password.length > 100) {
        return res.status(400).json({ mensaje: "La contraseña debe tener al menos 8 caracteres" });
    }

    if (!rolesPermitidos.includes(rol)) {
        return res.status(400).json({ mensaje: "Elige un rol válido" });
    }

    // ---------- Buscar el rol en la base de datos ----------

    conexion.query("SELECT id FROM roles WHERE nombre = ?", [rol], (error, roles) => {

        if (error) {
            console.log(error);
            return res.status(500).json({ mensaje: "Error del servidor" });
        }

        if (roles.length === 0) {
            return res.status(400).json({ mensaje: "Elige un rol válido" });
        }

        // ---------- Guardar el usuario (con la contraseña cifrada) ----------

        const sql = `
            INSERT INTO usuarios (nombre, correo, contrasena, rol_id)
            VALUES (?, ?, ?, ?)
        `;

        const datos = [
            nombre.trim(),
            correoLimpio,
            cifrarContrasena(password),
            roles[0].id
        ];

        conexion.query(sql, datos, (error) => {

            if (error) {

                // El correo es único: si ya existe, MySQL avisa con este código
                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ mensaje: "Este correo ya está registrado" });
                }

                console.log(error);
                return res.status(500).json({ mensaje: "Error del servidor" });
            }

            res.status(201).json({ mensaje: "Registro exitoso" });

        });

    });

}


function dashboard(req, res) {

    const respuesta = {};

    conexion.query("SELECT COUNT(*) AS total FROM pacientes", (error, resultado) => {

        if (error) {
            return res.status(500).json(error);
        }

        respuesta.pacientes = resultado[0].total;

        conexion.query("SELECT COUNT(*) AS total FROM medicos", (error, resultado) => {

            if (error) {
                return res.status(500).json(error);
            }

            respuesta.medicos = resultado[0].total;

            conexion.query("SELECT COUNT(*) AS total FROM citas", (error, resultado) => {

                if (error) {
                    return res.status(500).json(error);
                }

                respuesta.citas = resultado[0].total;

                conexion.query("SELECT COUNT(*) AS total FROM consultorios", (error, resultado) => {

                    if (error) {
                        return res.status(500).json(error);
                    }

                    respuesta.consultorios = resultado[0].total;

                    res.json(respuesta);

                });

            });

        });

    });

}

module.exports = {
    login,
    registro,
    dashboard
};