// Test script for address API
const testAddressAPI = async () => {
  try {
    console.log("Testing address API...");

    const response = await fetch("http://localhost:3001/api/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "smith street",
      }),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    const data = await response.text();
    console.log("Response data:", data);

    if (response.ok) {
      const jsonData = JSON.parse(data);
      console.log("✅ API test successful!");
      console.log(
        "Results:",
        jsonData.addresses?.length || 0,
        "addresses found",
      );
      console.log("Source:", jsonData.source);
    } else {
      console.log("❌ API test failed with status:", response.status);
    }
  } catch (error) {
    console.error("❌ Test error:", error);
  }
};

// Run the test
testAddressAPI();
