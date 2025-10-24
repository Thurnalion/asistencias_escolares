// src/components/Profesores.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profesores = () => {
    // Estados para la lista de profesores, la carga, el error
    const [profesores, setProfesores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // NUEVOS ESTADOS para la selección y asistencias
    const [selectedProfesorId, setSelectedProfesorId] = useState('');
    const [asistencias, setAsistencias] = useState([]);
    const [asistenciasLoading, setAsistenciasLoading] = useState(false);
    
    // Función para cargar TODOS los profesores (la que ya tenías)
    useEffect(() => {
        const URL = 'http://localhost:5000/profesores/todos';
        axios.get(URL)
            .then(response => {
                setProfesores(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError("No se pudieron cargar los datos de los profesores.");
                setLoading(false);
            });
    }, []);

    // NUEVA FUNCIÓN: Se ejecuta al seleccionar un profesor
    const handleProfesorChange = (event) => {
        const id = event.target.value;
        setSelectedProfesorId(id);
        setAsistencias([]); // Limpiar asistencias anteriores

        if (id) {
            fetchAsistencias(id);
        }
    };

    // NUEVA FUNCIÓN: Hace la petición de asistencias al backend
    const fetchAsistencias = (id) => {
        setAsistenciasLoading(true);
        // Usa la nueva ruta con el ID del profesor
        const URL = `http://localhost:5000/profesores/${id}/asistencias`;
        
        axios.get(URL)
            .then(response => {
                setAsistencias(response.data);
                setAsistenciasLoading(false);
            })
            .catch(err => {
                console.error("Error al obtener asistencias:", err);
                setAsistenciasLoading(false);
                setAsistencias([{ estado: 'Error al cargar asistencias' }]);
            });
    };

    // Renderizado Condicional y Formulario
    if (loading) return <div className="loading">Cargando profesores...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="profesores-container">
            <h2>Consulta de Asistencias - Profesores</h2>
            
            <div className="select-container">
                <label htmlFor="profesor-select">Seleccione Profesor:</label>
                <select 
                    id="profesor-select"
                    value={selectedProfesorId} 
                    onChange={handleProfesorChange}
                >
                    <option value="">-- Seleccionar --</option>
                    {profesores.map(profesor => (
                        <option 
                            key={profesor.id_profesor} 
                            value={profesor.id_profesor}
                        >
                            {profesor.nombre} {profesor.apellido} ({profesor.nombre_clase})
                        </option>
                    ))}
                </select>
            </div>
            
            <hr />

            {/* Resultado de la Consulta de Asistencias */}
            {selectedProfesorId && (
                <div className="asistencias-resultado">
                    <h3>Asistencias del Profesor</h3>
                    {asistenciasLoading ? (
                        <p>Cargando asistencias...</p>
                    ) : (
                        asistencias.length > 0 ? (
                            // Mapea y muestra todas las asistencias encontradas
                            <div className="lista-asistencias">
                                {asistencias.map((a, index) => (
                                    <p key={index}>Registro {index + 1}: <strong>{a.estado}</strong></p>
                                ))}
                            </div>
                        ) : (
                            <p>No se encontraron registros de asistencia para este profesor.</p>
                        )
                    )}
                </div>
            )}
            
        </div>
    );
};

export default Profesores;