import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

// Importar rutas
import clientsRoutes from "./src/routes/clients.js";
import reservationsRoutes from "./src/routes/reservations.js";

const app = express();

// Configuración de CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Ajustar según frontend
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Part Plus API",
      version: "1.0.0",
      description: "API para gestión de servicios vehiculares - Part Plus",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Rutas donde están las documentaciones
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Rutas principales
app.use("/api/clients", clientsRoutes);
app.use("/api/reservations", reservationsRoutes);

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.json({
    message: "¡Bienvenido a la API de Part Plus!",
    documentation: "/api-docs"
  });
});

export default app;
