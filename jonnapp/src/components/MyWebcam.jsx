import React, { useState } from 'react';
import Webcam from 'react-webcam';
import { Grid, CircularProgress, Alert, Button, Paper, Stack } from '@mui/material';
import { apiClient, authHeaders } from '../services/api';

function MyWebcam() {
  const [dataBase64, setDataBase64] = useState(null);
  const [nameFile, setNameFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [urlImage, setUrlImage] = useState(null);
  const [msg, setMsg] = useState(null);

  const setImage = (dataImage, base64, name) => {
    setLoading(true);
    if (dataImage == null) {
      setDataBase64(base64);
      setNameFile(name);
      setLoading(false);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setDataBase64(reader.result);
        setNameFile(name);
        setLoading(false);
      };
      reader.readAsDataURL(dataImage);
    }
  };

  const uploadImage = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const dataTx = {
        data: dataBase64,
        name: nameFile,
      };
      const response = await apiClient('/page/aws/file/upload', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(dataTx),
      });
      if (response.data) {
        console.log('[200]: ' + response.data.code + ' ' + response.data.url);
        setLoading(false);
        setMsg(response.message);
        setUrlImage(response.data.url);
      } else {
        setLoading(false);
        setMsg('Error en subida');
        setUrlImage(null);
      }
    } catch (error) {
      setLoading(false);
      setMsg(error.message || 'Error');
      setUrlImage(null);
      console.error('Upload error:', error);
    }
  };

  const typeMsg = urlImage == null ? 'error' : 'success';
  const message = msg ? msg : 'La Url de la imagen es ' + urlImage;

  return (
    <div style={{ padding: '30px', textAlign: 'center', border: 'none' }}>
      <Stack spacing={1}>
        <Grid container columnSpacing={2}>
          <Grid item xs={6}>
            <WebcamImage setImage={setImage} />
          </Grid>
          <Grid item xs={6}>
            <PhotoView image={dataBase64} uploadImage={uploadImage} loading={loading} />
          </Grid>
          <Grid item xs={6}>
            <FileUpload setImage={setImage} />
          </Grid>
          <Grid item xs={6}>
            {loading && (
              <div style={{ textAlign: 'left' }}>
                <CircularProgress color="success" size="50px" />
              </div>
            )}
            {msg && <Alert severity={typeMsg}>{message}</Alert>}
          </Grid>
        </Grid>
      </Stack>
    </div>
  );
}

function WebcamImage({ setImage }) {
  const videoConstraints = { width: 390, height: 390, facingMode: 'user' };

  return (
    <Paper elevation={4}>
      <Stack spacing={2}>
        <div style={{ padding: '15px 0px 0px 0px', textAlign: 'center' }}>
          <Webcam
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
            audio={false}
            height={300}
            width={300}
            mirrored={true}
          >
            {({ getScreenshot }) => (
              <div style={{ padding: '0px 10px 10px 0px', textAlign: 'center' }}>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const data64 = getScreenshot({ width: 500, height: 600 });
                    setImage(null, data64, 'pic.png');
                  }}
                >
                  Tomar Fotografía
                </Button>
              </div>
            )}
          </Webcam>
        </div>
      </Stack>
    </Paper>
  );
}

function FileUpload({ setImage }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileView = () => {
    if (file) {
      setImage(file, null, file.name);
    }
  };

  return (
    <div style={{ padding: '20px 0px 0px 0px', textAlign: 'center' }}>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <Button type="button" variant="contained" color="primary" onClick={handleFileView}>
        Cargar Fotografia
      </Button>
    </div>
  );
}

function PhotoView({ image, uploadImage, loading }) {
  return (
    <Paper elevation={2}>
      <div style={{ padding: '15px 0px 0px 0px', border: 'none', height: '365px', width: '300px', textAlign: 'center' }}>
        {image && (
          <div>
            <img src={image} alt="screenshot" width="300px" height="300px" style={{ objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ padding: '0px 10px 10px 0px', textAlign: 'center' }}>
          <Button type="button" variant="contained" disabled={image == null || loading} color="primary" onClick={uploadImage}>
            Subir Fotografia
          </Button>
        </div>
      </div>
    </Paper>
  );
}

export { MyWebcam };
