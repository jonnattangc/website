import React, { useState } from 'react';
import { Grid, Alert, CircularProgress, Button, TextareaAutosize } from '@mui/material';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { apiClient, authHeaders } from '../services/api';
import { env } from '../config/clientEnv';

function Chat() {
  const [errorCode, setErrorCode] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [messageTx, setMessageTx] = useState('');
  const [messageRx, setMessageRx] = useState('');

  const handleVerificationSuccess = async (token, ekey) => {
    try {
      await validateCaptcha(token, ekey);
    } catch (error) {
      console.error('Captcha verification failed:', error);
    }
  };

  const validateCaptcha = async (token, ekey) => {
    try {
      const dataCaptcha = { token, sitekey: env.HCAPTCHA_SITE_KEY };
      const response = await apiClient('/page/hcaptcha', {
        method: 'POST',
        body: JSON.stringify({ data: dataCaptcha }),
        headers: authHeaders(),
      });
      if (response.data) {
        setCaptcha(response.data.success);
      } else {
        setCaptcha(false);
      }
    } catch (error) {
      console.error('Captcha validation error:', error);
      setCaptcha(false);
    }
  };

  const sentMessage = async () => {
    console.log('Message: [' + messageTx + ']');
    try {
      setProcessing(true);
      setErrorCode(0);
      setErrorMessage('');
      const data = { mesagge: messageTx };
      const response = await apiClient('/waza/message', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: authHeaders(),
      });
      if (response.success) {
        setProcessing(false);
        setErrorCode(0);
        setErrorMessage('');
        setMessageRx(response.result);
        setCaptcha(true);
      } else {
        setProcessing(false);
        setErrorCode(-1);
        setErrorMessage(response.result);
        setCaptcha(true);
        setMessageRx('');
      }
    } catch (error) {
      setProcessing(false);
      setErrorCode(-1);
      setErrorMessage(error.message || 'Error');
      setCaptcha(true);
      setMessageRx('');
      console.error('Send message error:', error);
    }
  };

  const msgType = errorCode !== 0 ? 'error' : 'success';

  return (
    <div className="App_Main">
      <div style={{ padding: '10px', border: 'none' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={3}
              placeholder="Minimum 3 rows"
              style={{ width: 500 }}
              value={messageTx}
              onChange={(e) => setMessageTx(e.target.value)}
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
            <div style={{ display: 'contents', padding: '10px', textAlign: 'right' }}>
              <Button type="button" variant="contained" color="success" disabled={!captcha} onClick={sentMessage}>
                Enviar Chat
              </Button>
            </div>
          </Grid>
          <Grid item xs={10}>
            {processing && (
              <div style={{ textAlign: 'left' }}>
                <CircularProgress color="success" size="20px" />
              </div>
            )}
          </Grid>
        </Grid>
      </div>

      <div>
        <HCaptcha sitekey={env.HCAPTCHA_SITE_KEY} onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)} />
      </div>
      <div>
        {errorCode !== 0 && <Alert severity={msgType}>{errorMessage}</Alert>}
      </div>
    </div>
  );
}

export { Chat };
