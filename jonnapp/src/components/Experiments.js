import React from 'react';
import { Button, Stack, Paper } from '@mui/material';
import { Dashboard } from './Dashboard'

class Experiments extends React.Component {
    render() {
        console.info('Experiments... ' + window.location.pathname);
        return (
            <div className='App_Main' align='center' >
                <Stack spacing={3}>
                    <Paper elevation={8}> <LinkOther /> </Paper>
                    <Paper elevation={8}> <MouseMoveExample /> </Paper>
                    <Paper elevation={8}> <MyImagenToS3 /> </Paper>
                    <Paper elevation={8}> <Dashboard /> </Paper>
                </Stack>
            </div>
        )
    }
}


export class MyImagenToS3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = { size: 0, type: null, data: null, name: null };
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
        const { data, name } = this.state;
        return (
            <div className='App_Card' align='center' >
                <input type="file" id="file" name="files" accept="image/*" />
                <Button type="submit" variant="contained" color="primary" onClick={this.handleClick} >
                    Enviar
                </Button>
                {
                    data !== null ? <img alt="Imagen Producto" src={data} title={name} /> : null
                }
            </div>
        )
    }
}


export class MouseMoveExample extends React.Component {
    state = { x: 0, y: 0 }
    moveMouse = (e) => {
        const { clientX, clientY } = e;
        this.setState({ x: clientX, y: clientY });
    }

    render() {
        return (
            <div className='App_Card' align='center'
                onMouseMove={this.moveMouse} >
                Caja de prueba de pocisión Mouse:  X {this.state.x} Y {this.state.y}
            </div>
        );
    }
}


export class LinkOther extends React.Component {
    render() {
        return (
            <div className='App_Card' align='center' >
                <a href='https://dev.jonnattan.com/ccu/15173808-7' target='_blank' rel='noreferrer'>
                    <div className='App_Menu' align='center'>
              Otros test
            </div>
          </a>
            </div>
        );
    }
}


export { Experiments };