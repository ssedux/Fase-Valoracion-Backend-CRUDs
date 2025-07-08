import { body, param, validationResult } from "express-validator";
import Client from "../models/Client.js";

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors.array()
    });
  }
  next();
};

// Validaciones para clientes
export const validateClient = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),
  
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),
  
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("El teléfono es obligatorio")
    .isMobilePhone("any")
    .withMessage("Debe ser un número de teléfono válido"),
  
  body("age")
    .isInt({ min: 18, max: 120 })
    .withMessage("La edad debe ser un número entre 18 y 120"),
  
  handleValidationErrors
];

// Validación para actualizar cliente (campos opcionales)
export const validateClientUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),
  
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),
  
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  
  body("phone")
    .optional()
    .trim()
    .isMobilePhone("any")
    .withMessage("Debe ser un número de teléfono válido"),
  
  body("age")
    .optional()
    .isInt({ min: 18, max: 120 })
    .withMessage("La edad debe ser un número entre 18 y 120"),
  
  handleValidationErrors
];

// Validaciones para reservas
export const validateReservation = [
  body("clientId")
    .notEmpty()
    .withMessage("El ID del cliente es obligatorio")
    .isMongoId()
    .withMessage("ID de cliente no válido"),
  
  body("vehicle")
    .trim()
    .notEmpty()
    .withMessage("El vehículo es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El vehículo debe tener entre 2 y 100 caracteres"),
  
  body("service")
    .notEmpty()
    .withMessage("El servicio es obligatorio")
    .isIn([
      "Mantenimiento preventivo",
      "Cambio de aceite",
      "Revisión de frenos",
      "Alineación y balanceo",
      "Revisión de motor",
      "Cambio de llantas",
      "Revisión eléctrica",
      "Diagnóstico general",
      "Otros"
    ])
    .withMessage("Servicio no válido"),
  
  body("scheduledDate")
    .notEmpty()
    .withMessage("La fecha programada es obligatoria")
    .isISO8601()
    .withMessage("Formato de fecha no válido")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("La fecha programada debe ser en el futuro");
      }
      return true;
    }),
  
  body("status")
    .optional()
    .isIn(["Pendiente", "En proceso", "Completado", "Cancelado"])
    .withMessage("Estado no válido"),
  
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Las notas no pueden exceder 500 caracteres"),
  
  handleValidationErrors
];

// Validación para actualizar reserva
export const validateReservationUpdate = [
  body("clientId")
    .optional()
    .isMongoId()
    .withMessage("ID de cliente no válido"),
  
  body("vehicle")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El vehículo debe tener entre 2 y 100 caracteres"),
  
  body("service")
    .optional()
    .isIn([
      "Mantenimiento preventivo",
      "Cambio de aceite",
      "Revisión de frenos",
      "Alineación y balanceo",
      "Revisión de motor",
      "Cambio de llantas",
      "Revisión eléctrica",
      "Diagnóstico general",
      "Otros"
    ])
    .withMessage("Servicio no válido"),
  
  body("scheduledDate")
    .optional()
    .isISO8601()
    .withMessage("Formato de fecha no válido")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("La fecha programada debe ser en el futuro");
      }
      return true;
    }),
  
  body("status")
    .optional()
    .isIn(["Pendiente", "En proceso", "Completado", "Cancelado"])
    .withMessage("Estado no válido"),
  
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Las notas no pueden exceder 500 caracteres"),
  
  handleValidationErrors
];

// Validación para parámetros ID
export const validateId = [
  param("id")
    .isMongoId()
    .withMessage("ID no válido"),
  
  handleValidationErrors
];

// Validación para verificar que el email no esté en uso
export const checkEmailUnique = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { id } = req.params;
    
    if (email) {
      const existingClient = await Client.findOne({ email });
      if (existingClient && existingClient._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          message: "El email ya está registrado"
        });
      }
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      error: error.message
    });
  }
};
