import React from 'react';
import { useParams } from 'react-router-dom';
import NearbyWorkers from '../components/NearbyWorkers';

const HomePage = () => {
    const { role } = useParams();
    console.log("Role:", role);
    return (
        <div>
            <h1>Welcome to the Homepage</h1>
        
            {role === 'employer' && <NearbyWorkers />}
        </div>
    );
};

export default HomePage;