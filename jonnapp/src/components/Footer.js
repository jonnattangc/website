import React from 'react'


class Footer extends React.Component {
  render() {
    return (<div style={{ with: '500px', marginTop: '20px', marginBottom: '20px' , fontSize: '14px' , color: '#888888' , textAlign: 'center', fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <p align="center">
        <a class="nav-link" aria-current="page" data-toggle="tooltip" data-placement="bottom"
          title="Creado por Jonnattan G" href="https://www.jonnattan.com" target="_blank" rel="noopener noreferrer"> &copy; Copyright Jonnattan G. 2025-2026 </a>
        
        <a lass="nav-link" aria-current="page" data-toggle="tooltip" data-placement="bottom " 
          title="Creado por Jonnattan G" href='https://dev.jonnattan.com/terms' target='_blank' rel='noreferrer' >Términos y Condiciones</a>
        &nbsp; | &nbsp;   
          <a lass="nav-link" aria-current="page" data-toggle="tooltip" data-placement="bottom " 
            title="Creado por Jonnattan G" href='https://dev.jonnattan.com/privacity' target='_blank' rel='noreferrer' >Póliticas de Privacidad</a>
      </p>  
    </div>);
  }
}

export { Footer };
