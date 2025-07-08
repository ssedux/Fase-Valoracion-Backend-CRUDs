import mongoose from "mongoose";
import { config } from "./src/config.js";

// Conectar la base de datos
mongoose.connect(config.db.URI);

// Comprobar que todo funciona
const connection = mongoose.connection;

// Verificar conexión exitosa
connection.once("open", () => {
  console.log("Database connected successfully");
});

// Verificar si se desconectó
connection.on("error", (error) => {
  console.log("Database connection error:", error);
});
