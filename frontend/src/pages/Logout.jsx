import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if (!refreshToken || !accessToken) {
            console.error('Tokens are missing, unable to logout');
            return;
        }

        try {
            await api.post('/api/logout/', {
                refresh_token: refreshToken
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        } catch (error) {
            if (error.response && error.response.data.error === 'Token is blacklisted') {
                console.error('Logout failed:', error.response.data);
            } else {
                console.error('Logout failed:', error.response ? error.response.data : error);
                return; // Keep the tokens and stay on the page for other errors
            }
        }
        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem(ACCESS_TOKEN);
        navigate('/login');
    }
    return (
        <a href="#" className="menu-links" onClick={handleLogout}>
        <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" className="back-icon"><path d="M14 16l4-4m0 0l-4-4 m4 4h-11m11 5v1a2 2 0 01-2 2H6a3 3 0 01-3-3V7a3 3 0 013-3h10a2 2 0 0 12 2v1"></path></svg>
        Log out
        </a>
    );
}


export default LogoutButton;
