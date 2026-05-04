import * as React from 'react';
import { Grid, Alert, CircularProgress, Button, TextareaAutosize } from '@mui/material';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import env from 'react-dotenv';

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorCode: 0,
            errorMessage: '',
            processing: false,
            captcha: false,
            messageTx: '',
            messageRx: ''
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

    async validateCapcha(token, ekey) {
        try {
            console.log('HCaptcha token: ', token);
            console.log('HCaptcha ekey: ', ekey);

            let data_captcha = {
                token: token,
                secret: env.HCAPTCHA_SECRET,
                sitekey: env.HCAPTCHA_SITE_KEY
            }

            var request = await fetch(
                env.API_BASE_URL + '/page/hcaptcha', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({ 'data': data_captcha }),
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

    /**
       * Valida la otp
       */
    sentMessage = async () => {
        const { messageTx } = this.state;
        console.log('Message: [' + messageTx + ']');
        try {
            this.setState({ processing: true, errorCode: 0, errorMessage: '' });
            let data = {
                mesagge: messageTx,
            }
            var request = await fetch(
                env.API_BASE_URL + '/waza/message', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(data),
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
                if (response.success)
                    this.setState({ processing: false, errorCode: 0, errorMessage: '', messageRx: response.result, captcha: true });
                else
                    this.setState({ processing: false, errorCode: -1, errorMessage: response.result, captcha: true, messageRx: "" });
            }
            else {
                console.log('Código Error: ' + response.statusCode);
                this.setState({ processing: false, errorCode: request.status, errorMessage: request.statusDescription, captcha: true, messageRx: "" });
            }
        }
        catch (error) {
            this.setState({ processing: false, errorCode: -1, errorMessage: error.message, captcha: true, messageRx: "" });
            throw Error(error);
        }
    }

    render() {
        const { errorCode, errorMessage, captcha, processing, messageTx, messageRx } = this.state;
        const msgType = errorCode !== 0 ? "error" : "success"
        return (
            <div className='App_Main'>
                <div style={{ padding: "10px", border: "none" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextareaAutosize
                                aria-label="minimum height"
                                minRows={3}
                                placeholder="Minimum 3 rows"
                                style={{ width: 500 }}
                                value={messageTx} 
                                onChange={(e) => this.setState({ messageTx: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextareaAutosize
                                aria-label="minimum height"
                                minRows={3}
                                readOnly
                                placeholder="Minimum 3 rows"
                                style={{ width: 500 }}
                                value={messageRx}
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <div align="right" style={{ display: "contents", padding: "10px 10px 10px 10px", border: "none" }}>
                                <Button type="submit" variant="contained" color="success" disabled={!captcha} onClick={this.sentMessage}>Enviar Chat</Button>
                            </div>
                        </Grid>
                        <Grid item xs={10}>
                            {
                                processing ?
                                    <div align="left">
                                        <CircularProgress color="success" size="20px" />
                                    </div>
                                    : null
                            }
                        </Grid>
                    </Grid>
                </div>


                <div>
                    <HCaptcha sitekey={env.HCAPTCHA_SITE_KEY} onVerify={(token, ekey) => this.handleVerificationSuccess(token, ekey)} />
                </div>
                <div>
                    {
                        errorCode !== 0 ?
                            <Alert severity={msgType}> {errorMessage} </Alert>
                            : null
                    }
                </div>
            </div>

        );
    }
}

export { Chat };