const express = require('express');
const router = express.Router(); 

module.exports = (db) => {

// RUTA 1: GET /profesores/todos
router.get('/todos', (req, res) => {
    const query = 'SELECT id_profesor, nombre, apellido FROM profesores';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener la lista de profesores:', err);
            return res.status(500).json({ error: 'Error al obtener la lista de profesores.' });
        } //devuelve un array con objetos id_profesor, nombre, apellido
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
// Exportar el router
return router;
};