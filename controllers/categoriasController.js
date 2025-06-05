const Categoria = require('../models/categoriasModel');

const categoriasController = {
  // Obtener todas las categorías
  obtenerTodas: async (req, res, next) => {
    try {
      const categorias = await Categoria.obtenerTodas();
      res.json(categorias);
    } catch (err) {
      next(err);
    }
  },

  // Obtener categoría por ID
  obtenerPorId: async (req, res, next) => {
    try {
      const categoria = await Categoria.obtenerPorId(req.params.id);
      
      if (!categoria) {
        return res.status(404).json({ 
          error: 'Categoría no encontrada' 
        });
      }
      
      res.json(categoria);
    } catch (err) {
      next(err);
    }
  },

  // Crear nueva categoría
  crear: async (req, res, next) => {
    try {
      const { nombre, descripcion } = req.body;
      
      if (!nombre) {
        return res.status(400).json({ 
          error: 'El nombre de la categoría es requerido' 
        });
      }
      
      const nuevaCategoriaId = await Categoria.crear({ nombre, descripcion });
      const categoriaCreada = await Categoria.obtenerPorId(nuevaCategoriaId);
      
      res.status(201).json(categoriaCreada);
    } catch (err) {
      next(err);
    }
  },

  // Actualizar categoría
  actualizar: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body;
      
      if (!nombre) {
        return res.status(400).json({ 
          error: 'El nombre de la categoría es requerido' 
        });
      }
      
      // Verificar si la categoría existe
      const categoriaExistente = await Categoria.obtenerPorId(id);
      if (!categoriaExistente) {
        return res.status(404).json({ 
          error: 'Categoría no encontrada' 
        });
      }
      
      await Categoria.actualizar(id, { nombre, descripcion });
      const categoriaActualizada = await Categoria.obtenerPorId(id);
      
      res.json(categoriaActualizada);
    } catch (err) {
      next(err);
    }
  },

  // Eliminar categoría
  eliminar: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Verificar si la categoría existe
      const categoriaExistente = await Categoria.obtenerPorId(id);
      if (!categoriaExistente) {
        return res.status(404).json({ 
          error: 'Categoría no encontrada' 
        });
      }
      
      // Verificar si hay vehículos asociados
      const vehiculos = await Categoria.obtenerVehiculos(id);
      if (vehiculos.length > 0) {
        return res.status(400).json({ 
          error: 'No se puede eliminar la categoría porque tiene vehículos asociados' 
        });
      }
      
      await Categoria.eliminar(id);
      res.json({ 
        message: 'Categoría eliminada correctamente' 
      });
    } catch (err) {
      next(err);
    }
  },

  // Obtener vehículos por categoría
  obtenerVehiculos: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Verificar si la categoría existe
      const categoriaExistente = await Categoria.obtenerPorId(id);
      if (!categoriaExistente) {
        return res.status(404).json({ 
          error: 'Categoría no encontrada' 
        });
      }
      
      const vehiculos = await Categoria.obtenerVehiculos(id);
      res.json(vehiculos);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = categoriasController;