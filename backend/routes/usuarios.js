const express = require("express");
const { body } = require("express-validator");
const usuarioController = require("../controllers/usuarioController");
const protect = require("../middleware/protect");

const router = express.Router();

router.use(protect);

const usuarioValidators = [
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
];

router.get("/", usuarioController.listUsuarios);
router.post("/", usuarioValidators, usuarioController.createUsuario);
router.delete("/:id", usuarioController.deleteUsuario);

module.exports = router;
