import React from 'react';

const LogoutButton = () => {
  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem("token");

    // Redirect to the login page
    window.location.href = 'http://13.246.95.40:3000/login'; 
  };

  return (
    <button className='logout'onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
