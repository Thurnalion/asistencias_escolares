const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configurar la conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'asistencias_escolares' // Cambia por el nombre de tu BD
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conexión a MySQL establecida');
});

// Ruta para obtener estudiantes por turno
app.get('/estudiantes/:turno', (req, res) => {
  const { turno } = req.params;
  const query = 'SELECT * FROM estudiantes WHERE turno = ?';
  db.query(query, [turno], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la consulta: ' + err.message });
    }
    res.json(results);
  });
});

// Ruta para obtener las asistencias de un estudiante
app.get('/asistencias/estudiante/:id_estudiante', (req, res) => {
  const { id_estudiante } = req.params;
  const query = 'SELECT * FROM asistencias_alumnos WHERE id_estudiante = ?';
  db.query(query, [id_estudiante], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la consulta: ' + err.message });
    }
    res.json(results);
  });
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
