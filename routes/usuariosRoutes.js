const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Registro y autenticación
router.post('/registro', usuariosController.registrar);
router.post('/login', usuariosController.login);

// Perfil de usuario
router.get('/:id', usuariosController.obtenerPerfil);
router.put('/:id', usuariosController.actualizarPerfil);
router.delete('/:id', usuariosController.eliminarUsuario);

// Administración (podrías agregar middlewares de autenticación aquí)
router.get('/', usuariosController.listarUsuarios);

router.get('/', (req, res) => {
  res.json({ mensaje: 'Ruta de usuario funcionando' });
});

module.exports = router;
