const express = require("express");
const router = express.Router();

const usuariosController = require("../controllers/usuariosController");

// ruta para iniciar sesión
router.post("/login", usuariosController.login);

// ruta para crear una cuenta nueva
router.post("/registro", usuariosController.registro);

router.get("/dashboard", usuariosController.dashboard);

module.exports = router;