import React from 'react';
import { Alert, Grid, CircularProgress, TextField, Button, Stack } from '@mui/material';
import Select from 'react-select';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import env from 'react-dotenv'

export class CLCommunes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading_gral: true,
            loading_reg: false,
            searching: false,
            captcha_ok: false,
            communes: null,
            commune: null,
            regions: null,
            region: null,
            errorMsg: null,
            selections: [],
            address: ''
        };

        this.getRegions();
        // this.getCommunes(props.default);
    }
    /**
        * Obtiene las comunas de una regi'on
        * @param {*} region
        */
    getRegions = async () => {
        try {
            this.setState({ loading_reg: true });
            var region_request = await fetch(
                env.API_BASE_URL + '/geo/regions', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                    'Authorization': 'Basic ' + env.AUTH_JONNA_SERVER,
                    'x-api-key': env.GEO_API_KEY
                },
            });
            var region_response = await region_request.json();

            if (region_request.status === 200) {
                console.log('GET region_response.regions: ', region_response);
                var regiones = [];
                region_response.data.regions.forEach(region => {
                    regiones.push({
                        value: region.id,
                        label: region.value
                    });
                });
                console.log('GET regions: ', regiones);
                this.setState({ regions: regiones, loading_gral: false, loading_reg: false });
            }
            else {
                console.log('[405]: ' + region_request.error);
                this.setState({ loading_gral: false, loading_reg: false, errorMsg: region_request.error });
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
    getCommunes = async (region) => {
        try {
            this.setState({ loading_reg: true });
            var communes_request = await fetch(
                env.API_BASE_URL + '/geo/' + region + '/communes', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                    'Authorization': 'Basic ' + env.AUTH_JONNA_SERVER,
                    'x-api-key': env.GEO_API_KEY
                },
            });
            var commune_response = await communes_request.json();

            if (communes_request.status === 200) {
                console.log('GET Communes: ', commune_response.data);
                var communes = [];
                commune_response.data.communes.forEach(commune => {
                    communes.push({
                        value: commune.id,
                        label: commune.value
                    });
                });

                this.setState({ communes: communes, region: commune_response.data.region, loading_reg: false, });
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
            this.setState({ commune: event.label });
        }
        catch (error) {
            this.setState({ loading: false, errorMsg: error });
            throw Error(error);
        }
    }

    onSearchMap = async (event) => {
        try {
            this.setState({ searching: true });
            console.log('%%%%%%%%%%%%%%%%% event: ', event)
            let address = {
                street: this.state.address.replaceAll(' ', '%20'),
                city: this.state.commune.replaceAll(' ', '%20'),
                state: this.state.region.replaceAll(' ', '%20'),
                country: 'Chile'
            }
            let place = await this.findGeoPos(address)
            if (place != null) {
                let point = [place.latitude, place.longitude]
                this.props.mapfunc(point, "Busqueda", place.detail)
                let msg = 'Lat: ' + place.latitude + ' Lon: ' + place.longitude + ' ' + place.detail 
                this.setState({ searching: false, errorMsg: msg });
            } else {
                this.setState({ searching: false, errorMsg: 'No hay resultados en la busqueda' });
            }
        }
        catch (error) {
            this.setState({ searching: false, errorMsg: error });
            throw Error(error);
        }
    }

    findGeoPos = async (dataTx) => {
        let jsonrx = null
        var request = await fetch(env.API_BASE_URL + '/geo/search', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                'Authorization': 'Basic ' + env.AUTH_JONNA_SERVER,
                'x-api-key': env.GEO_API_KEY
            },
            body: JSON.stringify({ 'data': dataTx })
        });

        console.log('POST request: ', request);
        if (request.status === 200) {
            let response = await request.json()
            console.log('Respuesta Servidor Geografico: ', response)
            if (response.data != null)
                jsonrx = response.data
        } else {
            console.log('Error: ', request.status)
        }
        return jsonrx
    }

    onChangeRegion = async (event) => {
        try {
            console.log('#### Region: ', event.label);
            this.getCommunes(event.value);
        }
        catch (error) {
            this.setState({ loading_gral: false, errorMsg: error });
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

    onChangeAddress = async (event) => {
        try {
            this.setState({ address: event.target.value });
        }
        catch (error) {
            throw Error(error);
        }
    }

    async validateCapcha(token, ekey) {
        try {
            console.log('HCaptcha token: ', token);
            console.log('HCaptcha ekey: ', ekey);
            let dataCaptcha = {
                token: token,
                secret: env.HCAPTCHA_SECRET,
                sitekey: env.HCAPTCHA_SITE_KEY
            }
            var request = await fetch(
                env.API_BASE_URL + '/page/hcaptcha', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({ 'data': dataCaptcha }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                    'Authorization': 'Basic ' + env.AUTH_JONNA_SERVER,
                    'x-api-key': env.PAGE_API_KEY
                },
            });
            var response = await request.json();

            if (request.status === 200) {
                console.log('POST : ', response);
                this.setState({ captcha_ok: response.data.success });
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
        const { captcha_ok, loading_gral, loading_reg, searching, communes, regions, errorMsg } = this.state;
        console.log('state', this.state)

        if (loading_gral)
            return (<div className='App_Main' align='center' > <CircularProgress /> </div>);
        else {
            return (
                <div className='App_Main' align='center' >
                    <Stack spacing={2}>
                        <Grid container spacing={0} rowSpacing={2} columnSpacing={1}>
                            <Grid item xs={3}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <div style={{ width: '100%' }}>
                                        <Select labelId='Regiones' id='reg' options={regions} isSearchable={true} onChange={(event) => { this.onChangeRegion(event) }} />
                                    </div>
                                    {
                                        loading_reg ? <CircularProgress color="success" size={20} /> : null
                                    }
                                </Stack>
                            </Grid>

                            <Grid item xs={2}>
                                {
                                    communes != null ? <Select labelId='Comunas' id='com' options={communes} isSearchable={true}
                                        onChange={(event) => { this.onChangeCommune(event) }} /> : null
                                }
                            </Grid>

                            <Grid item xs={2}>
                                {
                                    communes != null && regions != null ?
                                        <TextField id="dir" fullWidth label="Dirección personal" helperText="Dirección cualquiera dentro de Chile" size="small" onChange={(event) => { this.onChangeAddress(event) }} />
                                        : null
                                }
                            </Grid>

                            <Grid item xs={3}>
                                {
                                    communes != null && regions != null ?
                                        <div style={{ width: '80%' }}> <HCaptcha sitekey={env.HCAPTCHA_SITE_KEY} onVerify={(token, ekey) => this.handleVerificationSuccess(token, ekey)} /> </div>
                                        : null
                                }
                            </Grid>
                            <Grid item xs={2}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    {
                                        communes != null && regions != null ?
                                            <Button type="submit" disabled={!captcha_ok} variant="contained" color="success" onClick={this.onSearchMap}> Buscar</Button>
                                            : null
                                    }
                                    {
                                        searching ? <CircularProgress color="success" size={20} /> : null
                                    }
                                </Stack>

                            </Grid>
                            <Grid item xs={12}>
                                {
                                    errorMsg != null ? <div style={{ width: '70%', align: 'left', itemAlign: 'left' }}><Alert severity="error">{errorMsg}</Alert> </div> : null
                                }
                            </Grid>
                        </Grid>
                    </Stack>
                </div>
            );
        }
    }
}