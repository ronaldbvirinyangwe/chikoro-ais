import express from 'express';
import { Paynow } from 'paynow';
import cors from 'cors';
import jwt from 'jsonwebtoken'; // For token authentication

const app = express();
const ONE_DAY_MS = 24 * 60 * 60 * 1000; // Milliseconds in a day
const THIRTY_DAYS_MS = 30 * ONE_DAY_MS; // 30 days in milliseconds

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

// Paynow credentials and settings
const paynow = new Paynow("19208", "1569d49f-67e7-4e3b-9b7c-168c7d37e312");
paynow.resultUrl = "http://example.com/gateways/paynow/update"; // Should be your backend callback URL
paynow.returnUrl = "https://www.chikoro-ai.com"; // Ensure this is a full URL

// Secret for JWT (you should use a strong secret in production)
const JWT_SECRET = 'your-secret-key'; 

// Utility function to authenticate the user using JWT
const authenticateUser = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // Return user data from JWT payload
  } catch (err) {
    return null; // Invalid token
  }
};

// Endpoint to initiate payment
app.post('/bhadhara', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const user = authenticateUser(token); // Authenticate the user using JWT
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    // Create payment with a unique reference
    const payment = paynow.createPayment(`Order-${Date.now()}`, "ronaldbvirinyangwe@icloud.com");

    // Add items to the payment (amount in USD)
    payment.add("Chikoro AI Subscription", 2.00);

    // Send mobile money payment
    const response = await paynow.sendMobile(payment, phoneNumber, 'ecocash');

    if (response.success) {
      const { pollUrl, instructions } = response; // Get the payment instructions and poll URL

      // Return payment initiation details to the client
      return res.status(200).json({
        success: true,
        pollUrl,
        instructions,
      });

    } else {
      throw new Error(response.error || "Payment initiation failed");
    }
  } catch (error) {
    console.error("Payment Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Function to check the payment status with retries
const checkPaymentStatusWithRetry = async (pollUrl, retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const status = await paynow.pollTransaction(pollUrl); // Poll Paynow API
      console.log(`Attempt ${i + 1} - Payment Status:`, status);

      if (status.status === 'paid') {
        console.log("Payment completed successfully");
        return { success: true, status: 'paid' }; // Return success if payment is completed
      }

      console.log("Payment status not 'paid', retrying...");
      if (i < retries - 1) {
        await new Promise((res) => setTimeout(res, delay)); // Retry after a delay
      }
    } catch (error) {
      console.error(`Error checking payment status (Attempt ${i + 1}):`, error);
      if (i === retries - 1) {
        return { success: false, message: 'Payment failed after multiple attempts' };
      }
    }
  }
  return { success: false, message: 'Payment still pending' }; // If all retries fail
};

// Endpoint to check payment status
app.post('/check-payment-status', async (req, res) => {
  const { pollUrl } = req.body;

  if (!pollUrl) {
    return res.status(400).json({ success: false, error: 'pollUrl is required.' });
  }

  try {
    const status = await checkPaymentStatusWithRetry(pollUrl);
    console.log('Payment Status:', status);

    if (status.success) {
      // Set the payment status token with expiration (30 days)
      const expirationDate = new Date().getTime() + THIRTY_DAYS_MS; // 30 days from now
      const paymentToken = {
        status: 'paid',
        expirationDate,
      };

      // Store payment status in token (simulated in localStorage or database in production)
      // In a real app, you'd store this in your database
      res.status(200).json({
        success: true,
        message: 'Payment completed successfully',
        status: 'paid',
        expirationDate,
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

// Endpoint to login (generate JWT token)
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Example: Authenticate user (in a real app, you'd check the DB)
  if (email === 'user@example.com' && password === 'password') {
    const user = { id: 1, email }; // User data to include in the token
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' }); // Create JWT token (expires in 1 hour)

    return res.status(200).json({
      success: true,
      token,
    });
  }

  return res.status(401).json({ success: false, error: 'Invalid credentials' });
});

// Endpoint to log out
app.post('/logout', (req, res) => {
  // In a real-world scenario, you'd invalidate the JWT token here
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

app.listen(3080, () => {
  console.log('Server listening on port 3080');
});

