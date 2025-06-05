const db = require('../config/db');

class Reseña {
  // Crear una nueva reseña
  static async crear(usuarioId, vehiculoId, calificacion, comentario) {
    // Verificar si el usuario ya ha reseñado este vehículo
    const [reseñaExistente] = await db.query(
      'SELECT * FROM reseñas WHERE usuario_id = ? AND vehiculo_id = ?',
      [usuarioId, vehiculoId]
    );

    if (reseñaExistente.length > 0) {
      throw new Error('Ya has reseñado este vehículo');
    }

    const [result] = await db.query(
      `INSERT INTO reseñas 
       (usuario_id, vehiculo_id, calificacion, comentario) 
       VALUES (?, ?, ?, ?)`,
      [usuarioId, vehiculoId, calificacion, comentario]
    );

    // Actualizar el promedio de calificaciones del vehículo
    await this.actualizarPromedioVehiculo(vehiculoId);

    return result.insertId;
  }

  // Obtener reseñas por vehículo
  static async obtenerPorVehiculo(vehiculoId, { limit, offset }) {
    const query = `
      SELECT r.*, 
             u.nombre as usuario_nombre,
             u.apellido as usuario_apellido
      FROM reseñas r
      JOIN usuarios u ON r.usuario_id = u.usuario_id
      WHERE r.vehiculo_id = ?
      ORDER BY r.fecha DESC
      LIMIT ? OFFSET ?
    `;
    const [reseñas] = await db.query(query, [vehiculoId, limit, offset]);

    // Obtener el conteo total
    const [total] = await db.query(
      'SELECT COUNT(*) as total FROM reseñas WHERE vehiculo_id = ?',
      [vehiculoId]
    );

    return {
      reseñas,
      total: total[0].total
    };
  }

  // Obtener reseñas por usuario
  static async obtenerPorUsuario(usuarioId, { limit, offset }) {
    const query = `
      SELECT r.*, 
             v.marca,
             v.modelo,
             v.año
      FROM reseñas r
      JOIN vehiculos v ON r.vehiculo_id = v.vehiculo_id
      WHERE r.usuario_id = ?
      ORDER BY r.fecha DESC
      LIMIT ? OFFSET ?
    `;
    const [reseñas] = await db.query(query, [usuarioId, limit, offset]);

    // Obtener el conteo total
    const [total] = await db.query(
      'SELECT COUNT(*) as total FROM reseñas WHERE usuario_id = ?',
      [usuarioId]
    );

    return {
      reseñas,
      total: total[0].total
    };
  }

  // Obtener reseña específica
  static async obtenerPorId(reseñaId) {
    const [reseñas] = await db.query(
      `SELECT r.*, 
              u.nombre as usuario_nombre,
              u.apellido as usuario_apellido,
              v.marca,
              v.modelo
       FROM reseñas r
       JOIN usuarios u ON r.usuario_id = u.usuario_id
       JOIN vehiculos v ON r.vehiculo_id = v.vehiculo_id
       WHERE r.reseña_id = ?`,
      [reseñaId]
    );
    return reseñas[0];
  }

  // Actualizar reseña
  static async actualizar(reseñaId, calificacion, comentario) {
    const reseña = await this.obtenerPorId(reseñaId);
    if (!reseña) throw new Error('Reseña no encontrada');

    await db.query(
      'UPDATE reseñas SET calificacion = ?, comentario = ? WHERE reseña_id = ?',
      [calificacion, comentario, reseñaId]
    );

    // Actualizar el promedio de calificaciones del vehículo
    await this.actualizarPromedioVehiculo(reseña.vehiculo_id);

    return true;
  }

  // Eliminar reseña
  static async eliminar(reseñaId) {
    const reseña = await this.obtenerPorId(reseñaId);
    if (!reseña) throw new Error('Reseña no encontrada');

    await db.query(
      'DELETE FROM reseñas WHERE reseña_id = ?',
      [reseñaId]
    );

    // Actualizar el promedio de calificaciones del vehículo
    await this.actualizarPromedioVehiculo(reseña.vehiculo_id);

    return true;
  }

  // Obtener estadísticas de reseñas para un vehículo
  static async obtenerEstadisticasVehiculo(vehiculoId) {
    const [stats] = await db.query(
      `SELECT 
         COUNT(*) as total_reseñas,
         AVG(calificacion) as promedio_calificacion,
         SUM(calificacion = 5) as cinco_estrellas,
         SUM(calificacion = 4) as cuatro_estrellas,
         SUM(calificacion = 3) as tres_estrellas,
         SUM(calificacion = 2) as dos_estrellas,
         SUM(calificacion = 1) as una_estrella
       FROM reseñas
       WHERE vehiculo_id = ?`,
      [vehiculoId]
    );

    return stats[0];
  }

  // Actualizar el promedio de calificaciones del vehículo
  static async actualizarPromedioVehiculo(vehiculoId) {
    const [stats] = await db.query(
      'SELECT AVG(calificacion) as promedio FROM reseñas WHERE vehiculo_id = ?',
      [vehiculoId]
    );

    const promedio = stats[0].promedio || 0;

    await db.query(
      'UPDATE vehiculos SET calificacion_promedio = ? WHERE vehiculo_id = ?',
      [promedio, vehiculoId]
    );

    return promedio;
  }
}

module.exports = Reseña;