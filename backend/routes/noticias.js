const express = require("express");
const { body } = require("express-validator");
const noticiaController = require("../controllers/noticiaController");
const protect = require("../middleware/protect");
const upload = require("../middleware/upload");

const router = express.Router();

const noticiaValidators = [body("titulo").notEmpty().withMessage("El título es requerido")];

router.get("/", noticiaController.listPublicas);
router.get("/:slug", noticiaController.getPublicaBySlug);

router.get("/admin/todas", protect, noticiaController.listAdmin);
router.post("/admin", protect, upload.single("imagen"), noticiaValidators, noticiaController.create);
router.put("/admin/:id", protect, upload.single("imagen"), noticiaController.update);
router.delete("/admin/:id", protect, noticiaController.remove);

module.exports = router;
