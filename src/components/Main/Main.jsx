import React, { useContext, useEffect, useState } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import LogoutButton from '../LogoutButton/LogoutButton';
import axios from 'axios';

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
  
  // State to store user profile information
  const [profilePic, setProfilePic] = useState(''); // URL to profile picture
  const [userName, setUserName] = useState(''); // User name

  useEffect(() => {
    // Fetch user profile data when the component mounts
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile');
        setProfilePic(response.data.profilePicture); 
        setUserName(response.data.name); 
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const cardMessages = [
    "Ndibatsire kuita homework",
    "Ndibatsirewo nekuverenga",
    "Ndiudze nyaya inonakidza",
    "Ndinonyora sei rondedzero yetsumo",
  ];

  const handleCardClick = (message) => {
    setInput(message);
    onSent();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && input) {
      onSent();
    }
  };

  return (
    <div className='main'>
      <div className="nav">
        <p>Chikoro AI</p>
        {/* Display user profile picture */}
        <img src={profilePic || "src/assets/profile.png"} alt="Profile" />
        <LogoutButton className="logout-button" />
      </div>
      <div className="main-container">
        {!showResult
          ? <>
            <div className="greet">
              <p><span>Mhoro, {userName}</span></p>
              <p>Ndokubatsira nei nhasi?</p>
            </div>
            <div className="cards">
              {cardMessages.map((message, index) => (
                <div key={index} className="card" onClick={() => handleCardClick(message)}>
                  <p>{message}</p>
                  <img src={assets[`${index === 0 ? 'compass_icon' : index === 1 ? 'bulb_icon' : index === 2 ? 'message_icon' : 'code_icon'}`]} alt="" />
                </div>
              ))}
            </div>
          </>
          : <div className='result'>
            <div className="result-title">
              <img src={profilePic || "src/assets/profile.png"} alt="Profile" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src="Scales Technologies Abstract Logo.png" alt="" />
              {loading
                ? <div className='loader'>
                  <hr />
                  <hr />
                  <hr />
                </div>
                : <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              }
            </div>
          </div>
        }
        <div className="main-bottom">
          <div className="search-box">
            <textarea 
              onChange={(e) => setInput(e.target.value)} 
              value={input} 
              type="text" 
              placeholder='Nyora muvhunzo wako pano' 
              onKeyDown={handleKeyDown} // Add this line
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
            </div>
          </div>
          <p className="bottom-info">Chikoro AI inogona kuratidza ruzivo rusina chokwadi, kusanganisira nezvevanhu, saka tarisa kaviri mhinduro dzayo</p>
        </div>
      </div>
    </div>
  );
};

export default Main;
