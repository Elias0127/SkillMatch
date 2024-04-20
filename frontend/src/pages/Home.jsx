import React from 'react';
import Logout from './Logout'; 
function Home() {
    return (
        <div>
            <h1>Welcome to the Local Services Market</h1>
            <p>This is your dashboard where you can manage your services or requests.</p>
            <Logout />
        </div>
    );
}

export default Home;
