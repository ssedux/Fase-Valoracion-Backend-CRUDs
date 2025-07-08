import Reservation from "../models/Reservation.js";
import Client from "../models/Client.js";
import mongoose from "mongoose";

// Obtener todas las reservas
export const getAllReservations = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      clientId, 
      status, 
      service,
      startDate,
      endDate 
    } = req.query;
    
    // Construir filtros
    const filters = {};
    
    if (clientId) {
      if (!mongoose.Types.ObjectId.isValid(clientId)) {
        return res.status(400).json({
          success: false,
          message: "ID de cliente no válido"
        });
      }
      filters.clientId = clientId;
    }
    
    if (status) {
      filters.status = status;
    }
    
    if (service) {
      filters.service = { $regex: service, $options: "i" };
    }
    
    // Filtro por rango de fechas
    if (startDate || endDate) {
      filters.scheduledDate = {};
      if (startDate) {
        filters.scheduledDate.$gte = new Date(startDate);
      }
      if (endDate) {
        filters.scheduledDate.$lte = new Date(endDate);
      }
    }

    // Configurar paginación
    const skip = (page - 1) * limit;
    
    const reservations = await Reservation.find(filters)
      .populate("clientId", "name email phone")
      .limit(limit * 1)
      .skip(skip)
      .sort({ scheduledDate: 1 });

    const total = await Reservation.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: reservations,
      pagination: {
        currentPage: page * 1,
        totalPages: Math.ceil(total / limit),
        totalReservations: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las reservas",
      error: error.message
    });
  }
};

// Obtener una reserva por ID
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de reserva no válido"
      });
    }

    const reservation = await Reservation.findById(id)
      .populate("clientId", "name email phone");

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener la reserva",
      error: error.message
    });
  }
};

// Crear una nueva reserva
export const createReservation = async (req, res) => {
  try {
    const { clientId, vehicle, service, scheduledDate, notes } = req.body;

    // Verificar que el cliente existe
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "ID de cliente no válido"
      });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
      });
    }

    // Verificar que la fecha no esté en el pasado
    if (new Date(scheduledDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "La fecha programada debe ser en el futuro"
      });
    }

    const newReservation = new Reservation({
      clientId,
      vehicle,
      service,
      scheduledDate,
      notes
    });

    const savedReservation = await newReservation.save();
    
    // Poblar los datos del cliente
    const populatedReservation = await Reservation.findById(savedReservation._id)
      .populate("clientId", "name email phone");

    res.status(201).json({
      success: true,
      message: "Reserva creada exitosamente",
      data: populatedReservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la reserva",
      error: error.message
    });
  }
};

// Actualizar una reserva
export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de reserva no válido"
      });
    }

    // Si se actualiza el clientId, verificar que el cliente existe
    if (updateData.clientId) {
      if (!mongoose.Types.ObjectId.isValid(updateData.clientId)) {
        return res.status(400).json({
          success: false,
          message: "ID de cliente no válido"
        });
      }

      const client = await Client.findById(updateData.clientId);
      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado"
        });
      }
    }

    // Si se actualiza la fecha, verificar que no esté en el pasado
    if (updateData.scheduledDate && new Date(updateData.scheduledDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "La fecha programada debe ser en el futuro"
      });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate("clientId", "name email phone");

    if (!updatedReservation) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      message: "Reserva actualizada exitosamente",
      data: updatedReservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la reserva",
      error: error.message
    });
  }
};

// Eliminar una reserva
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de reserva no válido"
      });
    }

    const deletedReservation = await Reservation.findByIdAndDelete(id);

    if (!deletedReservation) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      message: "Reserva eliminada exitosamente"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar la reserva",
      error: error.message
    });
  }
};

// Obtener reservas por cliente
export const getReservationsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "ID de cliente no válido"
      });
    }

    // Verificar que el cliente existe
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
      });
    }

    const filters = { clientId };
    if (status) {
      filters.status = status;
    }

    const skip = (page - 1) * limit;
    
    const reservations = await Reservation.find(filters)
      .populate("clientId", "name email phone")
      .limit(limit * 1)
      .skip(skip)
      .sort({ scheduledDate: 1 });

    const total = await Reservation.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: reservations,
      pagination: {
        currentPage: page * 1,
        totalPages: Math.ceil(total / limit),
        totalReservations: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las reservas del cliente",
      error: error.message
    });
  }
};
