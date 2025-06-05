const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculosController');

// Obtener todos los vehículos (con filtros opcionales)
router.get('/', vehiculosController.obtenerTodos);

// Obtener marcas disponibles
router.get('/marcas', vehiculosController.obtenerMarcas);

// Obtener un vehículo por ID
router.get('/:id', vehiculosController.obtenerPorId);

// Crear un nuevo vehículo
router.post('/', vehiculosController.crear);

// Actualizar un vehículo
router.put('/:id', vehiculosController.actualizar);

// Eliminar un vehículo
router.delete('/:id', vehiculosController.eliminar);

// Agregar imagen a un vehículo
router.post('/:id/imagenes', vehiculosController.agregarImagen);

// Eliminar imagen de un vehículo
router.delete('/:id/imagenes/:imagenId', vehiculosController.eliminarImagen);

router.get('/', (req, res) => {
  res.json({ mensaje: 'Ruta de vehiculos funcionando' });
});

//gfdgsdfg
module.exports = router;

