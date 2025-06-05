const db = require('../config/db');

class Categoria {
  // Obtener todas las categorías
  static async obtenerTodas() {
    const [rows] = await db.query('SELECT * FROM categorias');
    return rows;
  }

  // Obtener categoría por ID
  static async obtenerPorId(id) {
    const [rows] = await db.query('SELECT * FROM categorias WHERE categoria_id = ?', [id]);
    return rows[0];
  }

  // Crear nueva categoría
  static async crear({ nombre, descripcion }) {
    const [result] = await db.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion]
    );
    return result.insertId;
  }

  // Actualizar categoría
  static async actualizar(id, { nombre, descripcion }) {
    await db.query(
      'UPDATE categorias SET nombre = ?, descripcion = ? WHERE categoria_id = ?',
      [nombre, descripcion, id]
    );
    return true;
  }

  // Eliminar categoría
  static async eliminar(id) {
    await db.query('DELETE FROM categorias WHERE categoria_id = ?', [id]);
    return true;
  }

  // Obtener vehículos por categoría
  static async obtenerVehiculos(id) {
    const [rows] = await db.query(
      'SELECT * FROM vehiculos WHERE categoria_id = ?',
      [id]
    );
    return rows;
  }
}

module.exports = Categoria;