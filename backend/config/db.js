const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1212",
    database: "citas_medicas"
});

conexion.connect((error) => {
    if (error) {
        console.error("Error al conectar con la base de datos:", error);
        return;
    }

    console.log("Conexión a MySQL exitosa.");
});

module.exports = conexion;