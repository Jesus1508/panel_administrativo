const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const Usuario = require("../models/Usuario");

exports.listUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ["id", "nombre", "email", "createdAt"],
      order: [["createdAt", "ASC"]],
    });
    res.json({ success: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al listar usuarios", error: error.message });
  }
};

exports.createUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { nombre, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ nombre, email: email.toLowerCase(), passwordHash });

    res.status(201).json({
      success: true,
      data: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, createdAt: usuario.createdAt },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ success: false, message: "Ya existe un usuario con ese email" });
    }
    res.status(500).json({ success: false, message: "Error al crear el usuario", error: error.message });
  }
};

exports.deleteUsuario = async (req, res) => {
  try {
    if (String(req.params.id) === String(req.usuario.id)) {
      return res.status(400).json({ success: false, message: "No puedes eliminar tu propia cuenta" });
    }

    const total = await Usuario.count();
    if (total <= 1) {
      return res.status(400).json({ success: false, message: "Debe existir al menos un usuario administrador" });
    }

    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    await usuario.destroy();
    res.json({ success: true, message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar el usuario", error: error.message });
  }
};
