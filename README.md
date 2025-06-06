# Backend Node.js - Cloud Computing

Este proyecto es un backend desarrollado en Node.js y Express, conectado a MySQL, pensado para la gestión de usuarios, vehículos, órdenes y más.

## Características

- Registro y autenticación de usuarios
- Gestión de categorías y vehículos
- Gestión de órdenes y detalles de órdenes
- Subida y gestión de imágenes de vehículos
- Reseñas de usuarios
- Conexión a base de datos MySQL (Clever Cloud o local)
- CORS habilitado para peticiones desde frontend

## Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/JuanJoseBastoGonzalez
   cd back-2.0
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   Crea un archivo `.env` en la raíz con el siguiente contenido:
   ```
   DB_HOST=tu_host
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=tu_base_de_datos
   DB_PORT=3306
   ```

4. **Inicia el servidor:**
   ```bash
   npm start
   ```
   El servidor correrá en [http://localhost:3000](http://localhost:3000) por defecto.

## Endpoints principales

- **Registro de usuario:**  
  `POST /api/usuarios/registro`
- **Login de usuario:**  
  `POST /api/usuarios/login`
- **Obtener perfil:**  
  `GET /api/usuarios/:id`
- **Actualizar perfil:**  
  `PUT /api/usuarios/:id`
- **Eliminar usuario:**  
  `DELETE /api/usuarios/:id`
- **Listar usuarios:**  
  `GET /api/usuarios/`
- **Categorías:**  
  `GET /api/categorias/`
- **Vehículos:**  
  `GET /api/vehiculos/`
- **Órdenes:**  
  `GET /api/ordenes/`
- **Detalles de orden:**  
  `GET /api/detalles-orden/`
- **Imágenes de vehículo:**  
  `GET /api/imagenes-vehiculo/`
- **Reseñas:**  
  `GET /api/resenas/`

## Prueba de conexión a la base de datos

Puedes probar la conexión accediendo a:
```
GET /api/test-db
```

## Producción

El endpoint de registro en producción sería, por ejemplo:  
`POST https://back-final-whc4.onrender.com/api/usuarios/registro`

---

## Autor

- **GitHub:** [JuanJoseBastoGonzalez](https://github.com/JuanJoseBastoGonzalez)
- **LinkedIn:** [Juan Jose Basto Gonzalez](https://www.linkedin.com/in/juan-jose-basto-gonzalez-49945023a/)

2025
