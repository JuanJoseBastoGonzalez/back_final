const db = require('../config/db');

class Vehiculo {
  // Obtener todos los vehículos con filtros
  static async obtenerTodos({ categoria, marca, minPrecio, maxPrecio, limit, offset }) {
    let query = 'SELECT * FROM vehiculos WHERE disponible = TRUE';
    const params = [];

    if (categoria) {
      query += ' AND categoria_id = ?';
      params.push(categoria);
    }

    if (marca) {
      query += ' AND marca = ?';
      params.push(marca);
    }

    if (minPrecio) {
      query += ' AND precio >= ?';
      params.push(minPrecio);
    }

    if (maxPrecio) {
      query += ' AND precio <= ?';
      params.push(maxPrecio);
    }

    // Ordenar por fecha de publicación descendente
    query += ' ORDER BY fecha_publicacion DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
    }

    if (offset) {
      query += ' OFFSET ?';
      params.push(offset);
    }

    const [vehiculos] = await db.query(query, params);
    return vehiculos;
  }

  // Obtener un vehículo por ID
  static async obtenerPorId(id) {
    const [rows] = await db.query(`
      SELECT v.*, c.nombre as categoria_nombre 
      FROM vehiculos v
      LEFT JOIN categorias c ON v.categoria_id = c.categoria_id
      WHERE v.vehiculo_id = ?
    `, [id]);
    return rows[0];
  }

  // Crear un nuevo vehículo
  static async crear(vehiculoData) {
    const { categoria_id, marca, modelo, año, precio, kilometraje, color, descripcion } = vehiculoData;
    const [result] = await db.query(
      `INSERT INTO vehiculos 
       (categoria_id, marca, modelo, año, precio, kilometraje, color, descripcion) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [categoria_id, marca, modelo, año, precio, kilometraje, color, descripcion]
    );
    return result.insertId;
  }

  // Actualizar un vehículo
  static async actualizar(id, vehiculoData) {
    const { categoria_id, marca, modelo, año, precio, kilometraje, color, descripcion, disponible } = vehiculoData;
    await db.query(
      `UPDATE vehiculos 
       SET categoria_id = ?, marca = ?, modelo = ?, año = ?, precio = ?, 
           kilometraje = ?, color = ?, descripcion = ?, disponible = ?
       WHERE vehiculo_id = ?`,
      [categoria_id, marca, modelo, año, precio, kilometraje, color, descripcion, disponible, id]
    );
    return true;
  }

  // Eliminar un vehículo
  static async eliminar(id) {
    await db.query('DELETE FROM vehiculos WHERE vehiculo_id = ?', [id]);
    return true;
  }

  // Obtener imágenes de un vehículo
  static async obtenerImagenes(vehiculoId) {
    const [imagenes] = await db.query(
      'SELECT * FROM imagenes_vehiculos WHERE vehiculo_id = ? ORDER BY orden',
      [vehiculoId]
    );
    return imagenes;
  }

  // Añadir imagen a un vehículo
  static async agregarImagen(vehiculoId, urlImagen, orden = 0) {
    const [result] = await db.query(
      'INSERT INTO imagenes_vehiculos (vehiculo_id, url_imagen, orden) VALUES (?, ?, ?)',
      [vehiculoId, urlImagen, orden]
    );
    return result.insertId;
  }

  // Eliminar imagen de un vehículo
  static async eliminarImagen(imagenId) {
    await db.query('DELETE FROM imagenes_vehiculos WHERE imagen_id = ?', [imagenId]);
    return true;
  }

  // Obtener marcas disponibles
  static async obtenerMarcas() {
    const [marcas] = await db.query('SELECT DISTINCT marca FROM vehiculos ORDER BY marca');
    return marcas.map(item => item.marca);
  }
}

module.exports = Vehiculo;