import React from 'react';
import { Button, Stack } from '@mui/material';
import { Memorize } from './Memorize'

class Game extends React.Component {

    render() {
        // console.info('Experiments... ' + window.location.pathname);
        return (
            <div className='App_Main' align='center' >
                <Stack spacing={3}>
                    <Jugadores />
                    <Memorize />
                </Stack>
            </div>
        )
    }
}

class Jugadores extends React.Component {

    mouseClick = async (e) => {
        try {
            var request = await fetch(
                'https://dev.jonnattan.com/page/memorize/reset', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
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