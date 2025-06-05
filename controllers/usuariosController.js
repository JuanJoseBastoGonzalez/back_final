const Usuario = require('../models/usuariosModel');

const usuariosController = {
  // Registro de nuevo usuario
  registrar: async (req, res, next) => {
    try {
      const { nombre, apellido, email, telefono, direccion, password } = req.body;
      
      // Validaciones básicas
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email y contraseña son requeridos' 
        });
      }

      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.obtenerPorEmail(email);
      if (usuarioExistente) {
        return res.status(409).json({ 
          error: 'El email ya está registrado' 
        });
      }

      // Crear nuevo usuario
      const nuevoUsuarioId = await Usuario.crear({
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        password // En producción, deberías hashear la contraseña aquí
      });

      // Obtener los datos del usuario sin el password
      const usuarioCreado = await Usuario.obtenerPorId(nuevoUsuarioId);
      
      res.status(201).json(usuarioCreado);
    } catch (err) {
      next(err);
    }
  },

  // Login de usuario
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email y contraseña son requeridos' 
        });
      }

      const usuario = await Usuario.obtenerPorEmail(email);
      
      // Verificar credenciales
      if (!usuario || usuario.password !== password) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas' 
        });
      }
      
      // Eliminar password del objeto usuario
      const { password: _, ...usuarioSinPassword } = usuario;
      
      res.json(usuarioSinPassword);
    } catch (err) {
      next(err);
    }
  },

  // Obtener perfil de usuario
  obtenerPerfil: async (req, res, next) => {
    try {
      const usuario = await Usuario.obtenerPorId(req.params.id);
      
      if (!usuario) {
        return res.status(404).json({ 
          error: 'Usuario no encontrado' 
        });
      }
      
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  },

  // Actualizar perfil de usuario
  actualizarPerfil: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nombre, apellido, telefono, direccion } = req.body;
      
      await Usuario.actualizar(id, { 
        nombre, 
        apellido, 
        telefono, 
        direccion 
      });
      
      const usuarioActualizado = await Usuario.obtenerPorId(id);
      res.json(usuarioActualizado);
    } catch (err) {
      next(err);
    }
  },

  // Eliminar usuario
  eliminarUsuario: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Verificar si el usuario existe
      const usuario = await Usuario.obtenerPorId(id);
      if (!usuario) {
        return res.status(404).json({ 
          error: 'Usuario no encontrado' 
        });
      }
      
      await Usuario.eliminar(id);
      res.json({ 
        message: 'Usuario eliminado correctamente' 
      });
    } catch (err) {
      next(err);
    }
  },

  // Listar todos los usuarios (solo para administradores)
  listarUsuarios: async (req, res, next) => {
    try {
      const usuarios = await Usuario.listar();
      res.json(usuarios);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = usuariosController;