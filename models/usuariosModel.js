const db = require('../config/db');

class Usuario {
  // Crear un nuevo usuario
  static async crear({ nombre, apellido, email, telefono, direccion, password }) {
    const [result] = await db.query(
      `INSERT INTO usuarios 
       (nombre, apellido, email, telefono, direccion, password) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, email, telefono, direccion, password]
    );
    return result.insertId;
  }

  // Obtener usuario por email
  static async obtenerPorEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE email = ?', 
      [email]
    );
    return rows[0];
  }

  // Obtener usuario por ID (sin password)
  static async obtenerPorId(id) {
    const [rows] = await db.query(
      `SELECT usuario_id, nombre, apellido, email, telefono, direccion, fecha_registro 
       FROM usuarios WHERE usuario_id = ?`, 
      [id]
    );
    return rows[0];
  }

  // Actualizar usuario
  static async actualizar(id, { nombre, apellido, telefono, direccion }) {
    await db.query(
      `UPDATE usuarios 
       SET nombre = ?, apellido = ?, telefono = ?, direccion = ? 
       WHERE usuario_id = ?`,
      [nombre, apellido, telefono, direccion, id]
    );
    return true;
  }

  // Eliminar usuario
  static async eliminar(id) {
    await db.query(
      'DELETE FROM usuarios WHERE usuario_id = ?', 
      [id]
    );
    return true;
  }

  // Listar todos los usuarios (para administración)
  static async listar() {
    const [rows] = await db.query(
      `SELECT usuario_id, nombre, apellido, email, telefono, fecha_registro 
       FROM usuarios`
    );
    return rows;
  }
}

module.exports = Usuario;