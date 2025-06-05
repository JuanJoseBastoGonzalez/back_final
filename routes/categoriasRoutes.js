const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');

// Obtener todas las categorías
router.get('/', categoriasController.obtenerTodas);

// Obtener categoría por ID
router.get('/:id', categoriasController.obtenerPorId);

// Crear nueva categoría
router.post('/', categoriasController.crear);

// Actualizar categoría
router.put('/:id', categoriasController.actualizar);

// Eliminar categoría
router.delete('/:id', categoriasController.eliminar);

// Obtener vehículos por categoría
router.get('/:id/vehiculos', categoriasController.obtenerVehiculos);

router.get('/', (req, res) => {
  res.json({ mensaje: 'Ruta de categoria routes funcionando' });
});

module.exports = router;

