import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../api";
import LoadingIndicator from '../components/LoadingIndicator';

function EmployerProfileCompletion() {
    const { username } = useParams();
    const [formData, setFormData] = useState({
        companyInfo: '',
        sectors: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const updateField = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.companyInfo) tempErrors.companyInfo = "Company information is required";
        if (!formData.sectors) tempErrors.sectors = "Sectors is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            // Update employer profile API call
            const res = await api.post(`/api/employer/${username}/profile/`, formData);
            navigate(`/dashboard/${username}`);  // Redirect to the employer's dashboard
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
                    name="companyInfo"
                    value={formData.companyInfo}
                    onChange={updateField}
                    placeholder="Company Information"
                />
                <input
                    type="text"
                    name="sectors"
                    value={formData.sectors}
                    onChange={updateField}
                    placeholder="Sectors of Interest"
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

export default EmployerProfileCompletion;
