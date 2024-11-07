import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Assuming you have an AuthContext
import './PaymentPage.css';

const PaymentPage = () => {
  const [instructions, setInstructions] = useState('');
  const [pollUrl, setPollUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const returnUrl = 'https://chikoro-ai.com'; // Set your redirect URL here

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const validatePhoneNumber = (number) => {
    // Basic Zimbabwe phone number validation
    const phoneRegex = /^(07[7-8])[0-9]{7}$/;
    return phoneRegex.test(number);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    console.log('Token being sent:', token);

    try {
      // Send the payment request to your backend
      const response = await axios.post('/bhadhara', {
        phoneNumber: phoneNumber,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.instructions) {
        setInstructions(response.data.instructions);
        setPollUrl(response.data.pollUrl);
        setPaymentStatus('initiated');
      } else if (response.data && response.data.error) {
        setError(response.data.error);
      } else {
        setError('Unknown error occurred');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'An error occurred while processing');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async () => {
    try {
      const response = await axios.post('/check-payment-status', {
        pollUrl: pollUrl,
      });

      if (response.data.success) {
        setPaymentStatus('paid');
        navigate('../'); // Frontend redirection
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Error polling payment status:', error);
      setError('Error checking payment status');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (pollUrl && paymentStatus !== 'paid') {
        pollPaymentStatus(); // Poll the payment status only if it's not paid yet
      }
    }, 5000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [pollUrl, paymentStatus]); // Re-run if pollUrl or paymentStatus changes

  return (
    <div className="content">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <div className="container">
        {paymentStatus === 'initiated' ? (
          <div>
            <h2>Payment Instructions</h2>
            <p>{instructions}</p>
            <p>Please complete the payment on your mobile device.</p>
            <p>Status: Waiting for payment confirmation...</p>
          </div>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            handlePayment();
          }}>
            <div className="payment">
              <h2>USD $2/month</h2> <span>✔</span>
              <p>Early access to new features</p>
              <span>✔</span>
              <p>Access to Chikoro AI gen</p>
              <span>✔</span>
              <p>Assistance with homework, writing, problem solving and more</p>
            </div>

            <label>
              Phone Number:
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 0771234567"
                required
              />
            </label> 
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Subscribe'}
            </button>
          </form>
        )}

        {error && <p className="error-message">Error: {error}</p>}
      </div>
    </div>
  );
};

export default PaymentPage;

