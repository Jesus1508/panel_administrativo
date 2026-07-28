const { validationResult } = require("express-validator");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");
const Noticia = require("../models/Noticia");

const urlImagen = (req, filename) =>
  filename ? `${req.protocol}://${req.get("host")}/uploads/${filename}` : null;

exports.listPublicas = async (req, res) => {
  try {
    const noticias = await Noticia.findAll({
      where: { publicada: true },
      order: [["publicadaEn", "DESC"]],
    });
    res.json({ success: true, data: noticias });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al listar noticias", error: error.message });
  }
};

exports.getPublicaBySlug = async (req, res) => {
  try {
    const noticia = await Noticia.findOne({ where: { slug: req.params.slug, publicada: true } });
    if (!noticia) return res.status(404).json({ success: false, message: "Noticia no encontrada" });
    res.json({ success: true, data: noticia });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener la noticia", error: error.message });
  }
};

exports.listAdmin = async (req, res) => {
  try {
    const noticias = await Noticia.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: noticias });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al listar noticias", error: error.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { titulo, resumen, contenido, publicada } = req.body;
    const slug = slugify(titulo, { lower: true, strict: true });
    const esPublicada = publicada === "true" || publicada === true;

    const noticia = await Noticia.create({
      titulo,
      slug,
      resumen,
      contenido,
      publicada: esPublicada,
      publicadaEn: esPublicada ? new Date() : null,
      imagenUrl: req.file ? urlImagen(req, req.file.filename) : null,
    });

    res.status(201).json({ success: true, data: noticia });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ success: false, message: "Ya existe una noticia con ese título" });
    }
    res.status(500).json({ success: false, message: "Error al crear la noticia", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const noticia = await Noticia.findByPk(req.params.id);
    if (!noticia) return res.status(404).json({ success: false, message: "Noticia no encontrada" });

    const { titulo, resumen, contenido, publicada } = req.body;
    if (titulo && titulo !== noticia.titulo) {
      noticia.slug = slugify(titulo, { lower: true, strict: true });
    }
    noticia.titulo = titulo ?? noticia.titulo;
    noticia.resumen = resumen ?? noticia.resumen;
    noticia.contenido = contenido ?? noticia.contenido;

    const esPublicada = publicada === "true" || publicada === true;
    if (publicada !== undefined && esPublicada && !noticia.publicada) {
      noticia.publicadaEn = new Date();
    }
    if (publicada !== undefined) noticia.publicada = esPublicada;

    if (req.file) {
      if (noticia.imagenUrl) {
        const nombreAnterior = noticia.imagenUrl.split("/uploads/")[1];
        const rutaAnterior = path.join(__dirname, "..", "uploads", nombreAnterior || "");
        fs.unlink(rutaAnterior, () => {});
      }
      noticia.imagenUrl = urlImagen(req, req.file.filename);
    }

    await noticia.save();
    res.json({ success: true, data: noticia });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar la noticia", error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const noticia = await Noticia.findByPk(req.params.id);
    if (!noticia) return res.status(404).json({ success: false, message: "Noticia no encontrada" });

    if (noticia.imagenUrl) {
      const nombreArchivo = noticia.imagenUrl.split("/uploads/")[1];
      const ruta = path.join(__dirname, "..", "uploads", nombreArchivo || "");
      fs.unlink(ruta, () => {});
    }

    await noticia.destroy();
    res.json({ success: true, message: "Noticia eliminada" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar la noticia", error: error.message });
  }
};
