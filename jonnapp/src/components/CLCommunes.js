import React from 'react';
import { Alert, Grid, CircularProgress, TextField, Button } from '@mui/material';
import Select from 'react-select';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import env from 'react-dotenv'

class CLCommunes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            captcha: false,
            communes: null,
            regions: null,
            region: props.default,
            errorMsg: null,
            selections: []
        };
        this.getCommunes = this.getCommunes.bind(this);
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
                env.API_BASE_URL + '/page/cxp/georeference/api/v1.0/regions', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                    'Authorization': 'Basic ' + env.AUTH_JONNA_SERVER
                },
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
                env.API_BASE_URL + '/page/cxp/georeference/api/v1.0/coverage-areas?RegionCode=' + region + '&type=1', {
                method: 'GET', 
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                    'Authorization': 'Basic ' + env.AUTH_JONNA_SERVER
                },
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

    onChangeCommune = async (event) => {
        try {
            console.log('#### Comuna: ', event.value);
        }
        catch (error) {
            this.setState({ loading: false, errorMsg: error });
            throw Error(error);
        }
    }

    onSearchMap = async (event) => {

    }

    onChangeRegion = async (event) => {
        try {
            console.log('#### Region: ', event.value);
            this.setState({ region: event });
            await this.getCommunes(event.value);
        }
        catch (error) {
            this.setState({ loading: false, errorMsg: error });
            throw Error(error);
        }
    }

    handleVerificationSuccess = async (token, ekey) => {
        try {
            await this.validateCapcha(token, ekey)
        }
        catch (error) {
            throw Error(error);
        }
    }

    async validateCapcha( token, ekey ) {
        try {
            console.log('HCaptcha token: ', token);
            console.log('HCaptcha ekey: ', ekey);
            let data = {
                response: token,
                secret: env.HCAPTCHA_SECRET,
                sitekey : env.HCAPTCHA_SITE_KEY
            }
            var request = await fetch(
                'https://dev.jonnattan.com/page/hcaptcha', {
                method: 'POST', 
                mode: 'cors',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                    'Authorization': 'Basic ' + env.AUTH_JONNA_SERVER
                },
            });
            var response = await request.json();

            if (request.status === 200 ) {
                console.log('POST : ', response);
                this.setState({ captcha: response.success });
            }
            else {
                console.log('[405]: ' + request.error);
                this.setState({ captcha: false });
            }
        }
        catch (error) {
            //this.setState({ loading: false, errorMsg: error });
            throw Error(error);
        }
    }

    render() {
        const { captcha, loading, communes, regions, region, errorMsg } = this.state;
        if (loading)
            return (<div className='App_Main' align='center' > <CircularProgress /> </div>);
        else if (errorMsg != null)
            return (<div className='App_Main' align='center'> <Alert severity="error">{errorMsg}</Alert> </div>);
        else {
            return (
                <div className='App_Main' align='center' >
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            <Select labelId='Regiones' id='reg'
                                options={regions} value={region} isSearchable={true} onChange={(event) => { this.onChangeRegion(event) }} />
                        </Grid>
                        <Grid item xs={3}>
                            {
                                communes != null ? <Select labelId='Comunas' id='com' options={communes} isSearchable={true}
                                    onChange={(event) => { this.onChangeCommune(event) }} /> : null
                            }
                        </Grid>
                        <Grid item xs={4}> 
                        {
                            captcha && communes != null && regions != null ?  
                                <TextField id="dir" fullWidth label="Dirección personal" helperText="Dirección cualquiera"  size="small" />
                            : null
                        }
                        </Grid>
                        <Grid item xs={2}> 
                        {
                            captcha && communes != null && regions != null ?  
                                <Button type="submit" variant="contained" color="success" onClick={this.onSearchMap}> Buscar</Button>
                            : null
                        }
                        </Grid>
                        <Grid item xs={4}> 
                        {
                            !captcha ? 
                              <HCaptcha sitekey={env.HCAPTCHA_SITE_KEY}
                                onVerify={(token,ekey) => this.handleVerificationSuccess(token, ekey)} />
                            : null
                        }
                        </Grid>
                        <Grid item xs={8}>
                        {
                            !captcha ? <Alert severity="success">Completa el desafio para ver qué pasa !!!! </Alert> : null
                        }
                        </Grid>

                   </Grid>
                </div>
            );
        }

    }
}

export { CLCommunes };