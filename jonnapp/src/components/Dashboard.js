import React from 'react';
import { Grid } from '@mui/material';
import { EnrollChart } from './EnrollChart'

class Dashboard extends React.Component {
    render() {
        return (
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <EnrollChart />
                </Grid>
                <Grid item xs={6}>
                    <EnrollChart />
                </Grid>
            </Grid>
        );
    }
}

export { Dashboard };
