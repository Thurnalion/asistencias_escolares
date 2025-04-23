import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // Estados para manejar los datos dinámicos
  const [turno, setTurno] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [asistencias, setAsistencias] = useState([]);

  // useEffect para obtener estudiantes cuando cambia el turno
  useEffect(() => {
    if (turno) {
      axios.get(`http://localhost:5000/estudiantes/${turno}`)
        .then((response) => {
          setEstudiantes(response.data);
          setSelectedEstudiante('');
          setAsistencias([]);
        })
        .catch((error) => {
          console.error('Error al obtener estudiantes:', error);
        });
    }
  }, [turno]);

  // useEffect para obtener asistencias cuando cambia el estudiante seleccionado
  useEffect(() => {
    if (selectedEstudiante) {
      axios.get(`http://localhost:5000/asistencias/estudiante/${selectedEstudiante}`)
        .then((response) => {
          setAsistencias(response.data);
        })
        .catch((error) => {
          console.error('Error al obtener asistencias:', error);
        });
    }
  }, [selectedEstudiante]);

  return (
    <>
      <nav className="nav">
        <p className="logo">Asistencias</p>
      </nav>
      <div className="contenedor">
        {/* Solapa "Profesores" */}
        <div className="contenedores">
          <p className="titulos">Profesores</p>
        </div>

        {/* Solapa "Clases" */}
        <div className="contenedores">
          <p className="titulos">Clases</p>
        </div>

        {/* Solapa "Alumnos" */}
        <div className="contenedores">
          <p className="titulos">Alumnos</p>

          {/* Sección "Año" */}
          <p className="filtros">Año</p>
          <select
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
            className="select"
          >
            <option value="">Selecciona un año</option>
            <option value="Primero">Primero</option>
            <option value="Segundo">Segundo</option>
          </select>

          {/* Sección "Lista de alumnos" */}
          <p className="filtros">Lista de alumnos</p>
          {turno && (
            <select
              value={selectedEstudiante}
              onChange={(e) => setSelectedEstudiante(e.target.value)}
              className="select" // Clase genérica para estilizar el menú desplegable
            >
              <option value="">Selecciona un alumno</option>
              {estudiantes.map((estudiante) => (
                <option key={estudiante.id} value={estudiante.id}>
                  {estudiante.nombre} {estudiante.apellido}
                </option>
              ))}
            </select>
          )}

          <p className="filtros">Estado</p>
              {selectedEstudiante && (
            <>
                {/* Mensajes de depuración */}
                <p>Estudiante seleccionado: {selectedEstudiante || 'Ninguno'}</p>
                <p>Asistencias: {asistencias.length > 0 ? `${asistencias.length} encontradas` : 'Ninguna'}</p>
                {asistencias.length > 0 && (
              <div className="result">
                <h3 className="student-name">
                  {estudiantes.find((e) => e.id === parseInt(selectedEstudiante)).nombre}{' '}
                  {estudiantes.find((e) => e.id === parseInt(selectedEstudiante)).apellido}
                </h3>
                {(() => {
                // Contar asistencias "Presente" y "Ausente"
                const presentes = asistencias.filter(a => a.estado === 'Presente').length;
                const ausentes = asistencias.filter(a => a.estado === 'Ausente').length;

                // Mostrar resultados de depuración
                console.log(`Asistencias para estudiante ${selectedEstudiante}:`, asistencias);
                console.log(`Presentes: ${presentes}, Ausentes: ${ausentes}`);

                // Determinar el estado final
                if (asistencias.length === 4) {
                if (presentes === 4) {
                return <p className="estado">Presente</p>;
                } else if (ausentes === 4) {
                return <p className={`estado ausente`}>Ausente</p>;
                } else {
                return <p className="estado">Estado mixto ({presentes} Presente, {ausentes} Ausente)</p>;
                }
                } else {
                return <p className="estado">Datos incompletos ({asistencias.length} asistencias encontradas)</p>;
                }
                })()}
              </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;