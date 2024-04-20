import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import LoadingIndicator from '../components/LoadingIndicator';

function WorkerProfile() {
    const { username } = useParams();
    const [workerData, setWorkerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/worker-profile/${username}/`)
            .then(response => {
                setWorkerData(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch worker data');
                setLoading(false);
                console.error(err);
            });
    }, [username]);

    if (loading) return <LoadingIndicator />;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Worker Profile: {workerData.name}</h1>
            <img src={workerData.profilePicture} alt="Profile" />
            {/* Render additional profile details here */}
        </div>
    );
}

export default WorkerProfile;
