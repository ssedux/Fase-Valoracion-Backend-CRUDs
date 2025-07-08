import { Router } from "express";
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
  getReservationsByClient
} from "../controllers/reservationsController.js";
import {
  validateReservation,
  validateReservationUpdate,
  validateId
} from "../middlewares/validation.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - clientId
 *         - vehicle
 *         - service
 *         - scheduledDate
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la reserva
 *         clientId:
 *           type: string
 *           description: ID del cliente que hace la reserva
 *         vehicle:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Información del vehículo
 *         service:
 *           type: string
 *           enum:
 *             - Mantenimiento preventivo
 *             - Cambio de aceite
 *             - Revisión de frenos
 *             - Alineación y balanceo
 *             - Revisión de motor
 *             - Cambio de llantas
 *             - Revisión eléctrica
 *             - Diagnóstico general
 *             - Otros
 *           description: Tipo de servicio solicitado
 *         status:
 *           type: string
 *           enum:
 *             - Pendiente
 *             - En proceso
 *             - Completado
 *             - Cancelado
 *           default: Pendiente
 *           description: Estado de la reserva
 *         scheduledDate:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora programada para el servicio
 *         notes:
 *           type: string
 *           maxLength: 500
 *           description: Notas adicionales sobre la reserva
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *       example:
 *         _id: "60f7b1b3b3f3b3f3b3f3b3f4"
 *         clientId: "60f7b1b3b3f3b3f3b3f3b3f3"
 *         vehicle: "Toyota Corolla 2020"
 *         service: "Cambio de aceite"
 *         status: "Pendiente"
 *         scheduledDate: "2024-08-15T10:00:00.000Z"
 *         notes: "Cliente prefiere aceite sintético"
 *         createdAt: "2023-07-20T10:00:00.000Z"
 *         updatedAt: "2023-07-20T10:00:00.000Z"
 *     
 *     ReservationInput:
 *       type: object
 *       required:
 *         - clientId
 *         - vehicle
 *         - service
 *         - scheduledDate
 *       properties:
 *         clientId:
 *           type: string
 *           description: ID del cliente que hace la reserva
 *         vehicle:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Información del vehículo
 *         service:
 *           type: string
 *           enum:
 *             - Mantenimiento preventivo
 *             - Cambio de aceite
 *             - Revisión de frenos
 *             - Alineación y balanceo
 *             - Revisión de motor
 *             - Cambio de llantas
 *             - Revisión eléctrica
 *             - Diagnóstico general
 *             - Otros
 *           description: Tipo de servicio solicitado
 *         scheduledDate:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora programada para el servicio
 *         notes:
 *           type: string
 *           maxLength: 500
 *           description: Notas adicionales sobre la reserva
 *       example:
 *         clientId: "60f7b1b3b3f3b3f3b3f3b3f3"
 *         vehicle: "Toyota Corolla 2020"
 *         service: "Cambio de aceite"
 *         scheduledDate: "2024-08-15T10:00:00.000Z"
 *         notes: "Cliente prefiere aceite sintético"
 */

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Obtiene todas las reservas
 *     tags: [Reservas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Límite de resultados por página
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: string
 *         description: Filtrar por ID del cliente
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pendiente, En proceso, Completado, Cancelado]
 *         description: Filtrar por estado
 *       - in: query
 *         name: service
 *         schema:
 *           type: string
 *         description: Filtrar por servicio (búsqueda parcial)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para filtrar reservas
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para filtrar reservas
 *     responses:
 *       200:
 *         description: Lista de reservas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalReservations:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       500:
 *         description: Error del servidor
 */
router.get("/", getAllReservations);

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Obtiene una reserva por ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: ID no válido
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", validateId, getReservationById);

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Crea una nueva reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationInput'
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Reserva creada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Errores de validación
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post("/", validateReservation, createReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Actualiza una reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: string
 *               vehicle:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               service:
 *                 type: string
 *                 enum:
 *                   - Mantenimiento preventivo
 *                   - Cambio de aceite
 *                   - Revisión de frenos
 *                   - Alineación y balanceo
 *                   - Revisión de motor
 *                   - Cambio de llantas
 *                   - Revisión eléctrica
 *                   - Diagnóstico general
 *                   - Otros
 *               status:
 *                 type: string
 *                 enum: [Pendiente, En proceso, Completado, Cancelado]
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Reserva actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Reserva actualizada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Errores de validación
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", validateId, validateReservationUpdate, updateReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Elimina una reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Reserva eliminada exitosamente"
 *       400:
 *         description: ID no válido
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", validateId, deleteReservation);

/**
 * @swagger
 * /api/reservations/client/{clientId}:
 *   get:
 *     summary: Obtiene todas las reservas de un cliente
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pendiente, En proceso, Completado, Cancelado]
 *         description: Filtrar por estado
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Límite de resultados por página
 *     responses:
 *       200:
 *         description: Reservas del cliente obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalReservations:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       400:
 *         description: ID no válido
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/client/:clientId", validateId, getReservationsByClient);

export default router;
