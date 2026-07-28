const express = require("express");
const { body } = require("express-validator");
const paginaController = require("../controllers/paginaController");
const protect = require("../middleware/protect");

const router = express.Router();

const paginaValidators = [
  body("titulo").notEmpty().withMessage("El título es requerido"),
  body("contenido").notEmpty().withMessage("El contenido es requerido"),
];

router.get("/", paginaController.listPublicas);
router.get("/:slug", paginaController.getPublicaBySlug);

router.get("/admin/todas", protect, paginaController.listAdmin);
router.post("/admin", protect, paginaValidators, paginaController.create);
router.put("/admin/:id", protect, paginaController.update);
router.delete("/admin/:id", protect, paginaController.remove);

module.exports = router;
