import React from 'react';
import './App.css';


// Importados los nuevos componentes a crear
import Alumnos from './components/alumnos';
import Profesores from './components/profesores';
import Clases from './components/clases';


function App() {
  return (
    <>
      <nav className="nav">
        <p className="logo">Asistencias</p>
      </nav>

      <div className="contenedor">
        {/* Aquí es donde renderizas los componentes separados */}
        <div className="contenedores">
          <p className="titulos">Profesores</p>
          {/* Aquí podria renderizar <Profesores /> una vez que se crea el componente */}
          <Profesores /> 
        </div>
        <div className="contenedores">
          <p className="titulos">Clases</p>
          {/* Aquí podria renderizar <Clases /> una vez que se crea el componente */}
          <Clases />
        </div>
        <div className="contenedores">
          <p className="titulos">Alumnos</p>
          {/* Componente de Alumnos ahora */}
          <Alumnos /> 
        </div>
      </div>
    </>
  );
}

export default App;