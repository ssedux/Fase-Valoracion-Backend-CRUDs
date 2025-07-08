import { Schema, model } from "mongoose";

const reservationSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "El ID del cliente es obligatorio"]
    },
    vehicle: {
      type: String,
      required: [true, "El vehículo es obligatorio"],
      trim: true,
      minlength: [2, "El vehículo debe tener al menos 2 caracteres"],
      maxlength: [100, "El vehículo no puede exceder 100 caracteres"]
    },
    service: {
      type: String,
      required: [true, "El servicio es obligatorio"],
      trim: true,
      enum: {
        values: [
          "Mantenimiento preventivo",
          "Cambio de aceite",
          "Revisión de frenos",
          "Alineación y balanceo",
          "Revisión de motor",
          "Cambio de llantas",
          "Revisión eléctrica",
          "Diagnóstico general",
          "Otros"
        ],
        message: "Servicio no válido"
      }
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["Pendiente", "En proceso", "Completado", "Cancelado"],
        message: "Estado no válido"
      },
      default: "Pendiente"
    },
    scheduledDate: {
      type: Date,
      required: [true, "La fecha programada es obligatoria"],
      validate: {
        validator: function(date) {
          return date > new Date();
        },
        message: "La fecha programada debe ser en el futuro"
      }
    },
    notes: {
      type: String,
      maxlength: [500, "Las notas no pueden exceder 500 caracteres"],
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índice para optimizar consultas por cliente
reservationSchema.index({ clientId: 1 });

// Middleware para validar que el cliente existe
reservationSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("clientId")) {
    const Client = model("Client");
    const client = await Client.findById(this.clientId);
    if (!client) {
      const error = new Error("Cliente no encontrado");
      error.statusCode = 404;
      return next(error);
    }
  }
  next();
});

export default model("Reservation", reservationSchema);
