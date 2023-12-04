import * as React from 'react';
import { Grid, Alert, Button, Paper, Stack, Snackbar, IconButton } from '@mui/material';
import { Dashboard } from './Dashboard'
import {Crud, MyTable } from './Crud'
import env from 'react-dotenv';

// import { GoogleReCaptcha } from 'react-google-recaptcha-v3';

class Experiments extends React.Component {
    render() {
        return (
            <Stack spacing={1}>
                <FirsRow /> 
                <TwoRow />
            </Stack>
        )
    }
}

class FirsRow extends React.Component {
    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={6}>
                <Paper elevation={4}> <Crud/> </Paper>
                </Grid>
                <Grid item xs={6}>
                <Paper elevation={4}> <MyTable /> </Paper>
                </Grid>
            </Grid>
        );
    }
}

class TwoRow extends React.Component {
    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={6}>
                <Paper elevation={4}> <BtnsTest /> </Paper> 
                </Grid>
                <Grid item xs={6}>
                <Paper elevation={4}>  <Dashboard /> </Paper> 
                </Grid>
            </Grid>
        );
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
        const { data, name, x, y } = this.state;
        return (
            <div className='App_Main' onMouseMove={this.moveMouse} >
                <div>
                    <p> <input type="file" id="file" name="files" accept="image/*" /> &nbsp;&nbsp;&nbsp; 
                    <Button type="submit" variant="contained" color="primary" onClick={this.handleClick} > 
                       Enviar 
                       </Button>
                    </p>
                </div>
                <div> &nbsp;&nbsp;&nbsp; Coordenadas: X({x},{y})  </div>
                {
                    data !== null ? <img alt="Imagen Producto" src={data} title={name} /> : null
                }
            </div>
        );
    }
}

function BtnsTest() {

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
                env.API_BASE_URL + '/page/aws/contents', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': 'dev.jonnattan.com',
                    'Authorization': 'Basic ' + env.AUTH_JONNA_SERVER
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
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <MyImagenToS3 />
            </Grid>
            <Grid item xs={6}>
                <div style={{ padding: "30px 10px" }}> <Button type="submit" variant="contained" color="primary" onClick={redirectUcc}>     TEST UCC </Button>
                </div>
            </Grid>
            <Grid item xs={6}>
                <div style={{ padding: "30px 10px" }}>
                    <Button type="submit" variant="contained" color="primary" onClick={getData} > Test AWS
                    </Button>
                </div>
            </Grid>
            <Grid item xs={6}>
                <div style={{ padding: "30px 10px" }}>
                    <Button type="submit" variant="contained" color="primary" onClick={redirectCSRF}> CSRF
                    </Button>
                </div>
            </Grid>

            <Grid item xs={6}>
                <div style={{ padding: "30px 10px" }}>
                    <Button type="submit" variant="contained" color="primary" onClick={handleClick}> Notificación
                    </Button>
                    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} action={action}> <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>     Mensaje de error ! </Alert>
                    </Snackbar>
                </div>
            </Grid>
        </Grid>
    );
}


export { Experiments };