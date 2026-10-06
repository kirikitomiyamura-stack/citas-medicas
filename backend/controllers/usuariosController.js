const conexion = require("../config/db");


function login(req, res) {

    const { correo, password } = req.body;

    const sql = `
        SELECT *
        FROM usuarios
        WHERE correo = ?
        AND contrasena = ?
    `;

    conexion.query(sql, [correo, password], (error, resultado) => {

        if (error) {
            console.log(error);
            return res.status(500).json({
                mensaje: "Error del servidor"
            });
        }

        if (resultado.length > 0) {

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
    dashboard
};