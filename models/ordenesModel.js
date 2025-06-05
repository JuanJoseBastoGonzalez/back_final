const db = require('../config/db');

class Orden {
  // Crear una nueva orden
  static async crear(usuarioId, total, direccionEnv) {
    const [result] = await db.query(
      `INSERT INTO ordenes 
       (usuario_id, total, direccion_envio) 
       VALUES (?, ?, ?)`,
      [usuarioId, total, direccionEnv]
    );
    return result.insertId;
  }

  // Agregar vehículo a una orden
  static async agregarVehiculo(ordenId, vehiculoId, precioUnitario, cantidad = 1) {
    await db.query(
      `INSERT INTO detalles_orden 
       (orden_id, vehiculo_id, precio_unitario, cantidad) 
       VALUES (?, ?, ?, ?)`,
      [ordenId, vehiculoId, precioUnitario, cantidad]
    );
    return true;
  }

  // Obtener orden por ID con detalles
  static async obtenerPorId(ordenId) {
    // Obtener información básica de la orden
    const [orden] = await db.query(
      `SELECT o.*, 
              u.nombre as usuario_nombre, 
              u.apellido as usuario_apellido,
              u.email as usuario_email
       FROM ordenes o
       JOIN usuarios u ON o.usuario_id = u.usuario_id
       WHERE o.orden_id = ?`,
      [ordenId]
    );

    if (orden.length === 0) return null;

    // Obtener los vehículos de la orden
    const [detalles] = await db.query(
      `SELECT do.*, 
              v.marca, 
              v.modelo,
              v.año,
              (SELECT url_imagen FROM imagenes_vehiculos WHERE vehiculo_id = v.vehiculo_id ORDER BY orden LIMIT 1) as imagen
       FROM detalles_orden do
       JOIN vehiculos v ON do.vehiculo_id = v.vehiculo_id
       WHERE do.orden_id = ?`,
      [ordenId]
    );

    return {
      ...orden[0],
      vehiculos: detalles
    };
  }

  // Obtener todas las órdenes de un usuario
  static async obtenerPorUsuario(usuarioId) {
    const [ordenes] = await db.query(
      `SELECT o.* FROM ordenes o
       WHERE o.usuario_id = ?
       ORDER BY o.fecha_orden DESC`,
      [usuarioId]
    );

    // Para cada orden, obtener los detalles
    const ordenesConDetalles = await Promise.all(
      ordenes.map(async orden => {
        const [detalles] = await db.query(
          `SELECT do.*, v.marca, v.modelo, v.año,
                  (SELECT url_imagen FROM imagenes_vehiculos WHERE vehiculo_id = v.vehiculo_id ORDER BY orden LIMIT 1) as imagen
           FROM detalles_orden do
           JOIN vehiculos v ON do.vehiculo_id = v.vehiculo_id
           WHERE do.orden_id = ?`,
          [orden.orden_id]
        );
        return {
          ...orden,
          vehiculos: detalles
        };
      })
    );

    return ordenesConDetalles;
  }

  // Actualizar estado de una orden
  static async actualizarEstado(ordenId, nuevoEstado) {
    await db.query(
      'UPDATE ordenes SET estado = ? WHERE orden_id = ?',
      [nuevoEstado, ordenId]
    );
    return true;
  }

  // Obtener todas las órdenes (para administración)
  static async obtenerTodas() {
    const [ordenes] = await db.query(
      `SELECT o.*, 
              u.nombre as usuario_nombre, 
              u.apellido as usuario_apellido
       FROM ordenes o
       JOIN usuarios u ON o.usuario_id = u.usuario_id
       ORDER BY o.fecha_orden DESC`
    );

    return ordenes;
  }
}

module.exports = Orden;