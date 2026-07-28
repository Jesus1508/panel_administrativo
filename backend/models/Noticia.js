const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Noticia = sequelize.define(
  "Noticia",
  {
    titulo: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    resumen: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
    contenido: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    imagenUrl: { type: DataTypes.STRING, allowNull: true },
    publicada: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    publicadaEn: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "noticias" }
);

module.exports = Noticia;
