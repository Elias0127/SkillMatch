import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../api";
import LoadingIndicator from '../components/LoadingIndicator';

function WorkerProfileCompletion() {
    const { username } = useParams();
    const [formData, setFormData] = useState({
        skills: '',
        rate: '',
        availableTime: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const updateField = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let tempErrors = {};
        // Add validations as required for each field
        if (!formData.skills) tempErrors.skills = "Skills are required";
        if (!formData.rate) tempErrors.rate = "Rate is required";
        if (!formData.availableTime) tempErrors.availableTime = "Available time is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            // Update worker profile API call
            const res = await api.post(`/api/worker/${username}/profile/`, formData);
            navigate(`/dashboard/${username}`);  // Redirect to the worker's dashboard
        } catch (error) {
            setErrors({ form: error.response?.data.message || "An error occurred" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-completion-container">
            <form onSubmit={handleSubmit}>
                <h1>Complete Your Profile</h1>
                <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={updateField}
                    placeholder="Skills"
                />
                <input
                    type="text"
                    name="rate"
                    value={formData.rate}
                    onChange={updateField}
                    placeholder="Rate"
                />
                <input
                    type="text"
                    name="availableTime"
                    value={formData.availableTime}
                    onChange={updateField}
                    placeholder="Available Time"
                />
                {Object.values(errors).map((error, index) => (
                    error && <p key={index} className="error">{error}</p>
                ))}
                {loading && <LoadingIndicator />}
                <button type="submit">Complete Profile</button>
            </form>
        </div>
    );
}

export default WorkerProfileCompletion;
