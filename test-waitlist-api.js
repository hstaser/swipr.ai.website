// Test script to verify waitlist API works with MongoDB
const fetch = require("node-fetch");

async function testWaitlistAPI() {
  console.log("🧪 Testing Waitlist API...");

  try {
    // Test POST - Join waitlist
    console.log("📝 Testing waitlist signup...");
    const signupResponse = await fetch("http://localhost:8080/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `test-${Date.now()}@example.com`,
        name: "Test User",
      }),
    });

    const signupData = await signupResponse.json();
    console.log("📝 Signup Response:", {
      status: signupResponse.status,
      data: signupData,
    });

    // Test GET - Check count
    console.log("��� Testing waitlist count...");
    const countResponse = await fetch("http://localhost:8080/api/waitlist");
    const countData = await countResponse.json();
    console.log("📊 Count Response:", {
      status: countResponse.status,
      data: countData,
    });

    // Test Admin Dashboard - Get waitlist entries
    console.log("🔐 Testing admin dashboard waitlist data...");
    const adminResponse = await fetch(
      "http://localhost:8080/api/admin/dashboard?type=waitlist",
      {
        headers: {
          Authorization: "Bearer admin-swipr-2025",
          "Content-Type": "application/json",
        },
      },
    );

    const adminData = await adminResponse.json();
    console.log("🔐 Admin Response:", {
      status: adminResponse.status,
      data: adminData,
    });

    console.log("✅ Test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testWaitlistAPI();
