// Test script to verify MongoDB integration works in production
console.log("🧪 Testing Production API MongoDB Integration...");

// Test the API endpoints that should now use MongoDB
async function testProductionAPI() {
  try {
    console.log("📝 Testing waitlist signup...");

    // Test waitlist signup
    const testEmail = `test-${Date.now()}@example.com`;
    const waitlistResponse = await fetch("/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testEmail,
        name: "Production Test User",
      }),
    });

    const waitlistData = await waitlistResponse.json();
    console.log("📝 Waitlist Response:", {
      status: waitlistResponse.status,
      success: waitlistData.success,
      message: waitlistData.message,
    });

    if (waitlistData.success) {
      console.log("✅ Waitlist signup works!");

      // Now test admin dashboard to see if it shows up
      console.log("🔐 Testing admin dashboard...");

      const adminResponse = await fetch("/api/admin/dashboard?type=waitlist", {
        headers: {
          Authorization: "Bearer admin-swipr-2025",
          "Content-Type": "application/json",
        },
      });

      const adminData = await adminResponse.json();
      console.log("🔐 Admin Dashboard Response:", {
        status: adminResponse.status,
        success: adminData.success,
        waitlistCount: adminData.data ? adminData.data.length : 0,
      });

      if (adminData.success && adminData.data) {
        const recentEntry = adminData.data.find(
          (entry) => entry.email === testEmail,
        );
        if (recentEntry) {
          console.log(
            "🎉 SUCCESS! Real data is now showing in admin dashboard!",
          );
          console.log("📧 Found test entry:", {
            email: recentEntry.email,
            name: recentEntry.name,
            joinedAt: recentEntry.joinedAt,
          });
        } else {
          console.log("⚠️ Test entry not found in admin dashboard yet...");
        }
      }
    } else {
      console.log("❌ Waitlist signup failed:", waitlistData.message);
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testProductionAPI();
