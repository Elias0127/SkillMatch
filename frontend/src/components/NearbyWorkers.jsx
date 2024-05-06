import React, { useState, useEffect } from 'react';
import api from '../api'; // Assuming this is correctly set up for API requests
import { usePosition } from '../hooks/usePosition';
import { ACCESS_TOKEN } from "../constants";

const NearbyWorkers = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { latitude, longitude, error: locError } = usePosition();
    const radius = 200; // Radius in kilometers

    useEffect(() => {
        if (latitude && longitude) {
            fetchNearbyWorkers(latitude, longitude, radius);
        }
    }, [latitude, longitude]);

    const fetchNearbyWorkers = async (lat, lng, rad) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/nearby-workers/?latitude=${lat}&longitude=${lng}&radius=${rad}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                }
            });
            console.log('Nearby workers:', response.data);
            if (response.data.length === 0) {
                setError('No nearby workers found.');
            } else {
                setWorkers(response.data.map(worker => ({
                    ...worker,
                    distance: (worker.distance * 0.621371).toFixed(2) // Convert km to miles and round to two decimal places
                })));
            }
        } catch (error) {
            console.error('Error fetching nearby workers:', error);
            setError('Failed to fetch nearby workers. ' + (error.response ? error.response.data.message : error.message));
        } finally {
            setLoading(false);
        }
    };

    if (locError) return <div>Error: {locError}</div>;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Nearby Workers</h2>
            {workers.length > 0 ? (
                <ul>
                    {workers.map(worker => (
                        <li key={worker.id}>
                            <img src={worker.picture} alt={`${worker.first_name} ${worker.last_name}`} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                            <div>
                                <strong>{worker.first_name} {worker.last_name}</strong>
                                <div>{worker.distance} miles away</div>
                                <div>Email: {worker.email}</div>
                                <div>Phone: {worker.phone_number}</div>
                                <div>Rate: {worker.rate ? `$${worker.rate} per hour` : 'Negotiable'}</div>
                                <div>Available Time: {worker.available_time || 'Not specified'}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : <p>No workers found within the radius.</p>}
        </div>
    );
};

export default NearbyWorkers;
