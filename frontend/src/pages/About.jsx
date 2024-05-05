import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/About.css";
import NavBar from '../components/NavBar';
import aboutImage from "../assets/aboutwallpaper.png.jpg"

function About() {
    return (
        <div className='about-container'>
            <NavBar></NavBar>
            <div className='about-hero'>
                <h1>About Us</h1>
            </div>
            <div className='about-info'>
                <div className='about-image'>
                    <img src={aboutImage} alt='main-image' />
                </div>
                <div className='about-content'>
                    <h2>Who We Are</h2>
                    <p>Welcome to SkillMatch, your gateway to connecting talent with opportunity. SkillMatch is a revolutionary platform designed to seamlessly bridge the gap between service seekers and skilled service providers. 
                        Whether you're an employer seeking top-tier talent or a worker looking to showcase your expertise, 
                        SkillMatch is here to make the perfect match.
                        At SkillMatch, we recognize the importance of finding the right fit. Our intuitive interface simplifies the entire process, empowering employers to post projects with specific requirements and deadlines, 
                        while enabling service providers to browse through tailored job listings that match their skill set. 
                        Whether you're a freelancer looking to expand your clientele or a business seeking specialized skills, SkillMatch is your ultimate destination. 
                        Join us today and discover the future of service networking.</p>
                </div>
            </div>
        </div>
    )
}

export default About;