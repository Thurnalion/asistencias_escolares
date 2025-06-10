import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [turno, setTurno] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [asistencias, setAsistencias] = useState([]);
  const [añosDisponibles, setAñosDisponibles] = useState([]); // Este estado ya lo tenías, ¡bien!

  // --- MODIFICACIÓN CLAVE: useEffect para cargar los años disponibles ---
  useEffect(() => {
    axios.get('http://localhost:5000/anios') // Llama a tu nuevo endpoint en el backend
      .then((response) => {
        console.log('Años disponibles recibidos en frontend:', response.data); // Confirma que React los recibe
        setAñosDisponibles(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los años disponibles en frontend:', error);
      });
  }, []); // El array de dependencias vacío [] asegura que esto se ejecute solo una vez al montar el componente
  // ------------------------------------------------------------------

  useEffect(() => {
    if (turno) {
      axios.get(`http://localhost:5000/estudiantes/${turno}`)
        .then((response) => {
          console.log('Estudiantes recibidos:', response.data);
          setEstudiantes(response.data);
          setSelectedEstudiante(''); // Limpia la selección de estudiante cuando cambia el año
          setAsistencias([]);       // Limpia las asistencias
        })
        .catch((error) => {
          console.error('Error al obtener estudiantes:', error);
        });
    } else {
      // Si no hay 'turno' seleccionado, limpia la lista de estudiantes y asistencias
      setEstudiantes([]);
      setSelectedEstudiante('');
      setAsistencias([]);
    }
  }, [turno]);

  useEffect(() => {
    if (selectedEstudiante) {
      const idEstudiante = parseInt(selectedEstudiante);
      console.log('Valor de selectedEstudiante:', selectedEstudiante);
      console.log('Valor de idEstudiante:', idEstudiante);
      axios.get(`http://localhost:5000/asistencias/estudiante/${idEstudiante}`)
        .then((response) => {
          console.log('Asistencias recibidas:', response.data);
          setAsistencias(response.data);
        })
        .catch((error) => {
          console.error('Error al obtener asistencias:', error);
        });
    } else {
      // Si no hay 'selectedEstudiante' seleccionado, limpia las asistencias
      setAsistencias([]);
    }
  }, [selectedEstudiante]);

  return (
    <>
      <nav className="nav">
        <p className="logo">Asistencias</p>
      </nav>

      <div className="contenedor">
        <div className="contenedores">
          <p className="titulos">Profesores</p>
        </div>
        <div className="contenedores">
          <p className="titulos">Clases</p>
        </div>
        <div className="contenedores">
          <p className="titulos">Alumnos</p>
          <p className="filtros">Año</p>

          <select value={turno} onChange={(e) => setTurno(e.target.value)} className="select">
            <option key="" value="">Selecciona un año</option>
            {/* Mapea los años obtenidos del backend */}
            {añosDisponibles.map((año) => (
              <option key={año} value={año}>
                {año}
              </option>
            ))}
          </select>

          <p className="filtros">Lista de alumnos</p>
          {turno && ( // Muestra el selector de alumnos solo si se ha seleccionado un año
            <select value={selectedEstudiante} onChange={(e) => setSelectedEstudiante(e.target.value)} className="select">
              <option key="default" value="">Selecciona un alumno</option>
              {estudiantes.map((estudiante) => (
                <option key={estudiante.id_estudiante} value={estudiante.id_estudiante}>
                  {estudiante.nombre} {estudiante.apellido}
                </option>
              ))}
            </select>
          )}

          <p className="filtros">Estado</p>
          {selectedEstudiante && ( // Muestra los detalles del estado solo si se ha seleccionado un estudiante
            <>
              {/* Estos p heredarán el color blanco del contenedor padre o del body */}
              <p>Nombre: {estudiantes.find((e) => e.id_estudiante === parseInt(selectedEstudiante))?.nombre || ''} {estudiantes.find((e) => e.id_estudiante === parseInt(selectedEstudiante))?.apellido || ''}</p>
              <p>Asistencias: {asistencias.length > 0 ? `${asistencias.length} encontradas` : 'Ninguna'}</p>
              {asistencias.length > 0 && (
                <div className="result">
                  {(() => {
                    const estudianteSeleccionado = estudiantes.find((e) => e.id_estudiante === parseInt(selectedEstudiante));
                    const nombreCompleto = estudianteSeleccionado ? `${estudianteSeleccionado.nombre} ${estudianteSeleccionado.apellido}` : '';

                    const presentes = asistencias.filter(a => a.estado === 'Presente').length;
                    const ausentes = asistencias.filter(a => a.estado === 'Ausente').length;

                    console.log(`Asistencias para estudiante ${selectedEstudiante}:`, asistencias);
                    console.log(`Presentes: ${presentes}, Ausentes: ${ausentes}`);

                    return (
                      <>
                        {asistencias.length === 4 ? (
                          presentes === 4 ? (
                            <p className="estado">Presente</p>
                          ) : ausentes === 4 ? (
                            <p className={`estado ausente`}>Ausente</p>
                          ) : (
                            <p className="estado">Estado mixto ({presentes} Presente, {ausentes} Ausente)</p>
                          )
                        ) : (
                          <p className="estado">Datos incompletos ({asistencias.length} asistencias encontradas)</p>
                        )}
                      </>
                    );
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