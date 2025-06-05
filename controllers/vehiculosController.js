const Vehiculo = require('../models/vehiculosModel');

const vehiculosController = {
  // Obtener todos los vehículos con filtros
  obtenerTodos: async (req, res, next) => {
    try {
      const { categoria, marca, minPrecio, maxPrecio, limit, page } = req.query;
      const offset = page ? (parseInt(page) - 1) * (limit || 10) : 0;
      
      const vehiculos = await Vehiculo.obtenerTodos({
        categoria,
        marca,
        minPrecio: parseFloat(minPrecio),
        maxPrecio: parseFloat(maxPrecio),
        limit: limit ? parseInt(limit) : undefined,
        offset
      });
      
      res.json(vehiculos);
    } catch (err) {
      next(err);
    }
  },

  // Obtener un vehículo por ID
  obtenerPorId: async (req, res, next) => {
    try {
      const vehiculo = await Vehiculo.obtenerPorId(req.params.id);
      
      if (!vehiculo) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
      
      // Obtener imágenes del vehículo
      vehiculo.imagenes = await Vehiculo.obtenerImagenes(req.params.id);
      
      res.json(vehiculo);
    } catch (err) {
      next(err);
    }
  },

  // Crear un nuevo vehículo
  crear: async (req, res, next) => {
    try {
      const { categoria_id, marca, modelo, año, precio, kilometraje, color, descripcion } = req.body;
      
      // Validaciones básicas
      if (!marca || !modelo || !año || !precio) {
        return res.status(400).json({ 
          error: 'Marca, modelo, año y precio son requeridos' 
        });
      }
      
      const nuevoVehiculoId = await Vehiculo.crear({
        categoria_id,
        marca,
        modelo,
        año: parseInt(año),
        precio: parseFloat(precio),
        kilometraje: kilometraje ? parseInt(kilometraje) : null,
        color,
        descripcion
      });
      
      const vehiculoCreado = await Vehiculo.obtenerPorId(nuevoVehiculoId);
      res.status(201).json(vehiculoCreado);
    } catch (err) {
      next(err);
    }
  },

  // Actualizar un vehículo
  actualizar: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { categoria_id, marca, modelo, año, precio, kilometraje, color, descripcion, disponible } = req.body;
      
      // Verificar si el vehículo existe
      const vehiculoExistente = await Vehiculo.obtenerPorId(id);
      if (!vehiculoExistente) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
      
      await Vehiculo.actualizar(id, {
        categoria_id,
        marca,
        modelo,
        año: parseInt(año),
        precio: parseFloat(precio),
        kilometraje: kilometraje ? parseInt(kilometraje) : null,
        color,
        descripcion,
        disponible: disponible !== undefined ? disponible : vehiculoExistente.disponible
      });
      
      const vehiculoActualizado = await Vehiculo.obtenerPorId(id);
      res.json(vehiculoActualizado);
    } catch (err) {
      next(err);
    }
  },

  // Eliminar un vehículo
  eliminar: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Verificar si el vehículo existe
      const vehiculoExistente = await Vehiculo.obtenerPorId(id);
      if (!vehiculoExistente) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
      
      await Vehiculo.eliminar(id);
      res.json({ message: 'Vehículo eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  },

  // Agregar imagen a un vehículo
  agregarImagen: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { url_imagen, orden } = req.body;
      
      // Verificar si el vehículo existe
      const vehiculoExistente = await Vehiculo.obtenerPorId(id);
      if (!vehiculoExistente) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
      
      const imagenId = await Vehiculo.agregarImagen(id, url_imagen, orden || 0);
      res.status(201).json({ 
        id: imagenId,
        vehiculo_id: id,
        url_imagen,
        orden: orden || 0
      });
    } catch (err) {
      next(err);
    }
  },

  // Eliminar imagen de un vehículo
  eliminarImagen: async (req, res, next) => {
    try {
      const { id, imagenId } = req.params;
      
      // Verificar si el vehículo existe
      const vehiculoExistente = await Vehiculo.obtenerPorId(id);
      if (!vehiculoExistente) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
      
      await Vehiculo.eliminarImagen(imagenId);
      res.json({ message: 'Imagen eliminada correctamente' });
    } catch (err) {
      next(err);
    }
  },

  // Obtener marcas disponibles
  obtenerMarcas: async (req, res, next) => {
    try {
      const marcas = await Vehiculo.obtenerMarcas();
      res.json(marcas);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = vehiculosController;