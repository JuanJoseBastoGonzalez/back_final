const express = require('express');
const router = express.Router();
const imagenesVehiculoController = require('../controllers/imagenesVehiculoController');

// Obtener todas las imágenes de un vehículo
router.get('/vehiculo/:vehiculoId', imagenesVehiculoController.obtenerImagenes);

// Obtener imagen principal de un vehículo
router.get('/vehiculo/:vehiculoId/principal', imagenesVehiculoController.obtenerImagenPrincipal);

// Subir nueva imagen
router.post('/vehiculo/:vehiculoId', imagenesVehiculoController.subirImagen);

// Actualizar información de imagen
router.put('/:imagenId', imagenesVehiculoController.actualizarImagen);

// Eliminar imagen
router.delete('/:imagenId', imagenesVehiculoController.eliminarImagen);

// Reordenar imágenes
router.post('/vehiculo/:vehiculoId/reordenar', imagenesVehiculoController.reordenarImagenes);

router.get('/', (req, res) => {
  res.json({ mensaje: 'Ruta de ordenes vehiclos funcionando' });
});

module.exports = router;