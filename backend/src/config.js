import dotenv from "dotenv";

// Ejecutar dotenv para acceder al archivo .env
dotenv.config();

export const config = {
  db: {
    URI: process.env.DB_URI,
  }, 
  server: {
    port: process.env.PORT || 3000,
  },
  JWT: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES,
  },
};
