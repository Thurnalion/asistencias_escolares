import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profesores = () => {
    // Estados para la lista de profesores, la carga, el error
    const [profesores, setProfesores] = useState([]); // Lista principal
    const [selectedProfesorId, setSelectedProfesorId] = useState(''); // Selección del filtro
    const [asistencias, setAsistencias] = useState([]); // Resultados
    
    // Estados para la experiencia de usuario, seleccion y asistencias
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [asistenciasLoading, setAsistenciasLoading] = useState(false);
    
    // Función para cargar TODOS los profesores
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

    //Se ejecuta al seleccionar un profesor
    const handleProfesorChange = (event) => {
        const id = event.target.value;
        setSelectedProfesorId(id);
        setAsistencias([]); // Limpia la vista anterior

        // Esto dispara el useEffect 2
    };

    const fetchAsistencias = (id) => {
        setAsistenciasLoading(true);
        const URL = `http://localhost:5000/profesores/${id}/asistencias`;
        
        axios.get(URL)
            .then(response => {
                setAsistencias(response.data);
                setAsistenciasLoading(false);
            })
            .catch(err => {
                console.error("Error al obtener asistencias:", err);
                setAsistenciasLoading(false);
                setAsistencias([]); // Deja vacío en caso de error
            });
    };


    // EFECTO 2: Carga de Asistencias al cambiar la selección (Dependencia: [selectedProfesorId])
    useEffect(() => {
        if (selectedProfesorId) {
            fetchAsistencias(selectedProfesorId);
        }
    }, [selectedProfesorId]);

    if (loading) return <div className="loading">Cargando profesores...</div>;

    return (
        <div>
            <p className="filtros">Profesor</p> 
            <div> 
                <select id="profesor-select" value={selectedProfesorId} 
                    onChange={handleProfesorChange}
                    className="select"
                >
                    <option value="">Seleccionar Profesor</option> 
                    {profesores.map(profesor => (
                        <option 
                            key={profesor.id_profesor} 
                            value={profesor.id_profesor}
                        >
                            {profesor.nombre} {profesor.apellido} 
                        </option>
                    ))}
                </select>
            </div>
            
            {selectedProfesorId && (
                <div>
                    <p className="filtros">Estado</p>

                    {asistenciasLoading ? (
                        <p>Cargando asistencias...</p>
                    ) : (
                        asistencias.length > 0 ? (
                            <div>
                                {asistencias.map((a, index) => (
                                    <p key={index}>
                                        Día {index + 1}: <strong>{a.estado}</strong>
                                    </p>
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