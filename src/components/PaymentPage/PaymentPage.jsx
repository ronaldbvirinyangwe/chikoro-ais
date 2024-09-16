import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem("token");
    // Redirect to the login page
    navigate("/login");
  };

const startPayment = () => {
    // Save a flag to indicate that payment is in progress
    localStorage.setItem('paymentInProgress', 'true');
    window.location.href = "https://www.paynow.co.zw/Payment/BillPaymentLink/?q=aWQ9MTkyMzUmYW1vdW50PTIuMDAmYW1vdW50X3F1YW50aXR5PTAuMDAmbD0x"
  };

  const handlePaymentSuccess = () => {
    // Check if there's a return URL stored
    const returnUrl = localStorage.getItem('returnUrl') || '/';
    // Clear the return URL from localStorage
    localStorage.removeItem('returnUrl');
    // Redirect to the returnUrl after payment
    navigate(returnUrl);
  };

  return (
    <div className="content">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <div className="container">
        <div className="payment">
          <h2>
            USD $2/month
            <br />
          </h2>
          <span>&#10004;</span>
          <p>Early access to new features</p>
          <br />
          <span>&#10004;</span>
          <p>Access to Chikoro AI gen</p>
          <br />
          <span>&#10004;</span>
          <p>Assistance with homework, writing, problem solving, and more</p>
       <button className="submit-btn" onClick={startPayment}>
            Subscribe
          </button>
	 </div>
      </div>
    </div>
  );
};

export default PaymentPage;

