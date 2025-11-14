const express = require('express');
const router = express.Router();

module.exports = (db) => {

    // 1 GET /clases/todos lista completa de clases
    router.get('/todos', (req, res) => {
        const query = 'SELECT id_clase, nombre_clase FROM clases ORDER BY nombre_clase';
        
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener la lista de clases:', err);
                return res.status(500).json({ error: 'Error al obtener la lista de clasess.' });
            }           
            // Devuelve un array con objetos id_curso, nombre_curso, Matemáticas
            res.status(200).json(results);
        });
    });

    // 2 GET /clases/:id_curso/profesor, el profesor asignado a una clase específica.
    router.get('/:id_clase/profesor', (req, res) => {
        const idClase = req.params.id_clase;

        // 💡 JOIN: Une la tabla 'cursos' con 'profesores' usando la clave de enlace.
        // Asumo que 'clases' tiene la columna 'id_profesor'.
        const query = `
            SELECT p.nombre, p.apellido
            FROM profesores p
            INNER JOIN clases c ON c.id_profesor = p.id_profesor
            WHERE c.id_clase = ?
        `;

        db.query(query, [idClase], (err, results) => {
            if (err) {
                console.error(`Error al obtener profesor del curso ${idClase}:`, err);
                return res.status(500).json({ error: 'Error interno al buscar profesor asignado.' });
            }
            
            // Retorna el primer objeto del profesor o 404 si no existe.
            if (results.length > 0) {
                res.status(200).json(results[0]); // {nombre: 'Juan', apellido: 'Pérez'}
            } else {
                res.status(404).json({ error: 'Profesor no encontrado para este curso.' });
            }
        });
    });
    return router; 
};