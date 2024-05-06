import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/workerhome.css';
import LoadingIndicator from '../components/LoadingIndicator';
import { ACCESS_TOKEN } from '../constants';

function WorkerHome() {
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobPosts = async () => {
            try {
                const response = await api.get('/api/job-posts/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                    }
                });
                setJobPosts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch job posts:', error);
                setError('Failed to load job posts');
                setLoading(false);
            }
        };

        fetchJobPosts();
    }, []);

    if (loading) {
        return <LoadingIndicator />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='worker-home'>
            <h1>Available Jobs</h1>
            <ul>
                {jobPosts.map(job => (
                    <li key={job.id}>
                        <h2>{job.title}</h2>
                        <p>{job.description}</p>
                        <p>Budget: {job.budget}</p>
                        <p>Location: {job.location}</p>
                        <p>Duration: {job.duration}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WorkerHome;
