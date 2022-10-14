import React from 'react';
import { Skeleton, Grid } from '@mui/material';

class CargaTexto extends React.Component {

    render() {
        return (
            <div className='App_Main' align='center' >
                <Grid container rowSpacing={5} columnSpacing={0} >
                    <Grid item xs={8}>
                        <Skeleton animation="wave" />
                    </Grid>
                    <Grid item xs={4} >
                        <Skeleton variant="rectangular" width={100} height={100} />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="text" />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="text" />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rectangular" height={120} />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="text" />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="text" />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rectangular" height={120} />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="text" />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export { CargaTexto };
