import * as React from 'react';
import { Grid, Select, MenuItem, TextField, FormControl, Button, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


class Crud extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            message: '',
            loading: true
        };
    }

    render() {
        const { age } = this.props;
        const { error } = this.state;
        return (
            <div className='App_Main'>
                <form action="http://192.168.0.10:8089/emulator/page/users/save" method="POST">
                    <div>
                        <TextField id="nameUser" label="Nombre Usuario" helperText="Usuario de la persona" error={error} size="small" />
                        <TextField id="pass" label="Contraseña" helperText="Contraseña" type="password" error={error} size="small" />
                    </div>
                    <div>
                        <TextField id="fullName" label="Nombre Completo" helperText="Nombre Completo" error={error} size="small" />
                        <TextField id="mobile" label="Nombre Completo" helperText="Nombre Completo" error={error} size="small" />
                        <TextField id="rut" label="Rut" helperText="Rut de la persona" error={error} size="small" /> 
                        <TextField id="mail" label="Mail" helperText="Mail de la persona" error={error} size="small" />
                    </div>
                    <div>
                        <TextField id="Ciudad" label="Nombre Completo" helperText="Nombre Completo" error={error} size="small" />
                        <input id="realname" hidden value="realname" />
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}> 
                            <Select labelId="demo-simple-select-label" id="type" value={age} label="Tipo de Usuario">
                                <MenuItem value={0} selected> Normal </MenuItem>
                                <MenuItem value={1}>Administrador</MenuItem>
                                <MenuItem value={2}>Seguridad</MenuItem> </Select>
                        </FormControl>
                        <TextField id="address" label="Dirección" helperText="Direccion" error={error} size="small" />
                        <input type="hidden" name="csrf_token" value="{{ csrf_token() }}" />
                    </div>
                    <div style={{ padding: "10px", border: "none" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <div style={{ display: "contents", padding: "10px 10px 10px 10px", border: "none" }}>
                                    <Button type="submit" variant="contained" color="primary" >CSRF</Button>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div style={{ display: "contents", padding: "10px 10px 10px 10px", border: "none" }}>
                                    <Button type="submit" variant="contained" color="success" >Enviar OTP</Button>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div style={{ display: "contents", padding: "10px 10px 10px 10px", border: "none" }}>
                                    <Button type="submit" variant="contained" color="success" >Validar OTP</Button>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </form>
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
                'http://192.168.0.21:8089/emulator/page/users', {
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