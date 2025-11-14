import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Clases = () => {
    //ESTADOS
    // Almacena la lista de TODAS las clases (para el select)
    const [clases, setClases] = useState([]); 
    // Almacena el ID de la clase seleccionada en el select
    const [selectedClaseId, setSelectedClaseId] = useState(''); 
    // Almacena el resultado final: el objeto del profesor asignado a la clase
    const [profesorAsignado, setProfesorAsignado] = useState(null); 
    // Estados de control de UI
    const [loading, setLoading] = useState(true); // Carga inicial de clases
    const [error, setError] = useState(null); // Manejo de errores
    const [profesorLoading, setProfesorLoading] = useState(false); // Carga del profesor específico
    
    //EFECTO 1 Carga Inicial de Clases se ejecuta una vez al montar el componente para llenar el select
    useEffect(() => {
        const URL = 'http://localhost:5000/clases/todos'; 
        
        axios.get(URL)
            .then(response => {
                // Guarda la lista de clases en el estado
                setClases(response.data); 
                setLoading(false);
            })
            .catch(err => {
                setError("No se pudieron cargar los datos de las clases.");
                setLoading(false);
            });
    }, []); // El array vacío asegura que se ejecute solo al montar.

    // MANEJADORES DE EVENTOS

    // Se ejecuta cuando el usuario selecciona una clase del select
    const handleClaseChange = (event) => {
        const id = event.target.value;
        setSelectedClaseId(id); // Actualiza el ID seleccionado
        setProfesorAsignado(null); // Limpia el resultado anterior

        // Esto disparará el useEffect 2
    };

    // Función que realiza la petición al backend para obtener el profesor
    const fetchProfesorAsignado = (id) => {
        setProfesorLoading(true);
        
        // 🟢 RUTA del Backend: Obtener el profesor para el ID de clase.
        const URL = `http://localhost:5000/clases/${id}/profesor`;
        
        axios.get(URL)
            .then(response => {
                // Guarda el objeto del profesor (nombre y apellido)
                setProfesorAsignado(response.data); 
                setProfesorLoading(false);
            })
            .catch(err => {
                console.error("Error al obtener profesor:", err);
                setProfesorLoading(false);
                setProfesorAsignado({nombre: 'No Asignado', apellido: ''}); // Mensaje de fallback
            });
    };


    // EFECTO 2: Carga del Profesor al cambiar la selección 
    
    // Se ejecuta cada vez que 'selectedClaseId' cambia
    useEffect(() => {
        if (selectedClaseId) {
            fetchProfesorAsignado(selectedClaseId);
        }
    }, [selectedClaseId]); // Depende del ID de clase seleccionado

    // RENDERIZADO CONDICIONAL

    // Muestra spinner/mensaje mientras carga la lista inicial
    if (loading) return <div>Cargando clases...</div>;
    if (error) return <div>{error}</div>; // Muestra error si falla la carga inicial
    
    return (
        <div>
            <p className="filtros">Clase</p> 
            <div> 
                <select id="clase-select" value={selectedClaseId} 
                    onChange={handleClaseChange} // Llama a la función al cambiar
                    className="select"
                >
                    <option value="">Seleccionar Clase</option> 
                    {/* Mapea la lista de clases obtenida */}
                    {clases.map(clase => (
                        <option 
                            key={clase.id_clase} // Clave única de la clase (asumo id_curso)
                            value={clase.id_clase} // Valor que se usará para la URL
                        >
                            {clase.nombre_curso} {/* Nombre visible de la clase (asumo nombre_curso) */}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* Muestra el resultado solo si hay una clase seleccionada */}
            {selectedClaseId && (
                <div>
                    <p className="filtros">Profesor Asignado</p>
                    {profesorLoading ? (
                        <p>Buscando profesor...</p>
                    ) : (
                        profesorAsignado ? (
                            // Muestra el nombre y apellido del profesor
                            <p>
                                <strong>{profesorAsignado.nombre} {profesorAsignado.apellido}</strong>
                            </p>
                        ) : (
                            // Mensaje si no se encuentra el profesor
                            <p>Profesor no encontrado o no asignado.</p>
                        )
                    )}
                </div>
            )}
            
        </div>
    );
};

export default Clases;