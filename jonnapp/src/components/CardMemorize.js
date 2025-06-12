import React from 'react';
import env from 'react-dotenv'
import img_00 from './../images/00.png'
import img_01 from './../images/01.png'
import img_02 from './../images/02.png'
import img_03 from './../images/03.png'
import img_04 from './../images/04.png'
import img_05 from './../images/05.png'
import img_io from './../images/avatar.png'


class CardMemorize extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible,
            name: this.props.name
        };
    }

    changeState = async () => {
        try {
            let dataJson = {
                card: this.state.name,
                state: this.state.visible ? 'down' : 'up'
            }
            var request = await fetch(
                env.API_BASE_URL + '/page/memorize/state/save', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Accept': 'application/json',
                    'Authorization': 'Basic ' + env.AUTH_JONNA_SERVER,
                    'x-api-key': env.PAGE_API_KEY
                },
                body: JSON.stringify( { 'data': dataJson } )
            });
            console.log('POST request: ', request );
            var response = await request.json();
            if (request.status === 200) {
                console.log('POST response: ', response);
                this.setState({ visible: response.data.visible });
            }
            else {
                console.log('[405]: ' + request.error);
                this.setState({ visible: this.state.visible });
            }
        }
        catch (error) {
            throw Error(error);
        }
    }

    render() {
        const { visible, name } = this.state;
        let show_img = img_io
        if (name === '00' || name === '06')
            show_img = visible ? img_00 : img_io
        else if (name === '01' || name === '07')
            show_img = visible ? img_01 : img_io
        else if (name === '02' || name === '08')
            show_img = visible ? img_02 : img_io
        else if (name === '03' || name === '09')
            show_img = visible ? img_03 : img_io
        else if (name === '04' || name === '10')
            show_img = visible ? img_04 : img_io
        else if (name === '05' || name === '11')
            show_img = visible ? img_05 : img_io
        else
            show_img = img_io;

        console.info('Imagen: ' + name + ' Visible: ' + visible)
        console.info('Imagen: ', show_img)

        return (
            <div className='App_Card' align='center' onClick={this.changeState} >
                <img alt="Imagen Animal" src={show_img} width="250" height="200" />
            </div>
        )
    }
}

export { CardMemorize };