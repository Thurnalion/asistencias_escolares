const express = require('express');
const router = express.Router(); 
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'asistencias_escolares' 
});

// Prueba la conexión al iniciar el router
db.connect((err) => {
    if (err) {
        console.error('Error de conexión a DB en PROFESORES ROUTER:', err);
    } else {
        console.log('Profesores Router conectado a MySQL.');
    }
});

// RUTA 1: GET /profesores/todos
router.get('/todos', (req, res) => {
    const query = 'SELECT id_profesor, nombre, apellido FROM profesores';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener la lista de profesores:', err);
            return res.status(500).json({ error: 'Error al obtener la lista de profesores.' });
        }
        res.status(200).json(results);
    });
});

// RUTA 2: GET /profesores/:id/asistencias
router.get('/:id/asistencias', (req, res) => {
    const idProfesor = req.params.id;
    //'?' seguridad (Inyección SQL)
    const query = 'SELECT estado FROM asistencias_profesores WHERE id_profesor = ?';

    db.query(query, [idProfesor], (err, results) => {
        if (err) {
            console.error(`Error al obtener asistencias del profesor ${idProfesor}:`, err);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        
        res.status(200).json(results);
    });
});

module.exports = router;