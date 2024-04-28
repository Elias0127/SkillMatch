import React, { useState, useEffect } from 'react';
import ProfileView from './ProfileView';
import SkillManagement from './SkillManagement';
import api from '../api';
import { useParams } from 'react-router-dom';
import { ACCESS_TOKEN } from "../constants";

function Dashboard() {
    const { username, role } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await api.get(`/api/${role}-profile/${username}/`, { 
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                    }
                });
                setUser({
                    ...data, 
                });
                console.log("User data:", data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                setLoading(false);
            }
        }
        fetchData();
    }, [username]);

    if (loading) {
        return <div>Loading user data...</div>;
    }

    if (!user) {
        return <div>No user data found.</div>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <ProfileView user={user} />
            {user.role === 'worker' && <SkillManagement username={username} />}
        </div>
    );
}

export default Dashboard;