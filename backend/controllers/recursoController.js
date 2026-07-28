const fs = require("fs");
const path = require("path");
const Recurso = require("../models/Recurso");

const urlArchivo = (req, filename) => `${req.protocol}://${req.get("host")}/uploads/${filename}`;

exports.listPublicos = async (req, res) => {
  try {
    const recursos = await Recurso.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: recursos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al listar recursos", error: error.message });
  }
};

exports.create = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "El archivo es requerido" });
  }

  try {
    const { titulo, descripcion, categoria } = req.body;
    const recurso = await Recurso.create({
      titulo,
      descripcion,
      categoria,
      archivoUrl: urlArchivo(req, req.file.filename),
      archivoNombre: req.file.originalname,
    });
    res.status(201).json({ success: true, data: recurso });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear el recurso", error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const recurso = await Recurso.findByPk(req.params.id);
    if (!recurso) return res.status(404).json({ success: false, message: "Recurso no encontrado" });

    const nombreArchivo = recurso.archivoUrl.split("/uploads/")[1];
    const ruta = path.join(__dirname, "..", "uploads", nombreArchivo || "");
    fs.unlink(ruta, () => {});

    await recurso.destroy();
    res.json({ success: true, message: "Recurso eliminado" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar el recurso", error: error.message });
  }
};
