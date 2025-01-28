import React from 'react';
import { Skeleton, Grid } from '@mui/material';

class CargaTexto extends React.Component {

    render() {
        return (
            <Grid container rowSpacing={0} columnSpacing={0} >
                <Grid item xs={9}>
                    <Skeleton animation="wave" />
                </Grid>
                <Grid item xs={3} >
                    <Skeleton variant="rectangular" width="50px" height="50px" />
                </Grid>
                <Grid item xs={12}>
                    <Skeleton variant="text" />
                </Grid>
                <Grid item xs={12}>
                    <Skeleton variant="text" />
                </Grid>
                <Grid item xs={12}>
                    <Skeleton variant="text" />
                </Grid>
            </Grid>
        );
    }
}

export { CargaTexto };
