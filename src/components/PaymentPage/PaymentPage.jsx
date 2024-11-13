import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  const { token, setAuth } = useAuth(); // Assuming token is stored in context

  const ONE_DAY_MS = 24 * 60 * 60 * 1000; // Milliseconds in a day
  const THIRTY_DAYS_MS = 30 * ONE_DAY_MS; // 30 days in milliseconds

  // Check if payment status token exists and is not expired
  const checkPaymentStatus = () => {
    const storedToken = localStorage.getItem('paymentToken');
    if (storedToken) {
      const { status, expirationDate } = JSON.parse(storedToken);
      const currentDate = new Date().getTime();
      
      // Check if token has expired (more than 30 days old)
      if (currentDate < expirationDate) {
        setPaymentStatus(status);
      } else {
        setPaymentStatus('expired');
      }
    } else {
      setPaymentStatus('notPaid');
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('paymentToken');
    navigate('/login');
  };

  const validatePhoneNumber = (number) => {
    // Basic Zimbabwe phone number validation (ecocash)
    const phoneRegex = /^(07[7-8])[0-9]{7}$/;
    return phoneRegex.test(number);
  };

  const handlePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Zimbabwe mobile number');
      return; // Prevent further execution
    }

    setLoading(true);
    setError('');
    console.log('Token being sent:', token);

    try {
      // Send the payment request to your backend
      const response = await axios.post('/bhadhara', { phoneNumber }, {
        headers: {
          Authorization: 'Bearer ${token}',
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
      setError(err.response?.data?.error || 'An error occurred while processing payment.');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async () => {
    try {
      const response = await axios.post('/check-payment-status', { pollUrl });

      if (response.data.success) {
        setPaymentStatus('paid');
        // Set payment status token with expiry time (30 days)
        const expirationDate = new Date().getTime() + THIRTY_DAYS_MS;
        const paymentToken = {
          status: 'paid',
          expirationDate,
        };
        localStorage.setItem('paymentToken', JSON.stringify(paymentToken));
        navigate('/'); // Redirect to the main page after successful payment
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Error polling payment status:', error);
      setError('Error checking payment status');
    }
  };

  useEffect(() => {
    checkPaymentStatus(); // Check if the payment status is stored and valid when the page loads
  }, []); // Only run on mount

  useEffect(() => {
    if (pollUrl && paymentStatus !== 'paid') {
      const interval = setInterval(() => {
        pollPaymentStatus(); // Poll the payment status every 5 seconds
      }, 5000);
      return () => clearInterval(interval); // Clean up the interval on component unmount
    }
  }, [pollUrl, paymentStatus]);

  return (
    <div className="content">
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      <div className="container">
        {paymentStatus === 'initiated' ? (
          <div>
            <h2>Payment Instructions</h2>
            <p>{instructions}</p>
            <p>Please complete the payment on your mobile device.</p>
            <p>Status: Waiting for payment confirmation...</p>
          </div>
        ) : paymentStatus === 'paid' ? (
          <div>
            <h2>Payment Successful</h2>
            <p>Your payment has been confirmed!</p>
            <p>Status: Paid</p>
          </div>
        ) : paymentStatus === 'expired' ? (
          <div>
            <h2>Payment Expired</h2>
            <p>Your payment status has expired. Please make a new payment to continue.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
            <div className="payment">
              <h2>USD $2/month</h2> <span>✔</span>
              <p>Early access to new features</p>
              <span>✔</span>
              <p>Access to Chikoro AI genesis</p>
              <span>✔</span>
              <p>Assistance with homework, writing, problem solving, and more</p>
            </div>
            <label>
              Phone Number:
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="ecocash account e.g., 0771234567"
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

