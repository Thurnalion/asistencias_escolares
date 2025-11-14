const express = require('express');
const router = express.Router();
/*
// Configurar la conexión a MySQL (se recomienda mover esto a una capa de servicio/db)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'asistencias_escolares'
}); */

module.exports = (db) => {

// Todas las rutas relacionadas con alumnos van aquí
router.get('/anios', (req, res) => {
  // Lógica para obtener años (copiada de servidor.js)
  const query = 'SELECT DISTINCT turno FROM estudiantes ORDER BY turno';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener años de la DB:', err);
      return res.status(500).json({ error: 'Error al obtener años: ' + err.message });
    }
    const anios = results.map(row => row.turno);
    res.json(anios);
  });
}); 

router.get('/estudiantes/:turno', (req, res) => {
  // Lógica para obtener estudiantes (copiada de servidor.js)
  const { turno } = req.params;
  const query = 'SELECT * FROM estudiantes WHERE turno = ?';
  db.query(query, [turno], (err, results) => {
    if (err) {
      console.error('Error en la consulta de estudiantes:', err);
      return res.status(500).json({ error: 'Error en la consulta: ' + err.message });
    }
    res.json(results);
  });
});

router.get('/asistencias/estudiante/:id_estudiante', (req, res) => {
  // Lógica para obtener asistencias (copiada de servidor.js)
  const { id_estudiante } = req.params;
  const query = 'SELECT * FROM asistencias_alumnos WHERE id_estudiante = ?';
  db.query(query, [id_estudiante], (err, results) => {
    if (err) {
      console.error('Error en la consulta de asistencias:', err);
      return res.status(500).json({ error: 'Error en la consulta: ' + err.message });
    }
    res.json(results);
  });
}); 

// Exportar el router
return router;
};