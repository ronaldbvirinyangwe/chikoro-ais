import express from 'express';
import { Paynow } from 'paynow';
import cors from 'cors';

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['https://chikoro-ai.com', 'http://13.246.95.40:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Authorization', 'Content-Type'],
};

app.use(cors());
app.use(express.json());

// Handle preflight requests
app.options('*', cors(corsOptions));

const paynow = new Paynow("19208", "1569d49f-67e7-4e3b-9b7c-168c7d37e312");

paynow.resultUrl = "http://example.com/gateways/paynow/update";
paynow.returnUrl = "https://www.chikoro-ai.com"; // Ensure this is a full URL

const authenticateUser = (token) => {
  // Verify token and authenticate user
  return { id: 1, email: 'user@example.com' }; // Dummy user for demonstration
};

// Create payment endpoint
app.post('/bhadhara', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const user = authenticateUser(token);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { phoneNumber } = req.body;

    // Create payment with a unique reference
    const payment = paynow.createPayment(`Order-${Date.now()}`, "ronaldbvirinyangwe@icloud.com");

    // Add items (amount in USD)
    payment.add("Chikoro AI Subscription", 0.01);
    console.log('Payment created:', payment);

    // Send mobile money payment
    const response = await paynow.sendMobile(payment, phoneNumber, 'ecocash');

    if (response.success) {
      const { pollUrl, instructions } = response;

      // Return the response to client
      res.status(200).json({
        success: true,
        pollUrl,
        instructions
      });

      // Optional: Poll for status
      const checkStatus = async () => {
        try {
          const status = await paynow.pollTransaction(pollUrl);
          console.log("Transaction Status:", status);
          if (status.paid) {
            console.log("Payment completed successfully");
            // Here you can update the database or notify the user
          }
        } catch (error) {
          console.error("Polling Error:", error);
        }
      };

      // Check status after 15 seconds
      setTimeout(checkStatus, 15000);
    } else {
      throw new Error(response.error || "Payment initiation failed");
    }
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});



// Poll payment status and handle the response
const checkPaymentStatusWithRetry = async (pollUrl, retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const status = await paynow.pollTransaction(pollUrl);  // Poll Paynow API
      console.log(`Attempt ${i + 1} - Payment Status:`, status);

      if (status.status === 'paid') {
        console.log("Payment completed successfully");
        return { success: true, redirectUrl: 'https://www.chikoro-ai.com' };
      }

      console.log("Payment status not 'paid', retrying...");
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));  // Retry after a delay
      }
    } catch (error) {
      console.error(`Error checking payment status (Attempt ${i + 1}):`, error);
      if (i === retries - 1) {
        return { success: false, message: 'Payment failed after multiple attempts' };
      }
    }
  }
  return { success: false, message: 'Payment still pending' };  // If all retries fail
};

app.post('/check-payment-status', async (req, res) => {
  const { pollUrl } = req.body;

  if (!pollUrl) {
    return res.status(400).json({ success: false, error: 'pollUrl is required.' });
  }

  try {
    const status = await checkPaymentStatusWithRetry(pollUrl);
    console.log('Payment Status:', status);
    if (status.success) {
      return res.status(200).json({
        success: true,
        message: 'Payment completed successfully',
        redirectUrl: 'https://www.chikoro-ai.com', // Make sure this is a valid URL
      });
    } else {
      return res.status(200).json({
        success: false,
        message: 'Payment is still pending or failed.',
      });
    }
  } catch (error) {
    console.error('Error checking payment status:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3080, () => {
  console.log('Server listening on port 3080');
});

