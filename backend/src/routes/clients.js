import { Router } from "express";
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} from "../controllers/clientsController.js";
import {
  validateClient,
  validateClientUpdate,
  validateId,
  checkEmailUnique
} from "../middlewares/validation.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *         - age
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del cliente
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           description: Nombre del cliente
 *         email:
 *           type: string
 *           format: email
 *           description: Email del cliente (único)
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Contraseña del cliente
 *         phone:
 *           type: string
 *           description: Número de teléfono del cliente
 *         age:
 *           type: integer
 *           minimum: 18
 *           maximum: 120
 *           description: Edad del cliente
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *       example:
 *         _id: "60f7b1b3b3f3b3f3b3f3b3f3"
 *         name: "Juan Pérez"
 *         email: "juan@example.com"
 *         phone: "+57300123456"
 *         age: 30
 *         createdAt: "2023-07-20T10:00:00.000Z"
 *         updatedAt: "2023-07-20T10:00:00.000Z"
 *     
 *     ClientInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *         - age
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           description: Nombre del cliente
 *         email:
 *           type: string
 *           format: email
 *           description: Email del cliente
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Contraseña del cliente
 *         phone:
 *           type: string
 *           description: Número de teléfono del cliente
 *         age:
 *           type: integer
 *           minimum: 18
 *           maximum: 120
 *           description: Edad del cliente
 *       example:
 *         name: "Juan Pérez"
 *         email: "juan@example.com"
 *         password: "123456"
 *         phone: "+57300123456"
 *         age: 30
 */

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Obtiene todos los clientes
 *     tags: [Clientes]
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre (búsqueda parcial)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email (búsqueda parcial)
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Client'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalClients:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       500:
 *         description: Error del servidor
 */
router.get("/", getAllClients);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Obtiene un cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: ID no válido
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", validateId, getClientById);

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Crea un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientInput'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
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
 *                   example: "Cliente creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: Errores de validación o email ya registrado
 *       500:
 *         description: Error del servidor
 */
router.post("/", validateClient, createClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Actualiza un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               phone:
 *                 type: string
 *               age:
 *                 type: integer
 *                 minimum: 18
 *                 maximum: 120
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
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
 *                   example: "Cliente actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: Errores de validación o email ya registrado
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", validateId, validateClientUpdate, checkEmailUnique, updateClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Elimina un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
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
 *                   example: "Cliente eliminado exitosamente"
 *       400:
 *         description: ID no válido o cliente tiene reservas activas
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", validateId, deleteClient);

export default router;
