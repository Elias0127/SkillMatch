import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import api from '../api';
import LoadingIndicator from '../components/LoadingIndicator';
import { ACCESS_TOKEN } from "../constants";

function JobPostForm({ onSuccess }) {

    const navigate = useNavigate();
    const { username, role } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        location: '',
        duration: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        let formErrors = {};
        if (!formData.title) formErrors.title = "Title is required";
        if (!formData.description) formErrors.description = "Description is required";
        if (!formData.budget) formErrors.budget = "Budget is required";
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        const token = localStorage.getItem(ACCESS_TOKEN);
        console.log("Using token: ", token);
        if (!token) {
            console.error('Authentication token not found');
            return;     
        }
        
    
        const jobData = {
            title: formData.title,
            description: formData.description,
            budget: formData.budget,
            location: formData.location,
            duration: formData.duration
        };
    
        try {
            setLoading(true);
            const response = await api.post('/api/job-posts/', jobData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setLoading(false);
            if (response.status === 200 || response.status === 201) {
                console.log('Job posted successfully:', response.data);
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                throw new Error('Failed to post job');
            }
        } catch (error) {
            console.error('Job post error:', error.response ? error.response.data : error);
            setErrors({ form: error.response?.data.message || "An error occurred during job posting" });
            setLoading(false);
        }
    };

    const handleJobPostFormRedirect = () => {
        navigate(`/dashboard/${username}/${role}`);
    };

    return (
        <div className="registration-container">
            <h1 className='title'>Post a Job Request</h1>
            {loading && <LoadingIndicator />}
            <form onSubmit={handleSubmit} className="form-container">
                <label htmlFor='title'>Job Title:</label>
                <input
                    className="form-input"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a Job Title"
                />
                {errors.title && <p className="error">{errors.title}</p>}
                
                <label htmlFor="description">Job Description:</label>
                <textarea
                    className="form-input"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the responsibilities"
                />
                {errors.description && <p className="error">{errors.description}</p>}


                <label htmlFor="budget">Budget:</label>
                <input
                    className="form-input"
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="Specify the salary for the job"
                />
                {errors.budget && <p className="error">{errors.budget}</p>}

                <label htmlFor="location">Location:</label>
                <input
                    className="form-input"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                />

                <label htmlFor="duration">Duration:</label>
                <input
                    className="form-input"
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Duration (e.g., 2 weeks, 3 months)"
                />

                <button type="submit" onClick={handleJobPostFormRedirect} className="link-button">Post Job</button>
            </form>
        </div>
    );
}

export default JobPostForm;