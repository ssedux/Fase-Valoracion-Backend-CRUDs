import app from "./app.js";
import "./database.js";
import { config } from "./src/config.js";

// Función que se encarga de ejecutar el servidor
async function main() {
  app.listen(config.server.port);
  console.log("Server running on port " + config.server.port);
}

// Ejecutar el servidor
main();
