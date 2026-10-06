const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "1212",
    database: process.env.DB_NAME || "citas_medicas",
    port: process.env.DB_PORT || 3306
});

conexion.connect((error) => {
    if (error) {
        console.error("Error al conectar con la base de datos:", error);
        return;
    }

    console.log("Conexión a MySQL exitosa.");
});

module.exports = conexion;