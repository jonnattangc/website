import React from 'react';
import { Alert, Paper } from '@mui/material';
import { CargaTexto } from "./CargaTexto";

class Curriculum extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loading: true, data: null, errorMsg: null };
        this.onLoad()
    }

    onLoad = async () => {
        let dataCV = null
        let msgError = null
        try {
            console.info("Entro a obtener el curriculum")
            var request = await fetch(
                'https://dev.jonnattan.com/page/cv/jonnattan', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            });
            if (request.status === 200) {
                var response = await request.json();
                console.log('GET Name: ', response.name);
                response.data !== '' ? dataCV = response.data : msgError = 'El CV de ' + response.name + ' no se ha recuperado'  
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
