const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/db");

const Usuario = sequelize.define(
  "Usuario",
  {
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "usuarios" }
);

Usuario.prototype.compararPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = Usuario;
