const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());          // Middleware CORS: DEBE IR PRIMERO
app.use(express.json());  // Middleware para parsear JSON: DEBE IR ANTES DE LAS RUTAS

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

// --- RUTA PARA OBTENER LOS AÑOS DISPONIBLES ---
// Es buena práctica definir esta ruta al principio si la usas temprano en el frontend
app.get('/anios', (req, res) => {
  console.log('¡Ruta /anios alcanzada!'); // Para depuración

  const query = 'SELECT DISTINCT turno FROM estudiantes ORDER BY turno'; 
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener años de la DB:', err); // Más específico
      return res.status(500).json({ error: 'Error al obtener años: ' + err.message });
    }
    
    console.log('Resultados crudos de la DB (años):', results); // Depuración

    // Asegúrate de que 'turno' sea la propiedad correcta en los objetos de resultado
    const años = results.map(row => row.turno);
    console.log('Años enviados desde el backend:', años); // Depuración
    res.json(años);
  });
});
// -----------------------------------------------------


// Ruta para obtener estudiantes por turno
app.get('/estudiantes/:turno', (req, res) => {
  const { turno } = req.params;
  const query = 'SELECT * FROM estudiantes WHERE turno = ?';
  db.query(query, [turno], (err, results) => {
    if (err) {
      console.error('Error en la consulta de estudiantes:', err); // Más específico
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
      console.error('Error en la consulta de asistencias:', err); // Más específico
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