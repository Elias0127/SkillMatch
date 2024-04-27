import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        try {
            await api.post('/api/logout/', {
                refresh_token: refreshToken
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            localStorage.removeItem(REFRESH_TOKEN);
            localStorage.removeItem(ACCESS_TOKEN);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error.response ? error.response.data : error);
        }
    };

    return (
        <button className='logout-button' onClick={handleLogout}>Logout</button>
    );
}

export default LogoutButton;
