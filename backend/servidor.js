const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Importar el archivo de rutas de alumnos
const alumnosRoutes = require('../src/routes/alumnosRoutes.js');

const profesoresRoutes = require('../src/routes/profesoresRoutes.js'); // Importar el archivo de rutas de profesores (profesoresRoutes.js)

// Configuración de la base de datos (se mantiene aquí, ya que es global)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'asistencias_escolares'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conexión a MySQL establecida');
});

// Usar el router de alumnos
// Todas las rutas de alumnosRoutes.js estén disponibles
// automáticamente bajo el prefijo '/'
app.use('/alumnos', alumnosRoutes);
app.use('/profesores', profesoresRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});