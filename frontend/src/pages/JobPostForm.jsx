import React, { useState, useEffect } from 'react';
import api from '../api';
import LoadingIndicator from '../components/LoadingIndicator';

function JobPostForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skills: [],
        budget: '',
        location: '',
        duration: ''
    });
    const [allSkills, setAllSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/skills/');
                setAllSkills(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch skills:', error);
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSkillChange = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, skills: value });
    };

    const validateForm = () => {
        let formErrors = {};
        if (!formData.title) formErrors.title = "Title is required";
        if (!formData.description) formErrors.description = "Description is required";
        if (formData.skills.length === 0) formErrors.skills = "At least one skill is required";
        if (!formData.budget) formErrors.budget = "Budget is required";
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            const response = await api.post('/api/job-posts/', formData);
            setLoading(false);
            onSuccess();  
        } catch (error) {
            console.error('Registration error:', error.response ? error.response.data : error);
            setErrors({ form: error.response?.data.message || "An error occurred" });
            setLoading(false);
        }
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

                <label htmlFor="skills">Required Skills:</label>
                <input
                    className="form-input"
                    name="skills"
                    id="skills"
                    value={formData.skills}
                    onChange={handleSkillChange}
                    placeholder="List required skills"
                />
                {errors.skills && <p className="error">{errors.skills}</p>}

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

                <button type="submit" className="form-button">Post Job</button>
            </form>
        </div>
    );
}

export default JobPostForm;