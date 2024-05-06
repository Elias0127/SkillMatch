import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Home.css";
import mainImage from "../assets/Chatbot.png";
import secondaryImage from "../assets/order-delivered.png";
import NavBar from '../components/NavBar';

const HeroSection = () => {
return (
    <section className="hero-section">
        <div className='hero-content'>
            <h1 className='hero-title'>Your local service needs</h1>
            <Link to="/login" className="discover-button">Get Started</Link>
        </div>
        <div className='hero-image'>
            <img src={mainImage} alt='main-image' />
        </div>
    </section>
    );
};

const ServicesSection = () => {
    return (
      <section className="services-section">
        <h2>Available services</h2>
        <p className='services-sub'>Here are just some of the services we offer</p>
        <div className="services-row">
          <div className="service-item">
              <h3>Plumbing</h3>
              <p>Reliable solutions for all your plumbing needs, from leaks to installations.
              Whether it's a routine maintenance check or an emergency repair, trust our team to deliver top-notch plumbing services that exceed your expectations.
              </p>
          </div>
          <div className="service-item">
              <h3>Electrician</h3>
              <p>Our certified electricians are equipped with the skills and knowledge to handle a wide range of electrical issues, from wiring upgrades to appliance installations. 
                  With meticulous attention to detail, they ensure that every job is completed to the highest standards.
                </p>
          </div>
          <div className="service-item">
              <h3>Mechanic</h3>
              <p>Keep your vehicle running smoothly with our comprehensive mechanic services. 
                  Whether it's routine maintenance like oil changes and tire rotations or more complex repairs such as engine diagnostics and brake replacements, our skilled mechanics have you covered. </p>
          </div>
        </div>
      </section>
    );
  };

function Home() {
    return (
        <div className='container'>
            <NavBar />
            <HeroSection />
            <div className='discover-section'>
                <div className='discover-image'>
                    <img src={secondaryImage} alt='main-image' />
                </div>
                <div className='discover-content'>
                    <h2 className='discover-title'>Discover Convenience</h2>
                    <p className='discover-sub'>Streamline your search for essential services with our user-friendly app. 
                    From finding the nearest technician to scheduling a home repair, we've got you covered. 
                    Get started now and discover convenience at your fingertips!</p>
                    <Link to="/About" className="regist-button">Learn more</Link>
                </div>
            </div>
            <ServicesSection />
        </div>
    );
}

export default Home;
