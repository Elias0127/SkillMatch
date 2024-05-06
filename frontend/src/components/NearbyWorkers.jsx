import React, { useState, useEffect } from 'react';
import api from '../api';
import { usePosition } from '../hooks/usePosition';
import { ACCESS_TOKEN } from "../constants";
import '../styles/NearbyWorkers.css';

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
            const workersWithSkills = await Promise.all(response.data.map(async worker => {
                const skillsResponse = await fetchSkills(worker.username);
                return {
                    ...worker,
                    distance: (worker.distance * 0.621371).toFixed(2), // Convert km to miles
                    skills: skillsResponse
                };
            }));
            setWorkers(workersWithSkills);
        } catch (error) {
            setError('Failed to fetch nearby workers. ' + (error.response ? error.response.data.message : error.message));
        } finally {
            setLoading(false);
        }
    };

    const fetchSkills = async (username) => {
        // console.log("Fetching skills for worker", username);
        try {
            const response = await api.get(`/api/worker-skills/${username}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                }
            });
            // console.log("Skills for worker", username, ":", response.data);
            return response.data;  // Returns the array of skills
        } catch (error) {
            console.error('Error fetching skills:', error);
            return [];  // Return empty array on failure
        }
    };

        // Function to handle hiring a worker
    const handleHireWorker = async (workerId) => {
        console.log("Attempting to hire worker with ID:", workerId);
        try {
            const response = await api.post('/api/create-contract/', {
                worker_profile_id: workerId,
                // You can add more details as needed
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                }
            });
            console.log('Contract created:', response.data);
            alert(`Contract created successfully! Contract ID: ${response.data.contract.id}`);
        } catch (error) {
            console.error('Failed to hire worker:', error);
            alert('Failed to create contract.')
        }
    };


    if (locError) return <div className="error">Error: {locError}</div>;
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    console.log("Workers data:", workers);
    return (
        <div className="nearby-workers-container">
            <h2>Nearby Workers</h2>
            {workers.length > 0 ? (
                <div className="workers-list">
                    {workers.map(worker => (
                        <div key={worker.id} className="worker-card">
                            <div className="worker-card-inner">
                                <div className="worker-card-front">
                                    <img src={worker.picture} alt={`${worker.first_name} ${worker.last_name}`} className="worker-image" />
                                    <div className="worker-info">
                                        <h3>{worker.first_name} {worker.last_name}</h3>
                                        <p>{worker.distance} miles away</p>
                                        <p>Email: {worker.email}</p>
                                        <p>Phone: {worker.phone_number}</p>
                                        <p>Rate: {worker.rate ? `$${worker.rate} per hour` : 'Negotiable'}</p>
                                        <p>Available Time: {worker.available_time || 'Not specified'}</p>
                                        <div className="skills-list">
                                            <h4>Skills:</h4>
                                            {worker.skills.map(skill => (
                                                <div key={skill.id} className="skill">
                                                    <strong>{skill.skill.name}</strong> - <span className="skill-level">{skill.skill.level}</span>
                                                    <p className="skill-description">{skill.skill.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="worker-card-back">
                                    <button className="button-hire" onClick={() => handleHireWorker(worker.id)}>Hire</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No workers found within the radius.</p>
            )}
        </div>

    );
};

export default NearbyWorkers;