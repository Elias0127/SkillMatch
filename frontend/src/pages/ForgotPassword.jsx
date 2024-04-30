import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/Form.css';
import LoadingIndicator from '../components/LoadingIndicator';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/api/forgot-password/', { email });
            setMessage(response.data.message);
            setLoading(false);
            setTimeout(() => navigate('/login'), 5000);
        } catch (error) {
            setMessage('Failed to send reset email.');
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <h1 className='title'>Forgot Password</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <input
                    className="form-input"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <button type="submit" className="form-button">Send Reset Email</button>
                {loading && <LoadingIndicator />}
                {message && <p className="text-center">{message}</p>}
            </form>
        </div>
    );
}

export default ForgotPassword;
