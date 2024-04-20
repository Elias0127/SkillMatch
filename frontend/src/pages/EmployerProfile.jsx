import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import LoadingIndicator from '../components/LoadingIndicator';

function EmployerProfile() {
    const { username } = useParams();
    const [employerData, setEmployerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/employer-profile/${username}`)
            .then(response => {
                setEmployerData(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch employer data');
                setLoading(false);
                console.error(err);
            });
    }, [username]);

    if (loading) return <LoadingIndicator />;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Employer Profile: {employerData.companyName}</h1>
            <img src={employerData.logo} alt="Company Logo" />
            <p>Industry: {employerData.industry}</p>
            <p>Location: {employerData.location}</p>
            <p>Contact: {employerData.contactEmail}</p>
            <h2>Active Job Postings</h2>
            {employerData.jobPostings.map(job => (
                <div key={job.id}>
                    <h3>{job.title}</h3>
                    <p>{job.description}</p>
                    <p>Rate: ${job.rate}</p>
                </div>
            ))}
            <h2>Reviews</h2>
            {employerData.reviews.map(review => <li key={review.id}>{review.comment} - {review.rating} stars</li>)}
        </div>
    );
}

export default EmployerProfile;
