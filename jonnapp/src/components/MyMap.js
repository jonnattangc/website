import React, { useState } from 'react';
import { Paper, Stack } from '@mui/material';
import { CLCommunes } from './CLCommunes';
import { MapOpenStreet } from './MapOpenStreet';

function MyMap() {
  const [detail, setDetail] = useState('');
  const [title, setTitle] = useState('Resultado');
  const [point, setPoint] = useState([-33.01604584903938, -71.54956691862895]);
  const [zoom, setZoom] = useState(17);

  const onMoveMap = (newPoint, newTitle, description) => {
    console.log("##### onMoveMap: ", description);
    setDetail(description);
    setTitle(newTitle);
    setPoint(newPoint);
    setZoom(9);
  };

  return (
    <div className="App_Main" style={{ textAlign: 'center' }}>
      <Stack spacing={1}>
        <Paper elevation={5}>
          <MapOpenStreet title={title} detail={detail} center={point} point={point} zoom={zoom} />
        </Paper>
        <Paper elevation={5}>
          <CLCommunes disabled={false} mapfunc={onMoveMap} />
        </Paper>
      </Stack>
    </div>
  );
}

export { MyMap };
