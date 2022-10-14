import React from "react";
import { Alert, Checkbox, CircularProgress, Paper, Stack } from '@mui/material';
import Select from 'react-select';
import { MyMap } from './MyMap'

class CLCommunes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            communes: null,
            regions: null,
            region: props.default,
            errorMsg: null,
            selections: []
        };
        this.getCommunes = this.getCommunes.bind(this);
        this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
        this.getRegions = this.getRegions.bind(this);
        this.getRegions();
        // this.getCommunes(props.default);
    }

    /**
     * Obtiene las comunas de una regi'on
     * @param {*} region
     */
    async getRegions() {
        try {
            this.setState({ loading: true });
            var region_request = await fetch(
                'https://dev.jonnattan.com/cxp/georeference/api/v1.0/regions', {
                method: 'GET',
            });
            var region_response = await region_request.json();

            if (region_request.status === 200 && region_response.statusCode === 0) {
                console.log('GET region_response.regions: ', region_response);
                var regiones = [];
                region_response.regions.forEach(region => {
                    regiones.push({
                        value: region.regionId,
                        label: region.regionName
                    });
                });
                console.log('GET regions: ', regiones);
                this.setState({ regions: regiones, loading: false, });
            }
            else {
                console.log('[405]: ' + region_request.error);
                this.setState({ loading: false, errorMsg: region_request.error });
            }
        }
        catch (error) {
            this.setState({ loading: false, errorMsg: error });
            throw Error(error);
        }
    }


    /**
     * Obtiene las comunas de una regi'on
     * @param {*} region
     */
    async getCommunes(region) {
        try {
            this.setState({ loading: true });
            var communes_request = await fetch(
                'https://dev.jonnattan.com/cxp/georeference/api/v1.0/coverage-areas?RegionCode=' + region + '&type=1', {
                method: 'GET'
            });
            var commune_response = await communes_request.json();

            if (communes_request.status === 200 && commune_response.statusCode === 0) {
                console.log('GET Communes: ', commune_response.coverageAreas);
                var communes = [];
                commune_response.coverageAreas.forEach(commune => {
                    communes.push({
                        value: commune.countyCode,
                        label: commune.countyName
                    });
                });
                this.setState({ communes: communes, loading: false, });
            }
            else {
                console.log('[405]: ' + communes_request.error);
                this.setState({ loading: false, errorMsg: communes_request.error });
            }
        }
        catch (error) {
            this.setState({ loading: false, errorMsg: error });
            throw Error(error);
        }
    }

    async onChangeCheckbox(event) {
        try {
            console.log('#### Region: ', event.value);
            this.setState({ region: event });
            await this.getCommunes(event.value);
            // this.props.onCommuneChange(region, communes, this.state.communes);
            // marca el efecto visual
            // this.setState({ selections: communes });
        }
        catch (error) {
            this.setState({ loading: false, errorMsg: error });
            throw Error(error);
        }
    }

    render() {
        const { loading, communes, regions, region, errorMsg } = this.state;
        console.log('Comunas: ', communes);

        if (loading)
            return (<div className='App_Main' align='center' > <CircularProgress /> </div>);
        else if (errorMsg != null)
            return (<div className='App_Main' align='center'> <Alert severity="error">{errorMsg}</Alert> </div>);
        else {
            return (
                <div className='App_Main' align='center'>
                    <Stack spacing={3}>
                        <Paper elevation={8}>
                            <Select labelId='Regiones' id='reg' options={regions} value={region} isSearchable={true}
                                onChange={(event) => { this.onChangeCheckbox(event) }} />
                        </Paper>
                        {
                            communes != null ?
                                communes.forEach((com) => {
                                  <Checkbox defaultChecked size='small' id={com.value} value={com.label} label={com.label}/>
                                }) : null
                        }
                        <Paper elevation={8}>
                        <MyMap/>
                        </Paper>
                    </Stack>
                </div>
            );
        }
    }

}

export { CLCommunes };
