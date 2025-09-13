#!/bin/bash

echo "🧪 COMPREHENSIVE NEXT.JS API TESTING"
echo "====================================="

BASE_URL="http://localhost:3001"

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local data="$4"
    
    echo "Testing: $name"
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$url")
    else
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$BASE_URL$url")
    fi
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')
    
    if [ "$http_code" -eq 200 ]; then
        echo "✅ $name - Status: $http_code"
    else
        echo "❌ $name - Status: $http_code"
    fi
    
    # Show response for API endpoints (JSON)
    if [[ "$url" == /api/* ]]; then
        echo "   Response: $(echo $body | head -c 200)..."
    fi
    echo ""
}

echo ""
echo "📄 TESTING CORE NEXT.JS PAGES"
test_endpoint "Homepage" "/"
test_endpoint "Project Page" "/project/project-1"
test_endpoint "Test OpenAI Page" "/test-openai"
test_endpoint "Login Page" "/login"

echo ""
echo "🔌 TESTING API ENDPOINTS"
test_endpoint "Health API" "/api/health"
test_endpoint "OpenAI Status" "/api/test-openai"

echo ""
echo "🤖 TESTING OPENAI INTEGRATION"

# Test OpenAI Chat
chat_data='{
  "messages": [{"role": "user", "content": "What is the National Construction Code?"}],
  "model": "gpt-3.5-turbo"
}'
test_endpoint "OpenAI Chat API" "/api/openai" "POST" "$chat_data"

# Test Document Analysis with BAL 19
analysis_data='{
  "documents": [{
    "id": "test-doc-1",
    "name": "Test BAL 19 Plans.pdf",
    "type": "architectural",
    "content": "Test building plans for a Class 1a dwelling with BAL 19 bushfire rating requiring AS3959 compliance for construction details."
  }],
  "projectDetails": {
    "jurisdiction": "New South Wales",
    "buildingClassification": "Class 1a",
    "soilClass": "M",
    "windRating": "N3",
    "bushfireRating": "BAL 19",
    "balRating": "BAL 19",
    "nccVersion": "NCC 2025",
    "projectType": "new construction"
  },
  "memoryBank": []
}'
test_endpoint "Document Analysis (BAL 19)" "/api/analyze-documents" "POST" "$analysis_data"

echo "📊 Next.js Application Test Complete"
