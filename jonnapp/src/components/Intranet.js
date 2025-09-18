import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { Grid, Stack } from '@mui/material';
import { Curriculum } from './Curriculum'
import env from 'react-dotenv';

class Intranet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            authorized: false,
        };
        this.getAuthIntranet = this.getAuthIntranet.bind(this);
        this.getAuthIntranet();
    }
    /**
        * Obtiene las comunas de una regi'on
        * @param {*} region
        */
    async getAuthIntranet() {
        try {
            var request = await fetch(
                env.API_BASE_URL + '/checkall', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                    'x-api-key': env.PAGE_API_KEY
                }
            });
            var response = await request.json();

            if (request.status === 200 && response.Server === 'dev.jonnattan.com') {
                console.log('GET Response: ', response);
                this.setState({ authorized: true, loading: false, });
            }
            else {
                console.log('[405] Error: ' + request.status);
                this.setState({ loading: false, authorized: false });
            }
        }
        catch (error) {
            this.setState({ loading: false, authorized: false });
            throw Error(error);
        }
    }

    render() {
        const { loading, authorized } = this.state;
        const errorMsg = authorized ? '' : 'El ingreso al sitio privado es restringido'
        if (loading)
            return (<div className='App_Main' align='center' > Solicitando autorización <Spinner animation="border" variant="success" /> </div>);
        else if (authorized)
            return (
                <div class="App_Main">
                    <Stack spacing={1}>
                        <Grid container rowSpacing={2} columnSpacing={2} >
                            <Grid item xs={9}>
                                <iframe src="https://dev.jonnattan.com/page" title="Sitio Interno" width='100%' height='100%' />
                            </Grid>
                            <Grid item xs={3} >
                                <Curriculum />
                            </Grid>
                        </Grid>
                    </Stack>
                </div>
            );
        else {
            return (
                <div className='App_Main' align='center' >
                    <div class="alert alert-danger" role="alert">{errorMsg}</div>
                </div>
            );
            // return window.location.replace('https://dev.jonnattan.com/wp');
        }

    }
}

export { Intranet };