import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import api from '../api';
import '../styles/Form.css';
import "../styles/ProfileCompletion.css";
import { ACCESS_TOKEN } from "../constants";
import '../styles/dashboard.css';


function SkillManagement() {
    const { username } = useParams();
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState({ name: '', level: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSkills();
    }, [username]);

    const fetchSkills = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/api/worker-skills/${username}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                }
            });
            setSkills(response.data); // Assuming response.data is the array of skills
        } catch (error) {
            setError('Failed to fetch skills');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = async () => {
        if (!newSkill.name || !newSkill.level || !newSkill.description) {
            setError('Please fill in all fields');
            return;
        }
        try {
            const response = await api.post(`/api/worker-skills/${username}/`, { skill: newSkill }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                }
            });
            if (response.data) {
                setSkills(prev => [...prev, response.data]);
                setNewSkill({ name: '', level: '', description: '' }); // Reset form
            }
        } catch (error) {
            setError('Error adding skill: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleDeleteSkill = async (skillId) => {
        try {
            await api.delete(`/api/worker-skills/${username}/${skillId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                }
            });
            setSkills(skills.filter(skill => skill.id !== skillId));
        } catch (error) {
            setError('Failed to delete skill');
        }
    };

    const handleUpdateSkill = async (skillId, updatedSkill) => {
        try {
            const response = await api.put(`/api/worker-skills/${username}/${skillId}/`, { skill: updatedSkill }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                }
            });
            setSkills(skills.map(skill => skill.id === skillId ? { ...skill, skill: response.data.skill } : skill));
        } catch (error) {
            setError('Failed to update skill');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="skills-container">
            {error && <p className="error">{error}</p>}
            <h2>Manage Skills</h2>
            {skills.map(skill => (
                <div className="skill-item" key={skill.id}>
                    {skill.skill.name} - {skill.skill.level}
                    <div className="skill-actions">
                        <button className='skill-button' onClick={() => handleDeleteSkill(skill.id)}>Delete</button>
                        <button className='skill-button'  onClick={() => handleUpdateSkill(skill.id, { ...skill.skill, level: 'Beginner' })}>Update Level</button>
                    </div>
                </div>
            ))}
            <div className="skill-form">
                <input className='skill-fields' type="text" value={newSkill.name} onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} placeholder="Skill name" />
                <input className='skill-fields' type="text" value={newSkill.level} onChange={(e) => setNewSkill({...newSkill, level: e.target.value})} placeholder="Skill level" />
                <input className='skill-fields' type="text" value={newSkill.description} onChange={(e) => setNewSkill({...newSkill, description: e.target.value})} placeholder="Description" />
                <button className='skill-button' onClick={handleAddSkill}>Add Skill</button>
            </div>
        </div>

    );
}

export default SkillManagement;
