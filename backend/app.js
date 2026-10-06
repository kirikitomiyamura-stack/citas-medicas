const conexion = require("./config/db");
const express = require("express");
const cors = require("cors");
const rutasUsuarios = require("./routers/usuarios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Servidor de Citas Médicas funcionando correctamente");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(rutasUsuarios);

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});