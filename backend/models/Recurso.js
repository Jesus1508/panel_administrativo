const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Recurso = sequelize.define(
  "Recurso",
  {
    titulo: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
    categoria: { type: DataTypes.STRING, allowNull: false, defaultValue: "General" },
    archivoUrl: { type: DataTypes.STRING, allowNull: false },
    archivoNombre: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "recursos" }
);

module.exports = Recurso;
