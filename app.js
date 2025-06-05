const express = require('express');
const path = require('path');
const app = express();
const db = require('./config/db'); // <--- Agrega esta línea

// ... (otras importaciones)
const usuariosRoutes = require('./routes/usuariosRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const vehiculosRoutes = require('./routes/vehiculosRoutes');
const ordenesRoutes = require('./routes/ordenesRoutes');
const detallesOrdenRoutes = require('./routes/detallesOrdenRoutes');
const imagenesVehiculoRoutes = require('./routes/imagenesVehiculoRoutes');
const reseñasRoutes = require('./routes/reseñasRoutes');

// ... (otros middlewares)







app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Conexión exitosa a la base de datos', solution: rows[0].solution });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
// Usar rutas de usuario
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/detalles-orden', detallesOrdenRoutes);
app.use('/api/imagenes-vehiculo', imagenesVehiculoRoutes);
app.use('/api/resenas', reseñasRoutes);

// ... (resto del código)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});