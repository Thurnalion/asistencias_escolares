import React, { useState, useEffect } from 'react'; // Importa React y hooks
import axios from 'axios'; // Importa axios para las peticiones HTTP

function Asistencias() {
  // Definición de estados
  const [turno, setTurno] = useState(''); // Estado para el turno/año seleccionado
  const [estudiantes, setEstudiantes] = useState([]); // Estado para la lista de estudiantes
  const [selectedEstudiante, setSelectedEstudiante] = useState(''); // Estado para el estudiante seleccionado
  const [asistencias, setAsistencias] = useState([]); // Estado para las asistencias

  // useEffect para obtener estudiantes cuando cambia el turno
  useEffect(() => {
    if (turno) {
      axios.get(`http://localhost:5000/estudiantes/${turno}`)
        .then((response) => {
          setEstudiantes(response.data);
          setSelectedEstudiante(''); // Resetea el estudiante seleccionado
          setAsistencias([]); // Resetea las asistencias
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
    <div className="container"> {/* Contenedor principal, usa tu clase CSS */}
      <h1 className="header">Asistencias</h1> {/* Encabezado, usa tu clase CSS */}
      <div className="tabs"> {/* Contenedor de solapas, usa tu clase CSS */}
        <div className="tab">Buscar profesor</div> {/* Solapa inactiva */}
        <div className="tab">Buscar clase</div> {/* Solapa inactiva */}
        <div className="tab tab-active">Buscar alumnos</div> {/* Solapa activa */}
      </div>
      <div className="content"> {/* Contenedor del contenido, usa tu clase CSS */}
        <div className="tab-content"> {/* Contenido de la solapa, usa tu clase CSS */}
          {/* Sección "Año" */}
          <div className="section"> {/* Sección para el año, usa tu clase CSS */}
            <p className="label">Año</p> {/* Etiqueta "Año", usa tu clase CSS */}
            {/* Menú desplegable para seleccionar el turno/año */}
            <select
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              className="select" // Usa tu clase CSS para el select, si la tienes
            >
              <option value="">Selecciona un año</option>
              <option value="Primero">Primero</option>
              <option value="Segundo">Segundo</option>
            </select>
          </div>

          {/* Sección "Lista de alumnos" */}
          <div className="section"> {/* Sección para la lista de alumnos, usa tu clase CSS */}
            <p className="label">Lista de alumnos</p> {/* Etiqueta "Lista de alumnos", usa tu clase CSS */}
            {/* Menú desplegable para seleccionar un alumno, solo se muestra si hay un turno seleccionado */}
            {turno && (
              <select
                value={selectedEstudiante}
                onChange={(e) => setSelectedEstudiante(e.target.value)}
                className="select" // Usa tu clase CSS para el select, si la tienes
              >
                <option value="">Selecciona un alumno</option>
                {estudiantes.map((estudiante) => (
                  <option key={estudiante.id} value={estudiante.id}>
                    {estudiante.nombre} {estudiante.apellido}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Sección "Estado" */}
          <div className="section"> {/* Sección para el estado, usa tu clase CSS */}
            <p className="label">Estado</p> {/* Etiqueta "Estado", usa tu clase CSS */}
            {/* Muestra las asistencias del estudiante seleccionado, solo si hay un estudiante y asistencias */}
            {selectedEstudiante && asistencias.length > 0 && (
              <div className="result"> {/* Contenedor de resultados, usa tu clase CSS si la tienes */}
                <h3 className="student-name"> {/* Nombre del estudiante, usa tu clase CSS si la tienes */}
                  {estudiantes.find((e) => e.id === parseInt(selectedEstudiante)).nombre}{' '}
                  {estudiantes.find((e) => e.id === parseInt(selectedEstudiante)).apellido}
                </h3>
                <ul className="asistencia-list"> {/* Lista de asistencias, usa tu clase CSS si la tienes */}
                  {asistencias.map((asistencia) => (
                    <li key={asistencia.id_asistencia} className="asistencia-item"> {/* Elemento de la lista, usa tu clase CSS si la tienes */}
                      Clase {asistencia.id_clase}: <span className="estado">{asistencia.estado}</span> {/* Estado, usa tu clase CSS si la tienes */}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Asistencias;