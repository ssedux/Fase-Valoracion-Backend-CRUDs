import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [50, "El nombre no puede exceder 50 caracteres"]
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor ingrese un email válido"
      ]
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"]
    },
    phone: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      trim: true,
      match: [
        /^[\+]?[1-9][\d]{0,15}$/,
        "Por favor ingrese un número de teléfono válido"
      ]
    },
    age: {
      type: Number,
      required: [true, "La edad es obligatoria"],
      min: [18, "La edad mínima es 18 años"],
      max: [120, "La edad máxima es 120 años"]
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Middleware para hashear la contraseña antes de guardar
clientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
clientSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para obtener el cliente sin la contraseña
clientSchema.methods.toJSON = function () {
  const client = this.toObject();
  delete client.password;
  return client;
};

export default model("Client", clientSchema);
