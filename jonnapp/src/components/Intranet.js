import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

class Intranet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            authorized: false,
        };
        this.getAuthIntranet = this.getAuthIntranet.bind(this);
        this.getAuthIntranet();
    }
    /**
        * Obtiene las comunas de una regi'on
        * @param {*} region
        */
    async getAuthIntranet() {
        try {
            var request = await fetch(
                'https://dev.jonnattan.com/checkall', {
                method: 'GET',
            });
            var response = await request.json();

            if (request.status === 200 && response.Server === 'dev.jonnattan.com') {
                console.log('GET Response: ', response);
                this.setState({ authorized: true, loading: false, });
            }
            else {
                console.log('[405] Error: ' + request.status );
                this.setState({ loading: false, authorized: false });
            }
        }
        catch (error) {
            this.setState({ loading: false, authorized: false });
            throw Error(error);
        }
    }

    render() {
        const { loading, authorized } = this.state;
        const errorMsg = authorized ? '' : 'El ingreso al intranet es restringido'
        if (loading)
            return (<div className='App_Main' align='center' > Solicitando autorización <Spinner animation="border" variant="success" /> </div>);
        else if (authorized)
            return window.location.replace('https://dev.jonnattan.com/wp');
        else {
            return (
                <div className='App_Main' align='center' >
                    <div class="alert alert-danger" role="alert">{errorMsg}</div>
                </div>
            );
        }

    }
}

export { Intranet };