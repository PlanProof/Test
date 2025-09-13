/**
 * Comprehensive Next.js Application Test
 * Tests all critical functionality including OpenAI integration
 */

const BASE_URL = 'http://localhost:3001';

async function testEndpoint(path, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.text();
    let jsonData = null;
    
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      // Response is not JSON, that's okay for HTML pages
    }
    
    return {
      status: response.status,
      ok: response.ok,
      data: jsonData || data,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    return {
      error: error.message,
      status: 0,
      ok: false
    };
  }
}

async function runComprehensiveTests() {
  console.log('🧪 COMPREHENSIVE NEXT.JS APPLICATION TEST\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };
  
  function logTest(name, passed, details = '') {
    const emoji = passed ? '✅' : '❌';
    console.log(`${emoji} ${name}`);
    if (details) console.log(`   ${details}`);
    
    results.tests.push({ name, passed, details });
    if (passed) results.passed++;
    else results.failed++;
  }
  
  // Test 1: Homepage loads
  console.log('\n📄 TESTING CORE NEXT.JS FUNCTIONALITY');
  const homeTest = await testEndpoint('/');
  logTest('Homepage loads successfully', homeTest.ok && homeTest.status === 200, `Status: ${homeTest.status}`);
  
  // Test 2: Project page loads
  const projectTest = await testEndpoint('/project/project-1');
  logTest('Project page loads', projectTest.ok, `Status: ${projectTest.status}`);
  
  // Test 3: API routes work
  console.log('\n🔌 TESTING API ROUTES');
  const healthTest = await testEndpoint('/api/health');
  logTest('Health API endpoint', healthTest.ok, `Status: ${healthTest.status}`);
  
  // Test 4: OpenAI Status Check
  console.log('\n🤖 TESTING OPENAI INTEGRATION');
  const openaiStatusTest = await testEndpoint('/api/test-openai');
  logTest('OpenAI status endpoint', openaiStatusTest.ok, `Status: ${openaiStatusTest.status}`);
  
  if (openaiStatusTest.ok && openaiStatusTest.data) {
    const statusData = openaiStatusTest.data;
    logTest('OpenAI configuration', statusData.status === 'configured', `Status: ${statusData.status}`);
    
    if (statusData.test_results) {
      const workingModels = statusData.test_results.filter(r => r.status === 'success');
      logTest('OpenAI models accessible', workingModels.length > 0, `${workingModels.length} working models`);
    }
  }
  
  // Test 5: OpenAI Chat API
  const chatTest = await testEndpoint('/api/openai', {
    method: 'POST',
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Test message for building compliance' }],
      model: 'gpt-3.5-turbo'
    })
  });
  logTest('OpenAI chat API', chatTest.ok, `Status: ${chatTest.status}`);
  
  // Test 6: Document Analysis API with BAL 19
  console.log('\n📋 TESTING DOCUMENT ANALYSIS');
  const analysisTest = await testEndpoint('/api/analyze-documents', {
    method: 'POST',
    body: JSON.stringify({
      documents: [{
        id: 'test-doc-1',
        name: 'Test BAL 19 Plans.pdf',
        type: 'architectural',
        content: 'Test building plans for a Class 1a dwelling with BAL 19 bushfire rating requiring AS3959 compliance.'
      }],
      projectDetails: {
        jurisdiction: 'New South Wales',
        buildingClassification: 'Class 1a',
        soilClass: 'M',
        windRating: 'N3',
        bushfireRating: 'BAL 19',
        balRating: 'BAL 19',
        nccVersion: 'NCC 2025',
        projectType: 'new construction'
      },
      memoryBank: []
    })
  });
  
  logTest('Document analysis API', analysisTest.ok, `Status: ${analysisTest.status}`);
  
  if (analysisTest.ok && analysisTest.data) {
    const analysisData = analysisTest.data;
    logTest('Analysis returns success', analysisData.success === true, `Success: ${analysisData.success}`);
    
    if (analysisData.rawAnalysis) {
      const usesCorrectBAL = analysisData.rawAnalysis.includes('BAL 19') || analysisData.rawAnalysis.includes('BAL-19');
      const avoidsWrongBAL = !analysisData.rawAnalysis.includes('BAL 29') && !analysisData.rawAnalysis.includes('BAL-29');
      logTest('Uses correct BAL 19 rating', usesCorrectBAL && avoidsWrongBAL, 
        `BAL 19 found: ${usesCorrectBAL}, BAL 29 avoided: ${avoidsWrongBAL}`);
    }
    
    if (analysisData.results && analysisData.results.length > 0) {
      logTest('Returns analysis results', true, `${analysisData.results.length} documents analyzed`);
      
      const result = analysisData.results[0];
      if (result.standards) {
        const hasAS3959 = result.standards.some(s => s.includes('AS3959'));
        const hasNCC = result.standards.some(s => s.includes('NCC'));
        logTest('Includes relevant standards', hasAS3959 && hasNCC, 
          `AS3959: ${hasAS3959}, NCC: ${hasNCC}`);
      }
    }
  }
  
  // Test 7: Key Pages Load
  console.log('\n📱 TESTING KEY PAGES');
  const testPages = [
    '/test-openai',
    '/login', 
    '/new-project',
    '/dashboard'
  ];
  
  for (const page of testPages) {
    const pageTest = await testEndpoint(page);
    logTest(`${page} page loads`, pageTest.ok, `Status: ${pageTest.status}`);
  }
  
  // Final Summary
  console.log('\n📊 TEST SUMMARY');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
  
  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Next.js application is fully functional.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the details above.');
  }
  
  return results;
}

// Run tests if script is executed directly
if (typeof module !== 'undefined' && require.main === module) {
  runComprehensiveTests().catch(console.error);
}

module.exports = { runComprehensiveTests, testEndpoint };
