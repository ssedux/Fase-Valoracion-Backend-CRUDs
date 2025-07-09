import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar rutas
import clientsRoutes from "./src/routes/clients.js";
import reservationsRoutes from "./src/routes/reservations.js";

const app = express();

// Configuración de CORS
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://tu-frontend.vercel.app", "https://tu-frontend.netlify.app"] // Agregar URLs de producción
      : "http://localhost:5173", // Para desarrollo
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
        url: process.env.NODE_ENV === 'production' 
          ? process.env.RENDER_EXTERNAL_URL || "https://tu-servicio.onrender.com"
          : "http://localhost:4000",
        description: process.env.NODE_ENV === 'production' 
          ? "Servidor de producción"
          : "Servidor de desarrollo",
      },
    ],
  },
  apis: [path.join(__dirname, "src", "routes", "*.js")], // Ruta absoluta a los archivos de rutas
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
