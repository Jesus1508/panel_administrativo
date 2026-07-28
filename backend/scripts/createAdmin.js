require("dotenv").config();
const bcrypt = require("bcryptjs");
const sequelize = require("../config/db");
const Usuario = require("../models/Usuario");

const run = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NOMBRE } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Define ADMIN_EMAIL y ADMIN_PASSWORD en tu .env antes de correr este script.");
    process.exit(1);
  }

  await sequelize.sync();

  const existente = await Usuario.findOne({ where: { email: ADMIN_EMAIL.toLowerCase() } });
  if (existente) {
    console.log(`Ya existe un usuario con el email ${ADMIN_EMAIL}. No se creó ninguno nuevo.`);
    await sequelize.close();
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await Usuario.create({
    nombre: ADMIN_NOMBRE || "Administrador",
    email: ADMIN_EMAIL.toLowerCase(),
    passwordHash,
  });

  console.log(`Usuario administrador creado con éxito: ${ADMIN_EMAIL}`);
  await sequelize.close();
};

run().catch((error) => {
  console.error("Error al crear el usuario administrador:", error.message);
  process.exit(1);
});
