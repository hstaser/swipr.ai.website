// Simple test to verify the API endpoints work
// This can be run in the browser console

async function testAPI() {
  const baseURL = window.location.origin;

  console.log("🧪 Testing API endpoints...");

  try {
    // Test waitlist signup
    console.log("📝 Testing waitlist signup...");
    const waitlistResponse = await fetch(`${baseURL}/api/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `test-${Date.now()}@example.com`,
        name: "Test User",
      }),
    });

    const waitlistData = await waitlistResponse.json();
    console.log("📝 Waitlist signup result:", waitlistData);

    // Test admin dashboard
    console.log("🔐 Testing admin dashboard...");
    const token = localStorage.getItem("adminToken");

    if (token) {
      const adminResponse = await fetch(
        `${baseURL}/api/admin/dashboard?type=waitlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const adminData = await adminResponse.json();
      console.log("🔐 Admin waitlist data:", adminData);
    } else {
      console.log("❌ No admin token found. Please log into admin first.");
    }

    console.log("✅ Test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Auto-run the test
testAPI();
