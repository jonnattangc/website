import React from 'react';
import { EnrollChart } from './EnrollChart'

class Dashboard extends React.Component {
    render() {
        return (
        <div className='App_Main'>
            <EnrollChart />
        </div>
        );
    }
}

export { Dashboard };
