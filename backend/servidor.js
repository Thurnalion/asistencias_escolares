const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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

const getAlumnosRoutes = require('../src/routes/alumnosRoutes');
const getProfesoresRoutes = require('../src/routes/profesoresRoutes');
const getClasesRoutes = require('../src/routes/clasesRoutes');

// Usar el router de alumnos
// automáticamente bajo el prefijo '/'
app.use('/alumnos', getAlumnosRoutes (db));
app.use('/profesores', getProfesoresRoutes (db));
app.use('/clases', getClasesRoutes (db));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});