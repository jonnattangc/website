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
            commune: null,
            regions: null,
            region: null,
            errorMsg: null,
            selections: []
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
            this.setState({ loading: true });
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
    getCommunes  = async (region) => {
        try {
            this.setState({ loading: true });
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

                this.setState({ communes: communes, region: commune_response.data.region, loading: false, });
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
            console.log('%%%%%%%%%%%%%%%%% event: ', event )
            let address = {
                street: 'Michimalongo',
                city: this.state.commune,
                state: this.state.region,
                country:'Chile'
            }
            let place = await this.findGeoPos( address )
            if(place != null) {
                let point = [place.latitude, place.longitude]
                this.props.mapfunc( point, "Mi Hogar", place.detail )
            }else{
                this.setState({ errorMsg: 'No hay resultados en la busqueda' });
            }
        }
        catch (error) {
            this.setState({ loading: false, errorMsg: error });
            throw Error(error);
        }
    }

    findGeoPos = async ( dataTx ) => {
        let jsonrx = null
        var request = await fetch( env.API_BASE_URL + '/geo/search', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                'Authorization': 'Basic ' + env.AUTH_JONNA_SERVER,
                'x-api-key': env.GEO_API_KEY
            },
            body: JSON.stringify( {'data': dataTx} )
        });
    
        console.log('POST request: ', request );
        if (request.status === 200) {
          let response = await request.json()
          console.log('Respuesta Servidor: ', response )
          if ( response.data != null )
            jsonrx = response.data
        } else {
          console.log('Error: ', request.status )
        }
        return jsonrx
      }

    onChangeRegion = async (event) => {
        try {
            console.log('#### Region: ', event.label);
            this.getCommunes(event.value);
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
            let dataCaptcha = {
                token: token,
                secret: env.HCAPTCHA_SECRET,
                sitekey : env.HCAPTCHA_SITE_KEY
            }
            var request = await fetch(
                env.API_BASE_URL + '/page/hcaptcha', {
                method: 'POST', 
                mode: 'cors',
                body: JSON.stringify({ 'data' : dataCaptcha}),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                    'Authorization': 'Basic ' + env.AUTH_JONNA_SERVER,
                    'x-api-key': env.PAGE_API_KEY
                },
            });
            var response = await request.json();

            if (request.status === 200 ) {
                console.log('POST : ', response);
                this.setState({ captcha: response.data.success });
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
        const { captcha, loading, communes, regions, errorMsg } = this.state;
        console.log( 'state', this.state )

        if (loading)
            return (<div className='App_Main' align='center' > <CircularProgress /> </div>);
        else {
            return (
                <div className='App_Main' align='center' >
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            <Select labelId='Regiones' id='reg' options={regions} isSearchable={true} onChange={(event) => { this.onChangeRegion(event) }} />
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
                                <TextField id="dir" fullWidth label="Dirección personal" helperText="Dirección cualquiera dentro de Chile"  size="small" />
                            : null
                        }
                        </Grid>
                        <Grid item xs={2}> 
                        {
                            captcha ?  
                                <Button type="submit" variant="contained" color="success" onClick={this.onSearchMap}> Buscar</Button>
                            : null
                        }
                        </Grid>
                        <Grid item xs={4}> 
                        {
                            !captcha ? 
                              <HCaptcha sitekey={env.HCAPTCHA_SITE_KEY} onVerify={(token,ekey) => this.handleVerificationSuccess(token, ekey)} />
                            : null
                        }
                        </Grid>
                        <Grid item xs={8}>
                        {
                            !captcha ? <Alert severity="success">Completa el desafio para ver qué pasa !!!! </Alert> : null
                        }
                        </Grid>
                        <Grid item xs={12}>
                        {
                            errorMsg != null ? <div className='App_Main' align='center'> <Alert severity="error">{errorMsg}</Alert> </div> : null
                        }
                        </Grid>
                        

                   </Grid>
                </div>
            );
        }

    }
}

export { CLCommunes };