const ImagenVehiculo = require('../models/imagenesVehiculoModel');
const Vehiculo = require('../models/vehiculosModel');
const upload = require('../middlewares/uploadMiddleware');
const fs = require('fs');
const path = require('path');

const imagenesVehiculoController = {
  // Obtener todas las imágenes de un vehículo
  obtenerImagenes: async (req, res, next) => {
    try {
      const imagenes = await ImagenVehiculo.obtenerPorVehiculo(req.params.vehiculoId);
      res.json(imagenes);
    } catch (err) {
      next(err);
    }
  },

  // Subir una nueva imagen
  subirImagen: [
    upload.single('imagen'),
    async (req, res, next) => {
      try {
        const { vehiculoId } = req.params;
        const { orden = 0, esPrincipal = false } = req.body;
        
        // Verificar si el vehículo existe
        const vehiculo = await Vehiculo.obtenerPorId(vehiculoId);
        if (!vehiculo) {
          // Eliminar el archivo subido si el vehículo no existe
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(404).json({ error: 'Vehículo no encontrado' });
        }

        if (!req.file) {
          return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
        }

        const urlImagen = `/uploads/vehiculos/${req.file.filename}`;
        const imagenId = await ImagenVehiculo.agregar(
          vehiculoId,
          urlImagen,
          parseInt(orden),
          esPrincipal === 'true'
        );

        const imagen = await ImagenVehiculo.obtenerPorId(imagenId);
        res.status(201).json(imagen);
      } catch (err) {
        // Eliminar el archivo en caso de error
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        next(err);
      }
    }
  ],

  // Actualizar información de una imagen
  actualizarImagen: async (req, res, next) => {
    try {
      const { imagenId } = req.params;
      const { orden, esPrincipal } = req.body;

      await ImagenVehiculo.actualizar(imagenId, {
        orden: orden ? parseInt(orden) : undefined,
        esPrincipal: esPrincipal ? esPrincipal === 'true' : undefined
      });

      const imagenActualizada = await ImagenVehiculo.obtenerPorId(imagenId);
      res.json(imagenActualizada);
    } catch (err) {
      next(err);
    }
  },

  // Eliminar una imagen
  eliminarImagen: async (req, res, next) => {
    try {
      const { imagenId } = req.params;
      await ImagenVehiculo.eliminar(imagenId);
      res.json({ message: 'Imagen eliminada correctamente' });
    } catch (err) {
      next(err);
    }
  },

  // Obtener imagen principal
  obtenerImagenPrincipal: async (req, res, next) => {
    try {
      const imagen = await ImagenVehiculo.obtenerPrincipal(req.params.vehiculoId);
      if (!imagen) {
        return res.status(404).json({ error: 'No se encontró imagen principal' });
      }
      res.json(imagen);
    } catch (err) {
      next(err);
    }
  },

  // Reordenar imágenes
  reordenarImagenes: async (req, res, next) => {
    try {
      const { vehiculoId } = req.params;
      const { nuevosOrdenes } = req.body;

      if (!Array.isArray(nuevosOrdenes)) {
        return res.status(400).json({ error: 'Formato de orden inválido' });
      }

      await ImagenVehiculo.reordenar(vehiculoId, nuevosOrdenes);
      const imagenesActualizadas = await ImagenVehiculo.obtenerPorVehiculo(vehiculoId);
      
      res.json({
        message: 'Imágenes reordenadas correctamente',
        imagenes: imagenesActualizadas
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = imagenesVehiculoController;