import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import '../styles/Form.css';
import "../styles/ProfileCompletion.css";
import { ACCESS_TOKEN } from "../constants";

function SkillManagement() {
    const { username } = useParams();
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState({ name: '', level: '', description: '', rate: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!newSkill.name || !newSkill.level) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            const response = await api.post(`/api/worker-skills/${username}/`, JSON.stringify({ skill: newSkill }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                }
            });
            console.log("Added Skill:", response.data);
            if (response.data) {
                setSkills(prev => [...prev, response.data]);
                setNewSkill({ name: '', level: '', description: '', rate: '' });
                setError('');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('You are not authorized. Please log in again.');
            } else {
                setError('Error adding skill: ' + (error.response ? error.response.data.message : error.message));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <p className="error">{error}</p>}
            {loading ? <p>Loading...</p> : (
                <div>
                    <h2>Manage Skills</h2>
                    {skills.map(skill => (
                        <div key={skill.id}>{skill.name} - {skill.level}</div>
                    ))}
                    <input type="text" value={newSkill.name} onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} placeholder="Skill name" />
                    <input type="text" value={newSkill.level} onChange={(e) => setNewSkill({...newSkill, level: e.target.value})} placeholder="Skill level" />
                    <input type="text" value={newSkill.description} onChange={(e) => setNewSkill({...newSkill, description: e.target.value})} placeholder="Description" />
                    <input type="text" value={newSkill.rate} onChange={(e) => setNewSkill({...newSkill, rate: e.target.value})} placeholder="Rate" />
                    <button onClick={handleSubmit}>Add Skill</button>
                </div>
            )}
        </div>
    );
}

export default SkillManagement;
