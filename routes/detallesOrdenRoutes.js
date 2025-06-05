const express = require('express');
const router = express.Router();
const detallesOrdenController = require('../controllers/detallesOrdenController');

// Obtener todos los detalles de una orden
router.get('/orden/:ordenId', detallesOrdenController.obtenerDetallesOrden);

// Obtener un detalle específico
router.get('/:detalleId', detallesOrdenController.obtenerDetalle);

// Agregar vehículo a una orden existente
router.post('/orden/:ordenId/vehiculos', detallesOrdenController.agregarVehiculo);

// Actualizar cantidad de un vehículo en la orden
router.put('/:detalleId/cantidad', detallesOrdenController.actualizarCantidad);

// Eliminar un vehículo de la orden
router.delete('/:detalleId', detallesOrdenController.eliminarVehiculo);

router.get('/', (req, res) => {
  res.json({ mensaje: 'Ruta de detaller orden funcionando' });
});

module.exports = router;