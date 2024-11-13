import React, { useState } from "react";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "/api/users";
      const { data: res } = await axios.post(url, formData);
      navigate('/login');
      console.log(res.message);
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      } else {
        alert("Error creating user. Please try again.");
      }
    }
  };

  return (
    <div className="addUser">
      <h3>Sign Up</h3>
      <form className="AddUserForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            name="firstName"
            autoComplete="off"
            autoCapitalize="none"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            name="lastName"
            autoComplete="off"
            autoCapitalize="none"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            autoComplete="off"
            autoCapitalize="none"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            autoComplete="off"
            autoCapitalize="none"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && <div className="error_msg">{error}</div>}
          <button type="submit" className="btn btn-success">
            Sign Up
          </button>
        </div>
      </form>
      <div className="login">
        <p>Already have an account?</p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
