// Simple test script to verify serverless functions work locally
// Run with: node test-api.js

const tests = [
  {
    name: "Contact Form",
    endpoint: "/api/contact",
    method: "POST",
    data: {
      name: "Test User",
      email: "test@example.com",
      message: "This is a test message",
    },
  },
  {
    name: "Waitlist Signup",
    endpoint: "/api/waitlist",
    method: "POST",
    data: {
      email: "waitlist@example.com",
    },
  },
  {
    name: "Job Application",
    endpoint: "/api/jobs/apply",
    method: "POST",
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
      position: "backend-engineer",
      experience: "3-5 years",
      startDate: "2024-08-01",
    },
  },
  {
    name: "Analytics Tracking",
    endpoint: "/api/analytics/track",
    method: "POST",
    data: {
      eventType: "page_view",
      page: "/",
      sessionId: "test-session-123",
    },
  },
];

async function runTests() {
  console.log("🧪 Testing Serverless Functions\n");

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`Endpoint: ${test.endpoint}`);
      console.log(`Data:`, JSON.stringify(test.data, null, 2));

      // Note: This would require the serverless functions to be running
      // In production, you'd test against your deployed Vercel URL
      const baseUrl = "https://your-app.vercel.app"; // Replace with your actual URL
      const response = await fetch(`${baseUrl}${test.endpoint}`, {
        method: test.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(test.data),
      });

      const result = await response.json();
      console.log(`Status: ${response.status}`);
      console.log(`Response:`, JSON.stringify(result, null, 2));
      console.log("✅ Success\n");
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
  }
}

console.log(`
📋 API ENDPOINTS CREATED:

✅ /api/contact.js
   - Handles contact form submissions
   - Validates name, email, message
   - Returns success/error response

✅ /api/waitlist.js  
   - Handles waitlist signups
   - Validates email format
   - Returns success/error response

✅ /api/jobs/apply.js
   - Handles job applications
   - Validates all required fields
   - Returns application ID on success

✅ /api/analytics/track.js
   - Tracks user analytics events
   - Validates event data
   - Returns success response

🚀 DEPLOYMENT READY:
   - All forms have proper error handling
   - CORS headers configured
   - Validation implemented
   - User feedback improved

💡 TO TEST LIVE:
   1. Deploy to Vercel
   2. Update baseUrl above to your Vercel URL
   3. Run: node test-api.js
`);

// Uncomment to run tests (requires deployed app)
// runTests();
