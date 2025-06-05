const Orden = require('../models/ordenesModel');
const Vehiculo = require('../models/vehiculosModel');

const ordenesController = {
  // Crear una nueva orden
  crearOrden: async (req, res, next) => {
    try {
      const { usuario_id, vehiculos, direccion_envio } = req.body;

      // Validaciones básicas
      if (!usuario_id || !vehiculos || !Array.isArray(vehiculos) || vehiculos.length === 0) {
        return res.status(400).json({ error: 'Datos de orden inválidos' });
      }

      // Calcular el total de la orden
      let total = 0;
      const vehiculosInfo = [];

      // Verificar disponibilidad y precios de los vehículos
      for (const item of vehiculos) {
        const vehiculo = await Vehiculo.obtenerPorId(item.vehiculo_id);
        
        if (!vehiculo || !vehiculo.disponible) {
          return res.status(400).json({ 
            error: `El vehículo con ID ${item.vehiculo_id} no está disponible` 
          });
        }

        total += vehiculo.precio * (item.cantidad || 1);
        vehiculosInfo.push({
          vehiculo_id: item.vehiculo_id,
          precio_unitario: vehiculo.precio,
          cantidad: item.cantidad || 1
        });
      }

      // Crear la orden en la base de datos
      const ordenId = await Orden.crear(usuario_id, total, direccion_envio);

      // Agregar los vehículos a la orden
      for (const vehiculo of vehiculosInfo) {
        await Orden.agregarVehiculo(
          ordenId,
          vehiculo.vehiculo_id,
          vehiculo.precio_unitario,
          vehiculo.cantidad
        );

        // Marcar el vehículo como no disponible
        await Vehiculo.actualizar(vehiculo.vehiculo_id, { disponible: false });
      }

      // Obtener la orden completa para la respuesta
      const ordenCompleta = await Orden.obtenerPorId(ordenId);
      res.status(201).json(ordenCompleta);

    } catch (err) {
      next(err);
    }
  },

  // Obtener una orden por ID
  obtenerOrden: async (req, res, next) => {
    try {
      const orden = await Orden.obtenerPorId(req.params.id);
      
      if (!orden) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }
      
      res.json(orden);
    } catch (err) {
      next(err);
    }
  },

  // Obtener órdenes de un usuario
  obtenerOrdenesUsuario: async (req, res, next) => {
    try {
      const ordenes = await Orden.obtenerPorUsuario(req.params.usuarioId);
      res.json(ordenes);
    } catch (err) {
      next(err);
    }
  },

  // Actualizar estado de una orden
  actualizarEstado: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const estadosValidos = ['pendiente', 'procesando', 'completada', 'cancelada'];
      
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: 'Estado de orden inválido' });
      }

      await Orden.actualizarEstado(id, estado);
      
      // Si la orden se cancela, volver a marcar los vehículos como disponibles
      if (estado === 'cancelada') {
        const orden = await Orden.obtenerPorId(id);
        for (const vehiculo of orden.vehiculos) {
          await Vehiculo.actualizar(vehiculo.vehiculo_id, { disponible: true });
        }
      }

      res.json({ message: 'Estado de orden actualizado correctamente' });
    } catch (err) {
      next(err);
    }
  },

  // Obtener todas las órdenes (admin)
  obtenerTodas: async (req, res, next) => {
    try {
      const ordenes = await Orden.obtenerTodas();
      res.json(ordenes);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ordenesController;