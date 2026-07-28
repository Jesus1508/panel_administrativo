const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Pagina = sequelize.define(
  "Pagina",
  {
    titulo: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    contenido: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    orden: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    publicada: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { tableName: "paginas" }
);

module.exports = Pagina;
