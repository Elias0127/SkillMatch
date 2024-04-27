import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method, fields }) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const updateField = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let tempErrors = {};
        fields.forEach(field => {
            if (!formData[field.name]) {
                tempErrors[field.name] = `${field.placeholder} is required`;
            }
        });
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            console.log("Submitting form data:", formData); // Debugging line to see what is sent to the backend
            console.log("Sending request to:", route);

            const res = await api.post(route, formData);
                if (res.status === 200) {
                    localStorage.setItem('access', res.data.access); 
                    localStorage.setItem('refresh', res.data.refresh);
                    console.log("Username:", formData.username);
                    console.log("User role:", res.data.role); 
                    navigate(`/dashboard/${formData.username}/${res.data.role}`);
                } else {
                    setErrors({ form: "Unexpected server response: " + res.status });
                }
            } catch (error) {
                setErrors({ form: error.response?.data?.error || "An error occurred" });
            } finally {
                setLoading(false);
            }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1 className="login-title">Sign in to your account</h1>
            {fields.map(field => (
                <input
                    key={field.name}
                    className="form-input"
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={updateField}
                    placeholder={field.placeholder}
                    aria-invalid={errors[field.name] ? "true" : "false"}
                />
            ))}
            {Object.values(errors).map((error, index) => (
                error && <p key={index} className="error">{error}</p>
            ))}
            {loading && <LoadingIndicator />}
            <button type="submit" className="form-button">
                Sign in
            </button>
        </form>
    );
}

export default Form;
