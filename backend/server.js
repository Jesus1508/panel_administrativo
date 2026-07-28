require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const usuarioRoutes = require("./routes/usuarios");
const paginaRoutes = require("./routes/paginas");
const noticiaRoutes = require("./routes/noticias");
const recursoRoutes = require("./routes/recursos");

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      const isLocalhost = !origin || /^http:\/\/localhost:\d+$/.test(origin);
      const isConfiguredFrontend = origin && origin === process.env.FRONTEND_URL;
      if (isLocalhost || isConfiguredFrontend) {
        return callback(null, true);
      }
      callback(new Error("No permitido por CORS"));
    },
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Panel Administrativo API funcionando" });
});

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/paginas", paginaRoutes);
app.use("/api/noticias", noticiaRoutes);
app.use("/api/recursos", recursoRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Error interno del servidor" });
});

const PORT = process.env.PORT || 4002;

const start = async () => {
  await sequelize.authenticate();
  console.log("MySQL conectado correctamente");
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`Servidor del Panel Administrativo corriendo en el puerto ${PORT}`);
  });
};

start();
