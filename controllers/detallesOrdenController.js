const DetalleOrden = require('../models/detallesOrdenModel');
const Vehiculo = require('../models/vehiculosModel');
const Orden = require('../models/ordenesModel');

const detallesOrdenController = {
  // Obtener todos los detalles de una orden
  obtenerDetallesOrden: async (req, res, next) => {
    try {
      const detalles = await DetalleOrden.obtenerPorOrden(req.params.ordenId);
      res.json(detalles);
    } catch (err) {
      next(err);
    }
  },

  // Obtener un detalle específico
  obtenerDetalle: async (req, res, next) => {
    try {
      const detalle = await DetalleOrden.obtenerPorId(req.params.detalleId);
      
      if (!detalle) {
        return res.status(404).json({ error: 'Detalle de orden no encontrado' });
      }
      
      res.json(detalle);
    } catch (err) {
      next(err);
    }
  },

  // Agregar vehículo a una orden existente
  agregarVehiculo: async (req, res, next) => {
    try {
      const { ordenId } = req.params;
      const { vehiculo_id, cantidad = 1 } = req.body;
      
      // Verificar si el vehículo existe y está disponible
      const vehiculo = await Vehiculo.obtenerPorId(vehiculo_id);
      if (!vehiculo || !vehiculo.disponible) {
        return res.status(400).json({ 
          error: 'El vehículo no está disponible' 
        });
      }
      
      // Verificar si la orden existe y está en estado pendiente
      const orden = await Orden.obtenerPorId(ordenId);
      if (!orden || orden.estado !== 'pendiente') {
        return res.status(400).json({ 
          error: 'No se puede modificar la orden en su estado actual' 
        });
      }
      
      // Agregar el vehículo a la orden
      const detalleId = await DetalleOrden.agregarVehiculo(
        ordenId,
        vehiculo_id,
        vehiculo.precio,
        cantidad
      );
      
      // Marcar el vehículo como no disponible
      await Vehiculo.actualizar(vehiculo_id, { disponible: false });
      
      // Obtener el detalle completo para la respuesta
      const detalleCompleto = await DetalleOrden.obtenerPorId(detalleId);
      res.status(201).json(detalleCompleto);
      
    } catch (err) {
      next(err);
    }
  },

  // Actualizar cantidad de un vehículo en la orden
  actualizarCantidad: async (req, res, next) => {
    try {
      const { detalleId } = req.params;
      const { cantidad } = req.body;
      
      if (!cantidad || cantidad < 1) {
        return res.status(400).json({ 
          error: 'La cantidad debe ser al menos 1' 
        });
      }
      
      // Verificar si el detalle existe
      const detalle = await DetalleOrden.obtenerPorId(detalleId);
      if (!detalle) {
        return res.status(404).json({ 
          error: 'Detalle de orden no encontrado' 
        });
      }
      
      // Verificar si la orden está en estado pendiente
      if (detalle.orden_estado !== 'pendiente') {
        return res.status(400).json({ 
          error: 'No se puede modificar la orden en su estado actual' 
        });
      }
      
      await DetalleOrden.actualizarCantidad(detalleId, cantidad);
      const detalleActualizado = await DetalleOrden.obtenerPorId(detalleId);
      
      res.json(detalleActualizado);
    } catch (err) {
      next(err);
    }
  },

  // Eliminar un vehículo de la orden
  eliminarVehiculo: async (req, res, next) => {
    try {
      const { detalleId } = req.params;
      
      // Verificar si el detalle existe
      const detalle = await DetalleOrden.obtenerPorId(detalleId);
      if (!detalle) {
        return res.status(404).json({ 
          error: 'Detalle de orden no encontrado' 
        });
      }
      
      // Verificar si la orden está en estado pendiente
      if (detalle.orden_estado !== 'pendiente') {
        return res.status(400).json({ 
          error: 'No se puede modificar la orden en su estado actual' 
        });
      }
      
      // Eliminar el detalle
      await DetalleOrden.eliminar(detalleId);
      
      // Marcar el vehículo como disponible nuevamente
      await Vehiculo.actualizar(detalle.vehiculo_id, { disponible: true });
      
      res.json({ 
        message: 'Vehículo eliminado de la orden correctamente' 
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = detallesOrdenController;