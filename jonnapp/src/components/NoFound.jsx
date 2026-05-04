import React from 'react';
import img from '../images/no_found.png';

function NoFound() {
  return (
    <div className="App_Main" style={{ textAlign: 'center' }}>
      <img alt="Imagen de pagina no encontrada" src={img} />
    </div>
  );
}

export { NoFound };
