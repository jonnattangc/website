import React, { useState } from 'react';
import { apiClient, authHeaders } from '../services/api';
import img_00 from '../images/00.png';
import img_01 from '../images/01.png';
import img_02 from '../images/02.png';
import img_03 from '../images/03.png';
import img_04 from '../images/04.png';
import img_05 from '../images/05.png';
import img_io from '../images/avatar.png';

const imageMap = {
  '00': img_00, '06': img_00,
  '01': img_01, '07': img_01,
  '02': img_02, '08': img_02,
  '03': img_03, '09': img_03,
  '04': img_04, '10': img_04,
  '05': img_05, '11': img_05,
};

function CardMemorize({ visible: initialVisible, name }) {
  const [visible, setVisible] = useState(initialVisible);

  const changeState = async () => {
    try {
      const dataJson = {
        card: name,
        state: visible ? 'down' : 'up',
      };
      const response = await apiClient('/page/memorize/state/save', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ data: dataJson }),
      });
      if (response.data) {
        setVisible(response.data.visible);
      }
    } catch (error) {
      console.error('Error saving card state:', error);
    }
  };

  const showImg = imageMap[name] || img_io;

  return (
    <div className="App_Card" style={{ textAlign: 'center' }} onClick={changeState}>
      <img alt="Imagen Animal" src={showImg} width="250" height="200" />
    </div>
  );
}

export { CardMemorize };
