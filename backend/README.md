# Part Plus API - Sistema de Gestión de Servicios Vehiculares

API REST para la gestión de clientes y reservas de servicios vehiculares de la empresa Part Plus.

## 📋 Descripción

Part Plus es una empresa dedicada a la venta de repuestos de carros que necesita digitalizar el proceso de agendar servicios para vehículos. Esta API REST permite gestionar tanto a los clientes como las reservas de servicios.

## 🚀 Características

- **CRUD completo de Clientes**: Crear, leer, actualizar y eliminar clientes
- **CRUD completo de Reservas**: Gestión completa de reservas de servicios
- **Validaciones robustas**: Verificación de campos obligatorios y formatos válidos
- **Prevención de duplicados**: Verificación de existencia de clientes por email
- **Documentación Swagger**: Documentación interactiva de la API
- **Paginación**: Sistema de paginación para listados
- **Filtros de búsqueda**: Múltiples opciones de filtrado

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Swagger** - Documentación de API
- **Express Validator** - Validación de datos
- **bcryptjs** - Encriptación de contraseñas

## 📦 Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd Fase-Valoracion/backend
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   El archivo `.env` ya está configurado con:
   ```
   DB_URI="mongodb://localhost:27017/PartPlus"
   PORT="4000"
   JWT_SECRET="your_jwt_secret_key_here"
   JWT_EXPIRES="24h"
   ```

4. **Asegúrate de tener MongoDB ejecutándose localmente:**
   ```bash
   mongod
   ```

5. **Inicia el servidor:**
   ```bash
   npm run dev
   ```

## 📖 Documentación de la API

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:4000/api-docs
```

## 🔗 Endpoints de la API

### Clientes (Clients)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/clients` | Obtiene todos los clientes (con paginación y filtros) |
| GET | `/api/clients/:id` | Obtiene un cliente por ID |
| POST | `/api/clients` | Crea un nuevo cliente |
| PUT | `/api/clients/:id` | Actualiza un cliente |
| DELETE | `/api/clients/:id` | Elimina un cliente |

### Reservas (Reservations)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/reservations` | Obtiene todas las reservas (con paginación y filtros) |
| GET | `/api/reservations/:id` | Obtiene una reserva por ID |
| POST | `/api/reservations` | Crea una nueva reserva |
| PUT | `/api/reservations/:id` | Actualiza una reserva |
| DELETE | `/api/reservations/:id` | Elimina una reserva |
| GET | `/api/reservations/client/:clientId` | Obtiene todas las reservas de un cliente |

## 📊 Modelos de Datos

### Cliente (Client)
```javascript
{
  "name": "String (requerido, 2-50 caracteres)",
  "email": "String (requerido, único, formato email)",
  "password": "String (requerido, mínimo 6 caracteres)",
  "phone": "String (requerido, formato teléfono)",
  "age": "Number (requerido, 18-120)"
}
```

### Reserva (Reservation)
```javascript
{
  "clientId": "ObjectID (requerido, referencia a Cliente)",
  "vehicle": "String (requerido, 2-100 caracteres)",
  "service": "String (requerido, enum de servicios disponibles)",
  "status": "String (enum: Pendiente, En proceso, Completado, Cancelado)",
  "scheduledDate": "Date (requerido, debe ser fecha futura)",
  "notes": "String (opcional, máximo 500 caracteres)"
}
```

## 🎯 Servicios Disponibles

- Mantenimiento preventivo
- Cambio de aceite
- Revisión de frenos
- Alineación y balanceo
- Revisión de motor
- Cambio de llantas
- Revisión eléctrica
- Diagnóstico general
- Otros

## ✅ Validaciones Implementadas

### Clientes:
- **Nombre**: Obligatorio, 2-50 caracteres
- **Email**: Obligatorio, formato válido, único en el sistema
- **Contraseña**: Obligatorio, mínimo 6 caracteres, encriptada
- **Teléfono**: Obligatorio, formato de teléfono válido
- **Edad**: Obligatorio, entre 18 y 120 años

### Reservas:
- **ClientId**: Obligatorio, debe existir en la base de datos
- **Vehículo**: Obligatorio, 2-100 caracteres
- **Servicio**: Obligatorio, debe ser uno de los servicios disponibles
- **Fecha programada**: Obligatorio, debe ser una fecha futura
- **Estado**: Opcional, valores válidos predefinidos
- **Notas**: Opcional, máximo 500 caracteres

## 🚀 Filtros y Búsquedas

### Clientes:
- Búsqueda por nombre (parcial)
- Búsqueda por email (parcial)
- Paginación

### Reservas:
- Filtrar por cliente
- Filtrar por estado
- Filtrar por servicio (parcial)
- Filtrar por rango de fechas
- Paginación

## 📝 Ejemplos de Uso

### Crear un Cliente
```bash
POST /api/clients
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456",
  "phone": "+57300123456",
  "age": 30
}
```

### Crear una Reserva
```bash
POST /api/reservations
Content-Type: application/json

{
  "clientId": "60f7b1b3b3f3b3f3b3f3b3f3",
  "vehicle": "Toyota Corolla 2020",
  "service": "Cambio de aceite",
  "scheduledDate": "2024-08-15T10:00:00.000Z",
  "notes": "Cliente prefiere aceite sintético"
}
```

## 🔧 Scripts Disponibles

- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon

## 🌐 Despliegue en Render

Para desplegar en Render:

1. Conecta tu repositorio de GitHub a Render
2. Configura las variables de entorno en Render:
   - `DB_URI`: URL de tu base de datos MongoDB (puedes usar MongoDB Atlas)
   - `PORT`: 4000
   - `JWT_SECRET`: Tu clave secreta JWT
   - `JWT_EXPIRES`: 24h
3. Render automáticamente detectará el `package.json` y ejecutará `npm start`

## 📄 Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/
│   │   ├── clientsController.js
│   │   └── reservationsController.js
│   ├── middlewares/
│   │   └── validation.js
│   ├── models/
│   │   ├── Client.js
│   │   └── Reservation.js
│   ├── routes/
│   │   ├── clients.js
│   │   └── reservations.js
│   └── config.js
├── app.js
├── database.js
├── index.js
├── package.json
├── .env
└── README.md
```

## 🤝 Contribuciones

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte o preguntas sobre la API, por favor contacta al equipo de desarrollo.

---

**Part Plus API v1.0.0** - Sistema de Gestión de Servicios Vehiculares
