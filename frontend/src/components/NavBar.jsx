import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Home.css";

function NavBar() {
    const [isOpaque, setIsOpaque] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 100) {
                setIsOpaque(true);
            } else {
                setIsOpaque(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`header ${isOpaque ? '' : 'transparent-header'}`}>
            <nav className="nav-bar">
                <div className="left-section">
                    <Link to="/Home" className="nav-item logo">SkillMatch</Link>
                    <Link to="/about" className="nav-item">About</Link>
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
