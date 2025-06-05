const db = require('../config/db');

class DetalleOrden {
  // Obtener todos los detalles de una orden
  static async obtenerPorOrden(ordenId) {
    const [detalles] = await db.query(
      `SELECT do.*, 
              v.marca, 
              v.modelo,
              v.año,
              v.color,
              (SELECT url_imagen FROM imagenes_vehiculos WHERE vehiculo_id = v.vehiculo_id ORDER BY orden LIMIT 1) as imagen
       FROM detalles_orden do
       JOIN vehiculos v ON do.vehiculo_id = v.vehiculo_id
       WHERE do.orden_id = ?`,
      [ordenId]
    );
    return detalles;
  }

  // Obtener un detalle específico
  static async obtenerPorId(detalleId) {
    const [detalles] = await db.query(
      `SELECT do.*, 
              v.marca, 
              v.modelo,
              v.año,
              v.color,
              o.usuario_id,
              o.estado as orden_estado
       FROM detalles_orden do
       JOIN vehiculos v ON do.vehiculo_id = v.vehiculo_id
       JOIN ordenes o ON do.orden_id = o.orden_id
       WHERE do.detalle_id = ?`,
      [detalleId]
    );
    return detalles[0];
  }

  // Agregar vehículo a una orden existente
  static async agregarVehiculo(ordenId, vehiculoId, precioUnitario, cantidad = 1) {
    const [result] = await db.query(
      `INSERT INTO detalles_orden 
       (orden_id, vehiculo_id, precio_unitario, cantidad) 
       VALUES (?, ?, ?, ?)`,
      [ordenId, vehiculoId, precioUnitario, cantidad]
    );
    
    // Actualizar el total de la orden
    await this.actualizarTotalOrden(ordenId);
    
    return result.insertId;
  }

  // Actualizar cantidad de un detalle
  static async actualizarCantidad(detalleId, nuevaCantidad) {
    await db.query(
      'UPDATE detalles_orden SET cantidad = ? WHERE detalle_id = ?',
      [nuevaCantidad, detalleId]
    );
    
    // Obtener el orden_id para actualizar el total
    const detalle = await this.obtenerPorId(detalleId);
    await this.actualizarTotalOrden(detalle.orden_id);
    
    return true;
  }

  // Eliminar un detalle de orden
  static async eliminar(detalleId) {
    // Obtener el detalle primero para tener el orden_id
    const detalle = await this.obtenerPorId(detalleId);
    
    await db.query(
      'DELETE FROM detalles_orden WHERE detalle_id = ?',
      [detalleId]
    );
    
    // Actualizar el total de la orden
    await this.actualizarTotalOrden(detalle.orden_id);
    
    return true;
  }

  // Actualizar el total de una orden
  static async actualizarTotalOrden(ordenId) {
    await db.query(
      `UPDATE ordenes o
       SET total = (
         SELECT SUM(precio_unitario * cantidad)
         FROM detalles_orden 
         WHERE orden_id = o.orden_id
       )
       WHERE orden_id = ?`,
      [ordenId]
    );
    return true;
  }
}

module.exports = DetalleOrden;