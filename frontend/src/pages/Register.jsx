import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Form.css";
import LoadingIndicator from "../components/LoadingIndicator";

function RegistrationForm() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "worker",  // Default role
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const updateField = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.username) tempErrors.username = "Username is required";
        if (!formData.password) tempErrors.password = "Password is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const res = await api.post("/api/register/", formData);
            navigate(`/${formData.role}-profile/${formData.username}/complete`);
        } catch (error) {
            setErrors({ form: error.response?.data.message || "An error occurred" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registration-container">
            <form onSubmit={handleSubmit} className="form-container">
                <h1>Register</h1>
                <input
                    className="form-input"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={updateField}
                    placeholder="Username"
                />
                <input
                    className="form-input"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={updateField}
                    placeholder="Password"
                />
                <select
                    name="role"
                    value={formData.role}
                    onChange={updateField}
                    className="form-input"
                >
                    <option value="worker">Worker</option>
                    <option value="employer">Employer</option>
                </select>
                {Object.values(errors).map((error, index) => (
                    error && <p key={index} className="error">{error}</p>
                ))}
                {loading && <LoadingIndicator />}
                <button type="submit" className="form-button">Register</button>
            </form>
        </div>
    );
}

export default RegistrationForm;
