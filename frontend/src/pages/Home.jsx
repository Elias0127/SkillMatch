import React from 'react';
//import { Link } from 'react-router-dom';
//import Logout from './Logout'; 
import "../styles/Dashboard.css"

function Home() {
    
    return (
        <div className='bg'>
            {/*Nav Bar */}
            <div className="nav-bar">
                <div className="div">
                <div className="title">Skillmatch</div>
                <div className="div-2">
                    <div className="nav-item">About</div>
                    <div className="nav-item">Discover</div>
                    <div className="nav-item">Review</div>
                </div>
            </div>
            </div>
            {/*User Profile */}
            <div className="user-profile-box">
                <div className="div-3">
                <div className="column">
                    <div className="div-4">
                    <div className="div-5" />
                    <div className="div-6">
                        <div className="div-7" />
                        <div className="div-8">Online</div>
                    </div>
                    </div>
                </div>
                <div className="column-2">
                    <div className="div-9">
                    <div className="div-10">Name</div>
                    <div className="div-11">John Doe</div>
                    <div className="div-12">Gender</div>
                    <div className="div-13">Male</div>
                    <div className="div-14">Phone Number</div>
                    <div className="div-15">+1 123 456 7890</div>
                    <div className="div-16">Location</div>
                    <div className="div-17">Long Beach, California</div>
                    </div>
                </div>
                </div>
            </div>
            {/*Availability*/}
            <div className="avail-box">
                <div className="div-18">Availability</div>
                <div className="div-19">
                <span className="style">Monday</span>:
                10:00am- 3:00pm
                </div>
                <div className="div-20">
                <span className="style">Tuesday</span>:
                10:00am- 3:00pm
                </div>
                <div className="div-21">
                <span className="style">Wednesday</span>
                : 10:00am- 3:00pm
                </div>
                <div className="div-1">
                <span className="style">Thursday</span>:
                10:00am- 3:00pm
                </div>
                <div className="div-21">
                <span className="style">Friday</span>:
                10:00am- 5:00pm
                </div>
                <div className="div-21">
                <span className="style">Saturday</span>:
                10:00am- 5:00pm
                </div>
                <div className="div-21">
                <span className="style">Sunday</span>:
                Unavailable
                </div>
            </div>
            {/* */}
            <div className="about-box">
        <div className="div-22">About</div>
        <div className="div-23">
          With a passion for precision and safety, I bring 2 of hands-on
          experience in electrical installations, repairs, and maintenance.
          Skilled in interpreting blueprints, troubleshooting complex issues,
          and adhering to electrical codes, I am dedicated to delivering
          reliable solutions for residential, commercial, and industrial
          clients.
        </div>
      </div>
      <div className="skill">Skills</div>
        </div>
        
      
       

    );
}

export default Home;
