import * as React from 'react';
import { Alert, Button, Paper, Stack, Box, Grid, Snackbar, IconButton } from '@mui/material';
import { Dashboard } from './Dashboard'
import { DataGrid } from '@mui/x-data-grid';

// import { GoogleReCaptcha } from 'react-google-recaptcha-v3';

class Experiments extends React.Component {
    render() {
        return (
            <div className='App_Main' align='center' >
                <Stack spacing={3}>
                    <Paper elevation={8}> <LinkOther /> </Paper>
                    <Paper elevation={8}> <Dashboard /> </Paper>
                    <Paper elevation={8}> <MyImagenToS3 /> </Paper>
                </Stack>
            </div>
        )
    }
}

class MyImagenToS3 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            size: 0,
            type: null,
            data: null,
            name: null,
            x: 0,
            y: 0,
            photos: null,
            docs: null
        };
    }

    moveMouse = (e) => {
        const { clientX, clientY } = e;
        this.setState({ x: clientX, y: clientY });
    }

    handleClick = (e) => {
        e.preventDefault();
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var file = document.getElementById('file').files[0];
            if (file == null) return;
            this.fileConvert(file)
        }
    }

    async fileConvert(file) {
        //Resizer.imageFileResizer(file, 500, 500, 'PNG', 100, 0, data => {
        //    this.executePost(data, "png")
        //}, 'base64');
    }

    async executePost(blobImage, extImage) {
        const nameFile = "archivo." + extImage;
        this.setState({ data: blobImage, name: nameFile })
    }

    getDatos(data) {
        // forma data:image/jpeg;base64,/9j/4RiDRXhpZgAATU0AKgA.
        return data.split(",")[1]
    }

    render() {

        const columns = [
            { field: 'id', headerName: 'ID', width: 90 },
            {
                field: 'firstName',
                headerName: 'Nombre',
                width: 150,
                editable: true,
            },
            {
                field: 'lastName',
                headerName: 'Descripcion',
                width: 150,
                editable: true,
            },
            {
                field: 'age',
                headerName: 'Tamaño (Kb)',
                type: 'number',
                width: 110,
                editable: true,
            },
            {
                field: 'fullName',
                headerName: 'Full name',
                description: 'This column has a value getter and is not sortable.',
                sortable: false,
                width: 160,
                valueGetter: (params) =>
                    `${params.row.firstName || ''} ${params.row.lastName || ''}`,
            },
        ];

        const rows = [
            { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
            { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
            { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
            { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
            { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
            { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
            { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
            { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
            { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
        ];

        const { data, name, x, y } = this.state;
        return (
            <>
                <div className='App_Main' align='center' onMouseMove={this.moveMouse} >
                    <div>
                        <p>
                            <input type="file" id="file" name="files" accept="image/*" />
                            &nbsp;&nbsp;&nbsp;
                            <Button type="submit" variant="contained" color="primary" onClick={this.handleClick} >
                                Enviar
                            </Button>
                        </p>
                    </div>
                    <div>&nbsp;&nbsp;&nbsp; Coordenadas: X({x},{y})  </div>
                    {
                        data !== null ? <img alt="Imagen Producto" src={data} title={name} /> : null
                    }
                </div>
                <div className='App_Main' >
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                            disableSelectionOnClick
                            experimentalFeatures={{ newEditingApi: true }}
                        />
                    </Box>
                </div>
            </>
        );
    }
}

function LinkOther() {

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        setOpen(false);
    };

    const action = (
        <React.Fragment>
        <Button color="secondary" size="small" onClick={handleClose}>
           Close Action
        </Button>

        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
        >
        </IconButton>
        </React.Fragment>
    );


    const getData = async () => {
        try {
            var request = await fetch(
                'https://dev.jonnattan.com/page/aws/contents', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                }
            });
            var response = await request.json();
            if (request.status === 200) {
                var photos = []
                response.photos.forEach(photo => {
                    photos.push(photo);
                });
                var docs = []
                response.docs.forEach(doc => {
                    docs.push(doc);
                });
                // this.setState({ photos: photos, docs: docs })
            }
            else {
                console.log('[409]: ' + request.error);
            }
        }
        catch (error) {
            throw Error(error);
        }
    }

    const redirectUcc = () => {
        window.location.href = 'https://dev.jonnattan.com/ucc/15173808-7';
    }

    const redirectCSRF = () => {
        window.location.href = 'https://dev.jonnattan.com/page';
    };

    return (
        <div className='App_Menu' align='center' >
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Button type="submit" variant="contained" color="primary"  onClick={redirectUcc}>
                        TEST UCC
                    </Button>
                </Grid>
                <Grid item xs={3}>
                    <Button type="submit" variant="contained" color="primary" onClick={getData} >
                        Test AWS
                    </Button>
                </Grid>
                <Grid item xs={3}>
                    <Button type="submit" variant="contained" color="primary"  onClick={redirectCSRF}>
                        CSRF Protection Test
                    </Button>
                </Grid>

                <Grid item xs={3}>
                    <Button type="submit" variant="contained" color="primary"  onClick={handleClick}>
                        Notificacion Error
                    </Button>
                    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} action={action}>
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                            Mensaje de error !
                        </Alert>
                    </Snackbar>
                </Grid>
            </Grid>
        </div>
    );
}


export { Experiments };