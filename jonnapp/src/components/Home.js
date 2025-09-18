import React from 'react';
import { Grid, Stack } from '@mui/material';

class Home extends React.Component {

    render() {
        return (
            <div class="App_Main">
              <Stack spacing={1}>
                <Grid container rowSpacing={2} columnSpacing={0} >
                    <Grid item xs={12}>
                        <QuienSoy />
                    </Grid>
                </Grid>
              </Stack>
            </div>
        );
    }
}

class QuienSoy extends React.Component {
    render() {
        return (<div >
            <h4>Hola Mundo !</h4>
            <p align="justify">Mi nombre es <b>Jonnattan</b>, actualmente vivo en la ciudad de Viña del Mar, en Chile, la intención de desarrllar este sitio (que jamás termina) es mostrar experimentos realizados en los momentos de ocio.
                Muchos se preguntarán: ¿por qué me dedico a programar en vez de hacer otras cosas, como ver Tv o ir a la playa?. La respuesta ni yo la entiendo claramente, pero creo que es, principalmente, porque me gusta programar y por la curiosidad de aprender y experimentar con nuevas cosas del área,
                Además (debo reconocer), por un poco de miedo a quedar añejo con mis conocimientos de programación.
                En fin, en <a href='https://www.jonnattan.com' target='_blank' rel='noreferrer' >mi blog</a> pueden encontrar algunas cosas como mis gustos y forma de pensar. Este sitio es sólo dedicado a mis proyectos personales no comerciales y a compartir conocimientos 
                de programación. Todos los códigos fuentes - incluso de esta pagina - están disponibles en <a href='https://github.com/jonnattangc' target='_blank' rel='noreferrer'>GitHub</a>.
            </p>
            <p>
                Espero que sea de su agrado el contenido, </p>
            <p>Salu2 :)</p>
        </div>);
    }
}

export { Home };
