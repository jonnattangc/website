import React from 'react';
import { Alert, Paper } from '@mui/material';
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
            <div className='App_Main' align='center' >
                <Paper elevation={8}>
                    <iframe title='Curriculum Jonnattan' width='100%' height='600px' src={'data:application/pdf;base64,' + data} />
                </Paper>
            </div>
        );
    }
}

export { Curriculum };
