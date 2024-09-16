import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the payment was successful
    const paymentInProgress = localStorage.getItem('paymentInProgress');
    if (paymentInProgress) {
      // Assume payment was successful for this example
      localStorage.removeItem('paymentInProgress');

      // Redirect to the desired route after payment
      navigate('/');  // or any other route as needed
    } else {
      navigate('/login');  // or redirect to login if not payment in progress
    }
  }, [navigate]);

  return (
    <div>
      <h1>Processing Payment...</h1>
    </div>
  );
};

export default PaymentSuccessPage;
