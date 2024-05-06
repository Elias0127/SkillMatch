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

    const handleApply = async (jobId) => {
        try {
            const response = await api.post(`/api/apply/${jobId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                }
            });
            if (response.status === 200 || response.status === 201) {
                alert('Application submitted successfully!');
            }
        } catch (error) {
            console.error('Failed to apply for job:', error);
            alert('Failed to submit application.');
        }
    };

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
                        <button onClick={() => handleApply(job.id)}>Apply</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WorkerHome;
