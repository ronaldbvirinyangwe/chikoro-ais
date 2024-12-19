import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      localStorage.setItem('token', response.data.data);
      setAuth(response.data.data);
      navigate('/payment');
    } catch (error) {
      alert("Error logging in. Please try again.");
    }
  };

  return (
    <div className="addUser">
      <h3>Sign In</h3>
      <form className="AddUserForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            autoComplete="off"
            autoCapitalize="none"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn-primary">Login</button>
        </div>
      </form>
      <div className="login">
        <p>Don't have an Account?</p>
        <Link to="/signup" className="btn btn-success">Sign up</Link>
      </div>
<div className="video-section">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/dOw5K_J7dRY"  // Replace with your video URL or ID
          title="Infomercial Video"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Login;
