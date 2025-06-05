const db = require('../config/db');
const fs = require('fs');
const path = require('path');

class ImagenVehiculo {
  // Obtener todas las imágenes de un vehículo
  static async obtenerPorVehiculo(vehiculoId) {
    const [imagenes] = await db.query(
      'SELECT * FROM imagenes_vehiculos WHERE vehiculo_id = ? ORDER BY orden',
      [vehiculoId]
    );
    return imagenes;
  }

  // Obtener una imagen específica
  static async obtenerPorId(imagenId) {
    const [imagenes] = await db.query(
      'SELECT * FROM imagenes_vehiculos WHERE imagen_id = ?',
      [imagenId]
    );
    return imagenes[0];
  }

  // Agregar una nueva imagen
  static async agregar(vehiculoId, urlImagen, orden = 0, esPrincipal = false) {
    // Si la nueva imagen es principal, quitar el flag de principal de las demás
    if (esPrincipal) {
      await db.query(
        'UPDATE imagenes_vehiculos SET es_principal = FALSE WHERE vehiculo_id = ?',
        [vehiculoId]
      );
    }

    const [result] = await db.query(
      'INSERT INTO imagenes_vehiculos (vehiculo_id, url_imagen, orden, es_principal) VALUES (?, ?, ?, ?)',
      [vehiculoId, urlImagen, orden, esPrincipal]
    );
    return result.insertId;
  }

  // Actualizar información de una imagen
  static async actualizar(imagenId, { orden, esPrincipal }) {
    // Si la imagen se marca como principal, quitar el flag de principal de las demás
    if (esPrincipal) {
      const imagen = await this.obtenerPorId(imagenId);
      await db.query(
        'UPDATE imagenes_vehiculos SET es_principal = FALSE WHERE vehiculo_id = ? AND imagen_id != ?',
        [imagen.vehiculo_id, imagenId]
      );
    }

    await db.query(
      'UPDATE imagenes_vehiculos SET orden = ?, es_principal = ? WHERE imagen_id = ?',
      [orden, esPrincipal, imagenId]
    );
    return true;
  }

  // Eliminar una imagen
  static async eliminar(imagenId) {
    const imagen = await this.obtenerPorId(imagenId);
    if (!imagen) return false;

    // Eliminar el archivo físico si existe en el servidor
    if (imagen.url_imagen.startsWith('/uploads')) {
      const filePath = path.join(__dirname, '..', 'public', imagen.url_imagen);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await db.query(
      'DELETE FROM imagenes_vehiculos WHERE imagen_id = ?',
      [imagenId]
    );
    return true;
  }

  // Obtener la imagen principal de un vehículo
  static async obtenerPrincipal(vehiculoId) {
    const [imagenes] = await db.query(
      'SELECT * FROM imagenes_vehiculos WHERE vehiculo_id = ? AND es_principal = TRUE LIMIT 1',
      [vehiculoId]
    );
    return imagenes[0] || null;
  }

  // Reordenar imágenes de un vehículo
  static async reordenar(vehiculoId, nuevosOrdenes) {
    const transaction = await db.beginTransaction();
    
    try {
      for (const { imagen_id, orden } of nuevosOrdenes) {
        await db.query(
          'UPDATE imagenes_vehiculos SET orden = ? WHERE imagen_id = ? AND vehiculo_id = ?',
          [orden, imagen_id, vehiculoId]
        );
      }
      
      await db.commit(transaction);
      return true;
    } catch (err) {
      await db.rollback(transaction);
      throw err;
    }
  }
}

module.exports = ImagenVehiculo;