const express = require("express");
const router = express.Router();

const usuariosController = require("../controllers/usuariosController");

// ruta para iniciar sesión
router.post("/login", usuariosController.login);
router.get("/dashboard", usuariosController.dashboard);

module.exports = router;