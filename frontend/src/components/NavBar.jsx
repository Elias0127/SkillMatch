import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Home.css";

function NavBar() {
    return (
        <div className="header">
            <nav className="nav-bar">
                <div className="left-section">
                    <Link to="/Home" className="nav-item logo">SkillMatch</Link>
                    <Link to="/about" className="nav-item">About</Link>
                    <Link to="/discover" className="nav-item">Discover</Link>
                    <Link to="/review" className="nav-item">Review</Link>
                </div>
                <div className="right-section">
                    <div className="auth-buttons">
                        <Link to="/login" className="nav-button">Log In</Link>
                        <Link to="/register" className="nav-button sign-up">Sign Up</Link>
                    </div>
                </div>
            </nav>
        </div>
    
    );
}

export default NavBar;
