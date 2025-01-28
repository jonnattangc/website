import React from 'react';
import { Alert, Paper, Grid, Stack } from '@mui/material';
import { CargaTexto } from "./CargaTexto";
import env from 'react-dotenv';

class Curriculum extends React.Component {

/**
 * Initializes the Curriculum component.
 *
 * @param {Object} props - The properties passed to the component.
 * Sets the initial state with loading, data, and errorMsg properties.
 * Calls the onLoad method to fetch curriculum data.
 */
    constructor(props) {
        super(props);
        this.state = ({ loading: true, data: null, errorMsg: null });
        this.onLoad()
    }

    onLoad = async () => {
        let dataCV = null
        let msgError = null
        try {
            console.info("Entro a obtener el curriculum: ", env.PAGE_API_KEY)
            var request = await fetch(
                env.API_BASE_URL + '/page/cv/jonnattan', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                    'Authorization': 'Basic ' + env.AUTH_JONNA_SERVER,
                    'x-api-key': env.PAGE_API_KEY
                }
            });
            if (request.status === 200) {
                var response = await request.json();
                console.log('GET Name: ', response.data.name);
                response.data !== '' ? dataCV = response.data.cv : msgError = 'El CV de ' + response.data.name + ' no se ha recuperado'
            }
            else {
                console.log('[405]: ' + request.error)
                msgError = 'Error al cargar el CV'
            }
        }
        catch (error) {
            msgError = error
            throw Error(error);
        }
        this.setState({ loading: false, data: dataCV, errorMsg: msgError });
    }

    render() {
        const { loading, data, errorMsg } = this.state;
        return (
            <div class="App_Main">
              <Stack spacing={1}>
                <Grid container rowSpacing={2} columnSpacing={2} >
                    <Grid item xs={10}>
                        <Paper elevation={1}>
                            <QuienSoy />
                        </Paper>
                    </Grid>
                    <Grid item xs={2} >
                        <Paper elevation={1}>
                            {
                                loading ? <CargaTexto /> : errorMsg != null ? <ErrorCv msg={errorMsg} /> : <CVBase64 data={data} />
                            }
                        </Paper>
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
            <h5>Hola Mundo !</h5>
            <p>Mi nombre es Jonnattan, actualmente vivo en la ciudad de Viña del Mar, en Chile, la intensción de desarrllar este sitio (que jamás termina) es mostrar al mundo mis experimentos realizados en los momentos de ocio.
                Muchos se preguntarán: “por qué me dedico a programar en vez de hacer otras cosas como ver tv o estar en la playa”. La respuesta es sencilla: ni yo lo entiendo claramente, pero creo que es, principalmente, porque me gusta y por la curiosidad de aprender y experimentar con nuevas cosas del área de programación,
                Además (debo reconocer), por un poco de miedo a quedar añejo con mis conocimientos de programación.
                En fin, en <a href='https://www.jonnattan.com' target='_blank' rel='noreferrer' >mi blog</a> pueden encontrar algunas cosas como mis gustos y forma de pensar. Este sitio es sólo dedicado a mis proyectos personales no comerciales y a compartir conocimientos 
                de programación. Todos los códigos fuentes - incluso de esta pagina - están disponibles en <a href='https://github.com/jonnattangc' target='_blank' rel='noreferrer'>GitHub</a>.
            </p>
            <p>
                Espero que sea de su agrado el contenido, </p>
            <p>salu2 Jonnattan :)</p>
        </div>);
    }
}
class ErrorCv extends React.Component {
    render() {
        const msg = this.props.msg
        return (<div align='center' > <Alert severity="error">{msg}</Alert></div>);
    }
}

class CVBase64 extends React.Component {
    render() {
        const { data } = this.props;
        return ( data ? <div > <iframe title='Curriculum Jonnattan' width='95%' height='250px' src={'data:application/pdf;base64,' + data} /> </div> : null);
    }
}

export { Curriculum };
