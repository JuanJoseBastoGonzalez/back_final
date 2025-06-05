const express = require('express');
const router = express.Router();
const ordenesController = require('../controllers/ordenesController');

// Crear una nueva orden
router.post('/', ordenesController.crearOrden);

// Obtener una orden específica
router.get('/:id', ordenesController.obtenerOrden);

// Obtener órdenes de un usuario
router.get('/usuario/:usuarioId', ordenesController.obtenerOrdenesUsuario);

// Actualizar estado de una orden
router.put('/:id/estado', ordenesController.actualizarEstado);

// Obtener todas las órdenes (admin)
router.get('/', ordenesController.obtenerTodas);

router.get('/', (req, res) => {
  res.json({ mensaje: 'Ruta de ordenes funcionando' });
});

module.exports = router;