import * as React from 'react'
//import env from 'react-dotenv'
//import HCaptcha from '@hcaptcha/react-hcaptcha'
//import { DataGrid } from '@mui/x-data-grid'
import Webcam from 'react-webcam'

class MyWebcam extends React.Component {
    render() {
        console.log('WebCam')
        const videoConstraints = {
            facingMode: "user",
            width: { min: 480 },
            height: { min: 720 },
            aspectRatio: 0.6666666667
          };

        return <Webcam videoConstraints={videoConstraints} />;
    }
}

export { MyWebcam };