import * as React from 'react';
import { Grid, Alert, Select, MenuItem, CircularProgress, TextField, FormControl, Button, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import HCaptcha from '@hcaptcha/react-hcaptcha';

class Crud extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            message: '',
            genOtp: false,
            validOtp: false,
            captcha: false,
            mobile: '', 
            len: null , 
            otp: null , 
            ref: ''
        };
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
                token: token,
                secret: '0xFB70be996d26a5D2A8a369FdC0a80965E478c1C7',
                sitekey : 'f128e428-a147-4aa9-b4db-55c0af0a4381'
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

     /**
        * Obtiene las comunas de una regi'on
        * @param {*} region
        */
    generateOtp = async () => {
        try {
            const { mobile, len } = this.state;
            console.log('Mobile: [' + mobile + '] Len: ' + len );
            this.setState({ genOtp: true, validOtp: false, error: false });

            let mobile_phone = mobile != null ? mobile.replace(' ','') : ''
            
            if( mobile_phone.length === 8 )
                mobile_phone = '569' + mobile_phone 
            if( mobile_phone.length === 9 )
                mobile_phone = '56' + mobile_phone 
            if( mobile_phone.startsWith('+56') )
                mobile_phone = mobile_phone.replace('+56','56') 

            console.log('Forrmatter number ' + mobile_phone );
            if ( mobile_phone.length < 10 )
              this.setState({ genOtp: false, validOtp: false, error: true, captcha: false, message: response.statusDescription });

            let data = {
                number_mobile: mobile_phone,
                duration_min: 5,
                length_otp : len
            }

            var request = await fetch(
                'https://dev.jonnattan.com/page/waza/generate', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                    'Authorization': 'Basic am9ubmF0dGFuOndzeHphcTEyMw==',
                },
            });
            var response = await request.json();
            console.log('POST: ', response);
            if (request.status === 200) {
                let text = 'Referencia: ' + response.ref
                this.setState({ genOtp: false, error: false, message: text, captcha: true });
            }
            else {
                console.log('Código Error: ' + response.statusCode);
                this.setState({ genOtp: false, validOtp: false, error: true, captcha: false, message: response.statusDescription });
            }
        }
        catch (error) {
            this.setState({genOtp: false, validOtp: false, error: true, message: error, captcha: false });
            throw Error(error);
        }
    }

     /**
        * Valida la otp
        */
    validateOtp = async () => {
        const { otp, ref } = this.state;
        console.log('Otp: ' + otp + ' Ref: ' + ref );
        try {
            this.setState({ genOtp: false, validOtp: true, error: false, message:'' });
            let data = {
                reference: ref,
                otp: otp
            }
            var request = await fetch(
                'https://dev.jonnattan.com/page/waza/validate', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                    'Authorization': 'Basic am9ubmF0dGFuOndzeHphcTEyMw==',
                },
            });
            var response = await request.json();

            if (request.status === 200 ) {
                if ( response.success )
                  this.setState({ genOtp: false, validOtp: false, error: false, message: response.statusDescription, captcha: true }); 
                else 
                  this.setState({ genOtp: false, validOtp: false, error: true, captcha: true, message: response.statusDescription });
            }
            else {
                console.log('Código Error: ' + response.statusCode);
                this.setState({ genOtp: false, validOtp: false, error: true, captcha: false, message: response.statusDescription });
            }
        }
        catch (error) {
            this.setState({genOtp: false, validOtp: false, error: true, message: error, captcha: false });
            throw Error(error);
        }
    }

    render() {
        const { error, captcha, genOtp, validOtp, message } = this.state;
        const msgType = error ? "error" : "success"
        const showAlert = message !== ''
        return (
            <div className='App_Main'>
                    <div>
                        <TextField id="mobile" label="Teléfono móvil" helperText="Teléfono del destinatario de la Otp"
                           error={error} size="small" value={this.state.mobile} onChange={(e) => this.setState({ mobile: e.target.value })} />
                        <TextField id="len"  label="Largo de la Otp" helperText="Cantidad de números de la Otp" 
                           error={error} size="small" value={this.state.len} onChange={(e) => this.setState({ len: e.target.value })} />
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}> 
                            <Select labelId="minutos" id="type" value="0" label="Duración en minutos">
                                <MenuItem value={0} selected>5 min.</MenuItem>
                                <MenuItem value={1}>10 min.</MenuItem>
                                <MenuItem value={2}>15 min.</MenuItem> 
                                <MenuItem value={3}>20 min.</MenuItem> 
                                <MenuItem value={4}>30 min.</MenuItem> 
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{ padding: "10px", border: "none" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={10}>
                                <div align="right" style={{ display: "contents", padding: "10px 10px 10px 10px", border: "none" }}>
                                    <Button type="submit" variant="contained" color="success" disabled={!captcha} onClick={this.generateOtp}>Solicitar OTP</Button>
                                </div>
                            </Grid>
                            <Grid item xs={2}>
                            {
                                genOtp ? 
                                    <div align="left">
                                        <CircularProgress color="success" size="20px"/>
                                    </div>
                                : null
                            }     
                            </Grid>
                        </Grid>
                    </div>

                    <div>
                        <TextField id="otp" label="One-Time Password" helperText="Otp Recibida" 
                        error={error} size="small" value={this.state.otp} onChange={(e) => this.setState({ otp: e.target.value })}  />
                        <TextField id="ref"  label="Referencia al pedir otp" helperText="Referencia recibida"
                         error={error} size="small" value={this.state.ref} onChange={(e) => this.setState({ ref: e.target.value })} />
                    </div>
                    <div style={{ padding: "10px", border: "none" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={10}>
                                <div style={{ display: "contents", padding: "10px 10px 10px 10px", border: "none" }}>
                                    <Button type="submit" variant="contained" color="primary" disabled={!captcha} onClick={this.validateOtp} >Validar OTP</Button>
                                </div>
                            </Grid>
                            <Grid item xs={2}>
                            {
                                validOtp ? 
                                    <div align="left">
                                        <CircularProgress color="primary" size="20px" />
                                    </div>
                                : null
                            }     
                            </Grid>
                        </Grid>
                    </div>

                <div>
                  <HCaptcha sitekey="f128e428-a147-4aa9-b4db-55c0af0a4381" onVerify={(token, ekey) => this.handleVerificationSuccess(token, ekey)} />
                </div>
                <div>
                  {
                    showAlert ?
                    <Alert severity={msgType}> {message} </Alert>
                    : null
                  }
                </div>
            </div>

        );
    }
}

class MyTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: []
        };
        this.getData();
    }

    getData = async () => {
        try {
            var request = await fetch(
                'https://dev.jonnattan.com/emulator/page/users', {
                method: 'GET',
            });
            var response = await request.json();
            console.log('TABLA: ', response);
            if (request.status === 200) {
                var data = []
                response.users.forEach(user => {
                    var usuario = {
                        id: user.id, name: user.name, mail: user.mail, rut: user.rut, city: user.city, age: user.age, mobile: user.mobile, address: user.address
                    }
                    data.push(usuario);
                });
                this.setState({ rows: data })
            }
            else {
                console.log('[409]: ' + request.error);
            }
        }
        catch (error) {
            throw Error(error);
        }
    }

    columns = [
        { field: 'id', headerName: 'ID', width: 30 },
        {
            field: 'name',
            headerName: 'Nombre',
            width: 100,
            editable: true,
        },
        {
            field: 'mail',
            headerName: 'Correo',
            width: 150,
            editable: true,
        },
        {
            field: 'rut',
            headerName: 'RUT',
            width: 110,
            editable: true,
        },
        {
            field: 'city',
            headerName: 'Ciudad',
            width: 110,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Edad',
            width: 110,
            editable: true,
        },
        {
            field: 'mobile',
            headerName: 'Celular',
            width: 110,
            editable: true,
        },
        {
            field: 'address',
            headerName: 'Dirección',
            description: 'Direccion Usuario',
            sortable: false,
            width: 160,
            valueGetter: (params) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
    ]

    render() {
        const { rows } = this.state;
        return (
            <div className='App_Main' >
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid rows={rows} columns={this.columns} pageSize={5} rowsPerPageOptions={[5]} checkboxSelection={false} disableSelectionOnClick experimentalFeatures={{ newEditingApi: true }} />
                </Box>
            </div>
        );
    }

}

export { Crud, MyTable };