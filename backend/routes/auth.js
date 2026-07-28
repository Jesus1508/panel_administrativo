const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const protect = require("../middleware/protect");

const router = express.Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("La contraseña es requerida"),
  ],
  authController.login
);

router.get("/me", protect, authController.me);

module.exports = router;
