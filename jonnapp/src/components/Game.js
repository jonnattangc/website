import React from 'react';
import { Button, Stack, Paper } from '@mui/material';
import { Memorize } from './Memorize';
import env from 'react-dotenv';

class Game extends React.Component {
    render() {
        return (
            <div className='App_Main' align='center' >
                <Stack spacing={3}>
                    <Paper elevation={1}>  <Jugadores /> </Paper>
                    <Paper elevation={1}> <Memorize /> </Paper>
                </Stack>
            </div>
        )
    }
}

class Jugadores extends React.Component {

    mouseClick = async (e) => {
        try {
            var request = await fetch(
                env.API_BASE_URL + '/page/memorize/reset', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                    'Authorization': 'Basic ' + env.AUTH_JONNA_SERVER,
                    'x-api-key': env.PAGE_API_KEY
                }
            });
            var response = await request.json();
            if (request.status === 200) {
                console.log('GET Response: ', response);
            }
            else {
                console.log('[405]: ' + request.error);
            }
        }
        catch (error) {
            throw Error(error);
        }
        window.location.reload()
    }

    render() {
        return (
            <div className='App_Main' align='center' >
                <h3>Este es el juego del memorize, se trata de dar vuelta 2 cartas por jugador</h3>
                <Button variant="contained" color="primary" onClick={this.mouseClick} > Reiniciar </Button>
            </div>
        );
    }
}


export { Game };