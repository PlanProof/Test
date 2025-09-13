const {
  isOpenAIAvailable,
  createOpenAIClient,
} = require("./app/lib/openai-client.ts");

async function testOpenAI() {
  console.log("Testing OpenAI configuration...");

  try {
    // Check if OpenAI is available
    const available = isOpenAIAvailable();
    console.log("OpenAI Available:", available);

    if (!available) {
      console.log("❌ OpenAI API key not configured or not available");
      return;
    }

    // Try to create client
    const client = await createOpenAIClient();
    console.log("✅ OpenAI client created successfully");

    // Test a simple completion
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content:
            "Hello, this is a test. Please respond with 'Connection successful!'",
        },
      ],
      max_tokens: 10,
    });

    console.log("✅ OpenAI API test successful!");
    console.log("Response:", completion.choices[0]?.message?.content);
  } catch (error) {
    console.error("❌ OpenAI test failed:", error.message);
  }
}

testOpenAI();
