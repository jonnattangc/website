import React from 'react';
import { Paper, Grid, CircularProgress } from '@mui/material';
import { CardMemorize } from './CardMemorize'
import env from 'react-dotenv';

class Memorize extends React.Component {

    constructor(props) {
        super(props);
        this.state = { card_state: null };
        this.getCurrentData()
    }

    getCurrentData = async () => {
        try {
            var request = await fetch(
                env.API_BASE_URL + '/page/memorize/states', {
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
                console.log('GET Response States: ', response);
                var card_state = [];
                response.data.forEach(state => {
                    card_state.push({
                        name: state.name,
                        visible: state.state === 'up' ? true : false
                    });
                });
                console.log('GET States: ', card_state);
                this.setState({ card_state: card_state })
            }
            else {
                console.log('[405]: ' + request.error);
            }
        }
        catch (error) {
            throw Error(error);
        }
    }

    render() {
        const { card_state } = this.state;
        let listItems = null

        if (card_state != null) {
            listItems = card_state.map((value) =>
                <Grid item xs={4}>
                    <Paper elevation={3}>
                        <CardMemorize visible={value.visible} name={value.name} />
                    </Paper>
                </Grid>
            )
        }

        return (
            <div align="center">
                {
                    listItems ? 
                    <Grid container spacing={2}>
                    { 
                      listItems
                    } 
                    </Grid>
                    : <CircularProgress color="success" size={50}/>
                }
            </div>
        );
    }
}

export { Memorize };

