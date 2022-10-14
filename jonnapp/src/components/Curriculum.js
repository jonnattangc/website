import React from 'react';
import { Alert, Paper } from '@mui/material';
import { CargaTexto } from "./CargaTexto";

class Curriculum extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loading: true, data: null, errorMsg: null };
        this.loadData();
    }

    loadData = async () => {
        try {
            this.setState({ loading: true });
            var request = await fetch(
                'https://dev.jonnattan.com/cv/jonnattan', {
                method: 'GET',
                mode: 'no-cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            });
            if (request.status === 200) {
                var response = await request.json();
                console.log('GET Name: ', response.name);
                if (response.data !== '')
                    this.setState({ loading: false, data: response.data, errorMsg: null });
                else
                    this.setState({ loading: false, data: null, errorMsg: 'El CV de ' + response.name + ' no se ha recuperado' });
            }
            else {
                console.log('[405]: ' + request.error);
                this.setState({ loading: false, data: null, errorMsg: "Error al cargar el CV" });
            }
        }
        catch (error) {
            this.setState({ loading: false, errorMsg: error });
            throw Error(error);
        }
    }

    render() {
        const { loading, data, errorMsg } = this.state;
        return (
            loading ? <CargaTexto /> :
                errorMsg != null ? <div className='App_Main' align='center' >
                    <Paper elevation={8}>
                        <Alert severity="error">{errorMsg}</Alert>
                    </Paper>
                </div>
                    : <div className='App_Main' align='center' >
                        <Paper elevation={8}>
                            <iframe title='Curriculum Jonnattan' width='100%' height='600px' src={'data:application/pdf;base64,' + data} />
                        </Paper>
                    </div>
        );
    }
}

export { Curriculum };
