import React, { useState, useEffect } from "react";
import axios from "axios";

function Alumnos() {
  // Todos los estados relacionados con los alumnos y asistencias
  const [turno, setTurno] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [asistencias, setAsistencias] = useState([]);
  const [añosDisponibles, setAñosDisponibles] = useState([]);

  // useEffect para obtener la lista de años disponibles al cargar el componente
  useEffect(() => {
    axios.get('http://localhost:5000/anios')
      .then((response) => {
        console.log('Alumnos.js: Años disponibles recibidos:', response.data);
        setAñosDisponibles(response.data);
      })
      .catch((error) => {
        console.error('Alumnos.js: Error al obtener los años disponibles:', error);
      });
  }, []); // Se ejecuta solo una vez al montar el componente

  // useEffect para obtener estudiantes cuando el 'turno' cambia
  useEffect(() => {
    if (turno) {
      axios.get(`http://localhost:5000/estudiantes/${turno}`)
        .then((response) => {
          console.log('Alumnos.js: Estudiantes recibidos:', response.data);
          setEstudiantes(response.data);
          setSelectedEstudiante(''); // Limpia la selección de estudiante al cambiar el año
          setAsistencias([]);       // Limpia las asistencias
        })
        .catch((error) => {
          console.error('Alumnos.js: Error al obtener estudiantes:', error);
        });
    } else {
      // Si no hay 'turno' seleccionado, limpia la lista de estudiantes y asistencias
      setEstudiantes([]);
      setSelectedEstudiante('');
      setAsistencias([]);
    }
  }, [turno]); // Depende de 'turno'

  // useEffect para obtener asistencias cuando 'selectedEstudiante' cambia
  useEffect(() => {
    if (selectedEstudiante) {
      const idEstudiante = parseInt(selectedEstudiante);
      console.log('Alumnos.js: Valor de selectedEstudiante:', selectedEstudiante);
      console.log('Alumnos.js: Valor de idEstudiante:', idEstudiante);
      axios.get(`http://localhost:5000/asistencias/estudiante/${idEstudiante}`)
        .then((response) => {
          console.log('Alumnos.js: Asistencias recibidas:', response.data);
          setAsistencias(response.data);
        })
        .catch((error) => {
          console.error('Alumnos.js: Error al obtener asistencias:', error);
        });
    } else {
      // Si no hay 'selectedEstudiante' seleccionado, limpia las asistencias
      setAsistencias([]);
    }
  }, [selectedEstudiante]); // Depende de 'selectedEstudiante'

  return (
    // ¡OJO! Este div ya no tiene la clase 'contenedores' ni el título 'Alumnos'.
    // Esos elementos ahora están en App.js. Aquí solo va el contenido interno.
    <>
      <p className="filtros">Año</p>

      <select value={turno} onChange={(e) => setTurno(e.target.value)} className="select">
        <option key="" value="" disabled hidden>Selecciona un año</option>
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
    </>
  );
}

export default Alumnos;