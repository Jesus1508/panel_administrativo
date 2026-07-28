const { validationResult } = require("express-validator");
const slugify = require("slugify");
const Pagina = require("../models/Pagina");

exports.listPublicas = async (req, res) => {
  try {
    const paginas = await Pagina.findAll({
      where: { publicada: true },
      order: [["orden", "ASC"]],
    });
    res.json({ success: true, data: paginas });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al listar páginas", error: error.message });
  }
};

exports.getPublicaBySlug = async (req, res) => {
  try {
    const pagina = await Pagina.findOne({ where: { slug: req.params.slug, publicada: true } });
    if (!pagina) return res.status(404).json({ success: false, message: "Página no encontrada" });
    res.json({ success: true, data: pagina });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener la página", error: error.message });
  }
};

exports.listAdmin = async (req, res) => {
  try {
    const paginas = await Pagina.findAll({ order: [["orden", "ASC"]] });
    res.json({ success: true, data: paginas });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al listar páginas", error: error.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { titulo, contenido, orden, publicada } = req.body;
    const slug = slugify(titulo, { lower: true, strict: true });
    const pagina = await Pagina.create({ titulo, slug, contenido, orden, publicada });
    res.status(201).json({ success: true, data: pagina });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ success: false, message: "Ya existe una página con ese título" });
    }
    res.status(500).json({ success: false, message: "Error al crear la página", error: error.message });
  }
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const pagina = await Pagina.findByPk(req.params.id);
    if (!pagina) return res.status(404).json({ success: false, message: "Página no encontrada" });

    const { titulo, contenido, orden, publicada } = req.body;
    if (titulo && titulo !== pagina.titulo) {
      pagina.slug = slugify(titulo, { lower: true, strict: true });
    }
    pagina.titulo = titulo ?? pagina.titulo;
    pagina.contenido = contenido ?? pagina.contenido;
    pagina.orden = orden ?? pagina.orden;
    if (publicada !== undefined) pagina.publicada = publicada;
    await pagina.save();

    res.json({ success: true, data: pagina });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar la página", error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const pagina = await Pagina.findByPk(req.params.id);
    if (!pagina) return res.status(404).json({ success: false, message: "Página no encontrada" });
    await pagina.destroy();
    res.json({ success: true, message: "Página eliminada" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar la página", error: error.message });
  }
};
