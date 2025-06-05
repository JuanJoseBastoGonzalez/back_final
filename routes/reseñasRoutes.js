const express = require('express');
const router = express.Router();
const reseñasController = require('../controllers/reseñasController');

// Crear una nueva reseña
router.post('/', reseñasController.crearReseña);

// Obtener reseñas por vehículo
router.get('/vehiculo/:vehiculoId', reseñasController.obtenerReseñasVehiculo);

// Obtener reseñas por usuario
router.get('/usuario/:usuarioId', reseñasController.obtenerReseñasUsuario);

// Obtener reseña específica
router.get('/:reseñaId', reseñasController.obtenerReseña);

// Actualizar reseña
router.put('/:reseñaId', reseñasController.actualizarReseña);

// Eliminar reseña
router.delete('/:reseñaId', reseñasController.eliminarReseña);

// Obtener estadísticas de reseñas para un vehículo
router.get('/vehiculo/:vehiculoId/estadisticas', reseñasController.obtenerEstadisticas);
router.get('/', (req, res) => {
  res.json({ mensaje: 'Ruta de reseñas funcionando' });
});
module.exports = router;