import React from 'react';
import { Alert, Paper, Grid } from '@mui/material';
import { CargaTexto } from "./CargaTexto";
import env from 'react-dotenv';

class Curriculum extends React.Component {

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
        const { loading, data, errorMsg} = this.state;
        return (loading ? <CargaTexto /> : errorMsg != null ? <ErrorCv msg={errorMsg}/> : <CVBase64 data={data} />);
    }
}

class ErrorCv extends React.Component {
    render() {
        const msg = this.props.msg
        return (<div className='App_Main' align='center' >
            <Paper elevation={8}>
                <Alert severity="error">{msg}</Alert>
            </Paper>
        </div>);
    }
}

class CVBase64 extends React.Component {
    render() {
        const { data } = this.props;
        return (
            <div className='App_Main' >
              <Grid container rowSpacing={5} columnSpacing={0} >
                <Grid item xs={10}>
                    <p><h5>Hola Mundo !</h5></p>
                    <p>Mi nombre es Jonnattan, vivo en la ciudad de Viña del Mar, en Chile, desarrollé este sitio (que jamás termina) para mostrar al mundo mis experimentos realizados en los momentos de ocio. 
                        Muchos de uds se preguntarán: “por que me dedico a programar en vez de hacer otras cosas como ver tv o estar en la playa”. La respuesta es sencilla: ni yo lo entiendo claramente, creo que es por la curiosidad de aprender y de experimentar, 
                        pero además por un poco de miedo quizas de quedar añejo con mis conocimientos de programación.
                        En fin, en <a href='https://www.jonnattan.com' target='_blank' rel='noreferrer' >mi blog</a> pueden encontrar algunas cosas como mis gustos y forma de pensar. Este sitio es solo dedicado a mis proyectos personales y materializar 
                        los conocimientos que he adquirido. Todos los códigos fuente están disponibles en mi <a href='https://github.com/jonnattangc' target='_blank' rel='noreferrer'>GitHub</a>.
                    </p>
                    <p>
                        Espero que sea se su agrado. Jonnattan :)
                    </p>
                </Grid>
                <Grid item xs={2} >
                  <Paper elevation={8}> <iframe title='Curriculum Jonnattan' width='95%' height='250px' src={'data:application/pdf;base64,' + data} /></Paper>
                </Grid>
              </Grid>
            </div>
        );
    }
}

export { Curriculum };
