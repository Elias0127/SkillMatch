import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';  
import { REFRESH_TOKEN } from '../constants';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            await api.post('/api/logout', { refresh_token: refreshToken });
            localStorage.removeItem(REFRESH_TOKEN);
            localStorage.removeItem('access_token');  
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

export default LogoutButton;
