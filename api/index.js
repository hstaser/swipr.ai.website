// Vercel serverless function
import express from "express";
import cors from "cors";

const app = express();

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Demo endpoint
app.post('/api/demo', (req, res) => {
  res.json({ message: 'Demo endpoint working' });
});

// Contact endpoint
app.post('/api/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.json({ message: 'Contact form received' });
});

// Waitlist endpoint
app.post('/api/waitlist', (req, res) => {
  console.log('Waitlist submission:', req.body);
  res.json({ message: 'Added to waitlist' });
});

// Job application endpoint
app.post('/api/jobs/apply', (req, res) => {
  console.log('Job application:', req.body);
  res.json({ message: 'Application received' });
});

// Analytics endpoint
app.post('/api/analytics/track', (req, res) => {
  console.log('Analytics event:', req.body);
  res.json({ message: 'Event tracked' });
});

// Catch all for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Export for Vercel
export default app;
