import Client from "../models/Client.js";
import mongoose from "mongoose";

// Obtener todos los clientes
export const getAllClients = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, email } = req.query;
    
    // Construir filtros
    const filters = {};
    if (name) {
      filters.name = { $regex: name, $options: "i" };
    }
    if (email) {
      filters.email = { $regex: email, $options: "i" };
    }

    // Configurar paginación
    const skip = (page - 1) * limit;
    
    const clients = await Client.find(filters)
      .select("-password")
      .limit(limit * 1)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Client.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: clients,
      pagination: {
        currentPage: page * 1,
        totalPages: Math.ceil(total / limit),
        totalClients: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los clientes",
      error: error.message
    });
  }
};

// Obtener un cliente por ID
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de cliente no válido"
      });
    }

    const client = await Client.findById(id).select("-password");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el cliente",
      error: error.message
    });
  }
};

// Crear un nuevo cliente
export const createClient = async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;

    // Verificar que el email no esté en uso
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado"
      });
    }

    const newClient = new Client({
      name,
      email,
      password,
      phone,
      age
    });

    const savedClient = await newClient.save();

    res.status(201).json({
      success: true,
      message: "Cliente creado exitosamente",
      data: savedClient
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al crear el cliente",
      error: error.message
    });
  }
};

// Actualizar un cliente
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de cliente no válido"
      });
    }

    // Si se actualiza el email, verificar que no esté en uso
    if (updateData.email) {
      const existingClient = await Client.findOne({ 
        email: updateData.email,
        _id: { $ne: id }
      });
      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: "El email ya está registrado"
        });
      }
    }

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    ).select("-password");

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      message: "Cliente actualizado exitosamente",
      data: updatedClient
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al actualizar el cliente",
      error: error.message
    });
  }
};

// Eliminar un cliente
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de cliente no válido"
      });
    }

    // Verificar si el cliente tiene reservas activas
    const Reservation = (await import("../models/Reservation.js")).default;
    const activeReservations = await Reservation.countDocuments({
      clientId: id,
      status: { $in: ["Pendiente", "En proceso"] }
    });

    if (activeReservations > 0) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar el cliente porque tiene reservas activas"
      });
    }

    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      message: "Cliente eliminado exitosamente"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar el cliente",
      error: error.message
    });
  }
};
