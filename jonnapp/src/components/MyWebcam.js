import React from "react"
import Webcam from "react-webcam"
import { Grid, CircularProgress,  Alert, Button, Paper, Stack } from '@mui/material'

import env from 'react-dotenv'
//import HCaptcha from '@hcaptcha/react-hcaptcha'

class MyWebcam extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataBase64: null,
      nameFile: null,
      loading: false,
      urlImage: null,
      msg: null
    };
  }

  setImage = async (dataImage, dataBase64, nameFile) => {
    
    this.setState({ loading: true })
    if (dataImage == null ) {
      this.setState({ dataBase64: dataBase64, nameFile: nameFile })
    }

    if( dataBase64 == null ) {
      const reader = new FileReader();
      reader.onload = async () => {
        dataBase64 = reader.result
        this.setState({ dataBase64: dataBase64, nameFile: nameFile })
      }
      await reader.readAsDataURL(dataImage)
    }
    this.setState({ loading: false })
  }

  uploadImage = async () => {
    this.setState({ loading: true, msg: null })
    try {
      let dataTx = {
         'data': this.state.dataBase64,
         'name': this.state.nameFile
      }
      var request = await fetch(
        env.API_BASE_URL +'/page/aws/file/upload', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': 'dev.jonnattan.com',
          'Authorization': 'Basic ' + env.AUTH_JONNA_SERVER,
          'Content-Type': 'application/json;charset=UTF-8',
          'Accept': 'application/json',
        },
        body: JSON.stringify(dataTx)
      });

      if (request.status === 200) {
        let response = await request.json();
        this.setState({ loading: false, msg: response.msg, urlImage: response.url })
      }
      else {
        console.log('[409]: ' + request.error);
        this.setState({ loading: false, msg: request.error, urlImage: null })
      }
    }
    catch (error) {
      this.setState({ loading: false, msg: error, urlImage: null })
      throw Error(error)
    }
  }

  render() {
    const { dataBase64, loading, msg, urlImage } = this.state 
    const typeMsg = urlImage == null ? "danger" : "success"
    const message = msg ? msg : 'La Url de la imagen es ' + urlImage
    return (
      <div style={{ padding: "30px 30px 30px 30px", border: "none" }} align="center" >
        <Stack spacing={1}>
          <Grid container columnSpacing={2} >
            <Grid item xs={6}>
              <WebcamImage setImage={this.setImage} />
            </Grid>
            <Grid item xs={6} >
              <PhotoView image={dataBase64} uploadImage={ this.uploadImage } loading={loading} />
            </Grid>
            <Grid item xs={6} >
              <FileUpload setImage={this.setImage} />
            </Grid>
            <Grid item xs={6} >
            {
              loading ?
              <div align="left">
                <CircularProgress color="success" size="50px" />
              </div>
              : null
            } 
            {
              msg ? <Alert severity={typeMsg}>{message}</Alert> : null
            }
            </Grid>
          </Grid>
        </Stack>
      </div>
    );
  }
}

class WebcamImage extends React.Component {
  render() {
    const videoConstraints = { width: 390, height: 390, facingMode: "user", }
    return (
      <Paper elevation={4}>
        {
          <Stack spacing={2}>
            <div style={{ padding: "15px 0px 0px 0px" }} align="center" >
              <Webcam screenshotFormat="image/png" videoConstraints={videoConstraints}
                audio={false} height={300} width={300} mirrored={true} >
                {
                  ({ getScreenshot }) => (
                    <div style={{ padding: "0px 10px 10px 0px" }} align="center" >
                      <Button type="submit" variant="contained" color="primary" onClick={() => {
                        const data64 = getScreenshot({ width: 500, height: 600 })
                        this.props.setImage(null, data64, 'pic.png')
                      }} >Tomar Fotografía</Button>
                    </div>
                  )
                }
              </Webcam>
            </div>
          </Stack>
        }
      </Paper>
    );
  }
}

class FileUpload extends React.Component {

  constructor(props) {
    super(props)
    this.state = ({
      file: null
    })
  }

  handleFileChange = async ( e ) => {
    if (e.target.files) 
      this.setState({ file: e.target.files[0] })
  }

  handleFileView = async () => {
    let file = this.state.file
    this.props.setImage(file, null, file.name )
  }

  render() {
    return (
      <div style={{ padding: "20px 0px 0px 0px" }} align="center" >
        <input type="file" onChange={this.handleFileChange} />
        <Button type="submit" variant="contained" color="primary" onClick={this.handleFileView} >
          Cargar Fotografia
        </Button>
      </div>
    );
  }
}

class PhotoView extends React.Component {
  loadSolicitude = async () => {
    this.props.uploadImage()
  }

  render() {
    return (
      <Paper elevation={2}>
        <div style={{ padding: "15px 0px 0px 0px", border: "none", height:"365px", width:"300px" }} align="center" >
          {
            this.props.image != null ?
              <div>
                <img src={this.props.image} alt="screenshot" width="300px" height="300px" />
              </div>
              : null
          }
          <div style={{ padding: "0px 10px 10px 0px" }} align="center" >
                <Button type="submit" variant="contained" disabled={this.props.image == null} color="primary" onClick={this.loadSolicitude} >
                  Subir Fotografia
                </Button>
            </div>
        </div>
      </Paper>
    );
  }
}

export { MyWebcam };
