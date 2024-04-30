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

    return (
        <div className="forgot-password-container">
            <h1 className='title'>Forgot Password</h1>
            <form onSubmit={handleSubmit} className="form-container">
            </form>
        </div>
    );
}

export default ForgotPassword;
