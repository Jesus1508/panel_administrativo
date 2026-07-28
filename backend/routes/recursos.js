const express = require("express");
const recursoController = require("../controllers/recursoController");
const protect = require("../middleware/protect");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", recursoController.listPublicos);
router.post("/admin", protect, upload.single("archivo"), recursoController.create);
router.delete("/admin/:id", protect, recursoController.remove);

module.exports = router;
