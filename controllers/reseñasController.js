const Reseña = require('../models/reseñasModel');
const Vehiculo = require('../models/vehiculosModel');
const Usuario = require('../models/usuariosModel');

const reseñasController = {
  // Crear una nueva reseña
  crearReseña: async (req, res, next) => {
    try {
      const { usuario_id, vehiculo_id, calificacion, comentario } = req.body;

      // Validaciones básicas
      if (!usuario_id || !vehiculo_id || !calificacion) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      if (calificacion < 1 || calificacion > 5) {
        return res.status(400).json({ error: 'La calificación debe ser entre 1 y 5' });
      }

      // Verificar si el vehículo existe
      const vehiculo = await Vehiculo.obtenerPorId(vehiculo_id);
      if (!vehiculo) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }

      // Verificar si el usuario existe
      const usuario = await Usuario.obtenerPorId(usuario_id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const reseñaId = await Reseña.crear(usuario_id, vehiculo_id, calificacion, comentario);
      const reseñaCreada = await Reseña.obtenerPorId(reseñaId);

      res.status(201).json(reseñaCreada);
    } catch (err) {
      if (err.message === 'Ya has reseñado este vehículo') {
        return res.status(409).json({ error: err.message });
      }
      next(err);
    }
  },

  // Obtener reseñas por vehículo
  obtenerReseñasVehiculo: async (req, res, next) => {
    try {
      const { vehiculoId } = req.params;
      const { limit = 10, page = 1 } = req.query;
      const offset = (page - 1) * limit;

      // Verificar si el vehículo existe
      const vehiculo = await Vehiculo.obtenerPorId(vehiculoId);
      if (!vehiculo) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }

      const { reseñas, total } = await Reseña.obtenerPorVehiculo(vehiculoId, {
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const estadisticas = await Reseña.obtenerEstadisticasVehiculo(vehiculoId);

      res.json({
        reseñas,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          perPage: parseInt(limit)
        },
        estadisticas
      });
    } catch (err) {
      next(err);
    }
  },

  // Obtener reseñas por usuario
  obtenerReseñasUsuario: async (req, res, next) => {
    try {
      const { usuarioId } = req.params;
      const { limit = 10, page = 1 } = req.query;
      const offset = (page - 1) * limit;

      // Verificar si el usuario existe
      const usuario = await Usuario.obtenerPorId(usuarioId);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const { reseñas, total } = await Reseña.obtenerPorUsuario(usuarioId, {
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        reseñas,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          perPage: parseInt(limit)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // Obtener reseña específica
  obtenerReseña: async (req, res, next) => {
    try {
      const reseña = await Reseña.obtenerPorId(req.params.reseñaId);
      
      if (!reseña) {
        return res.status(404).json({ error: 'Reseña no encontrada' });
      }
      
      res.json(reseña);
    } catch (err) {
      next(err);
    }
  },

  // Actualizar reseña
  actualizarReseña: async (req, res, next) => {
    try {
      const { reseñaId } = req.params;
      const { calificacion, comentario } = req.body;

      if (calificacion && (calificacion < 1 || calificacion > 5)) {
        return res.status(400).json({ error: 'La calificación debe ser entre 1 y 5' });
      }

      await Reseña.actualizar(reseñaId, calificacion, comentario);
      const reseñaActualizada = await Reseña.obtenerPorId(reseñaId);

      res.json(reseñaActualizada);
    } catch (err) {
      if (err.message === 'Reseña no encontrada') {
        return res.status(404).json({ error: err.message });
      }
      next(err);
    }
  },

  // Eliminar reseña
  eliminarReseña: async (req, res, next) => {
    try {
      await Reseña.eliminar(req.params.reseñaId);
      res.json({ message: 'Reseña eliminada correctamente' });
    } catch (err) {
      if (err.message === 'Reseña no encontrada') {
        return res.status(404).json({ error: err.message });
      }
      next(err);
    }
  },

  // Obtener estadísticas de reseñas para un vehículo
  obtenerEstadisticas: async (req, res, next) => {
    try {
      const { vehiculoId } = req.params;

      // Verificar si el vehículo existe
      const vehiculo = await Vehiculo.obtenerPorId(vehiculoId);
      if (!vehiculo) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }

      const estadisticas = await Reseña.obtenerEstadisticasVehiculo(vehiculoId);
      res.json(estadisticas);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = reseñasController;