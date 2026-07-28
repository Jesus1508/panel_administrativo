const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Usuario = require("../models/Usuario");

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email: email.toLowerCase() } });
    if (!usuario) {
      return res.status(401).json({ success: false, message: "Credenciales inválidas" });
    }

    const passwordCoincide = await usuario.compararPassword(password);
    if (!passwordCoincide) {
      return res.status(401).json({ success: false, message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      success: true,
      data: { token, usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre } },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al iniciar sesión", error: error.message });
  }
};

exports.me = async (req, res) => {
  res.json({ success: true, data: req.usuario });
};
