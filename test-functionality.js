const fs = require("fs");
const path = require("path");

// Test Results
const results = {
  passed: [],
  failed: [],
  warnings: [],
};

function log(message, type = "info") {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
}

function addResult(test, passed, message) {
  if (passed) {
    results.passed.push({ test, message });
    log(`✅ PASS: ${test} - ${message}`, "pass");
  } else {
    results.failed.push({ test, message });
    log(`❌ FAIL: ${test} - ${message}`, "fail");
  }
}

function addWarning(test, message) {
  results.warnings.push({ test, message });
  log(`⚠️  WARN: ${test} - ${message}`, "warn");
}

// Test 1: Check if core files exist
log("Starting functionality tests...", "info");

// Test Next.js configuration
const nextConfigPath = "next.config.ts";
const nextConfigExists = fs.existsSync(nextConfigPath);
addResult(
  "Next.js Config",
  nextConfigExists,
  nextConfigExists ? "next.config.ts exists" : "next.config.ts missing",
);

// Test package.json
const packageJsonPath = "package.json";
const packageJsonExists = fs.existsSync(packageJsonPath);
if (packageJsonExists) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  addResult("Package.json", true, "package.json exists and is valid JSON");

  // Check for required dependencies
  const requiredDeps = ["next", "react", "react-dom"];
  const missingDeps = requiredDeps.filter(
    (dep) =>
      !packageJson.dependencies[dep] && !packageJson.devDependencies[dep],
  );

  if (missingDeps.length === 0) {
    addResult("Dependencies", true, "All required dependencies present");
  } else {
    addResult(
      "Dependencies",
      false,
      `Missing dependencies: ${missingDeps.join(", ")}`,
    );
  }
} else {
  addResult("Package.json", false, "package.json missing");
}

// Test core application files
const coreFiles = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/components/NewProject.tsx",
  "app/components/CurrentProjects.tsx",
  "app/components/HomePage.tsx",
  "app/lib/ncc-service.ts",
  "app/contexts/AuthContext.tsx",
];

coreFiles.forEach((file) => {
  const exists = fs.existsSync(file);
  addResult(`File: ${file}`, exists, exists ? "File exists" : "File missing");
});

// Test API routes
const apiRoutes = [
  "app/api/openai/route.ts",
  "app/api/ncc-data/route.ts",
  "app/api/analyze/route.ts",
];

apiRoutes.forEach((route) => {
  const exists = fs.existsSync(route);
  addResult(
    `API: ${route}`,
    exists,
    exists ? "API route exists" : "API route missing",
  );
});

// Test specific functionality implementations
log("Testing specific implementations...", "info");

// Test NewProject.tsx for proper class format
const newProjectPath = "app/components/NewProject.tsx";
if (fs.existsSync(newProjectPath)) {
  const content = fs.readFileSync(newProjectPath, "utf8");

  // Test building classification format
  const hasClassFormat =
    content.includes("Class 1a") && content.includes("Class 9a");
  addResult(
    "Building Classification Format",
    hasClassFormat,
    hasClassFormat
      ? 'Uses proper "Class X" format'
      : 'Still uses old "class-x" format',
  );

  // Test color scheme (planning=green, building=red, plumbing=blue)
  const hasGreenPlanning =
    content.includes("planning") && content.includes("bg-green-600");
  const hasRedBuilding =
    content.includes("building") && content.includes("bg-red-600");
  const hasBluePlumbing =
    content.includes("plumbing") && content.includes("bg-blue-600");

  addResult(
    "Color Scheme - Planning Green",
    hasGreenPlanning,
    hasGreenPlanning
      ? "Planning uses green colors"
      : "Planning does not use green colors",
  );
  addResult(
    "Color Scheme - Building Red",
    hasRedBuilding,
    hasRedBuilding
      ? "Building uses red colors"
      : "Building does not use red colors",
  );
  addResult(
    "Color Scheme - Plumbing Blue",
    hasBluePlumbing,
    hasBluePlumbing
      ? "Plumbing uses blue colors"
      : "Plumbing does not use blue colors",
  );

  // Test AI analysis type implementation
  const hasAIAnalysisType =
    content.includes("aiAnalysisType") &&
    content.includes("planning") &&
    content.includes("building") &&
    content.includes("plumbing");
  addResult(
    "AI Analysis Type",
    hasAIAnalysisType,
    hasAIAnalysisType
      ? "AI analysis type functionality implemented"
      : "AI analysis type functionality missing",
  );

  // Test automatic NCC volume population
  const hasAutoNCCVolume =
    content.includes("useEffect") &&
    content.includes("getNCCVolume") &&
    content.includes("generateNCCAnalysisPrompt");
  addResult(
    "Auto NCC Volume",
    hasAutoNCCVolume,
    hasAutoNCCVolume
      ? "Automatic NCC volume population implemented"
      : "Automatic NCC volume population missing",
  );
} else {
  addResult(
    "NewProject Analysis",
    false,
    "NewProject.tsx not found for analysis",
  );
}

// Test CurrentProjects.tsx for color scheme
const currentProjectsPath = "app/components/CurrentProjects.tsx";
if (fs.existsSync(currentProjectsPath)) {
  const content = fs.readFileSync(currentProjectsPath, "utf8");

  const hasCorrectColors =
    content.includes("bg-green-100") &&
    content.includes("bg-red-100") &&
    content.includes("bg-blue-100");
  addResult(
    "CurrentProjects Colors",
    hasCorrectColors,
    hasCorrectColors
      ? "CurrentProjects uses correct color scheme"
      : "CurrentProjects color scheme needs update",
  );
} else {
  addResult(
    "CurrentProjects Analysis",
    false,
    "CurrentProjects.tsx not found for analysis",
  );
}

// Test HomePage.tsx for navigation (should not have sidebar)
const homePagePath = "app/components/HomePage.tsx";
if (fs.existsSync(homePagePath)) {
  const content = fs.readFileSync(homePagePath, "utf8");

  // HomePage should not have sidebar navigation
  const hasSidebar =
    content.includes("sidebar") || content.includes("NavigationSidebar");
  addResult(
    "HomePage Navigation",
    !hasSidebar,
    !hasSidebar
      ? "HomePage correctly has no sidebar navigation"
      : "HomePage incorrectly includes sidebar navigation",
  );

  // Test color scheme in HomePage
  const hasCorrectHomepageColors =
    content.includes("bg-green-100") &&
    content.includes("bg-red-100") &&
    content.includes("bg-blue-100");
  addResult(
    "HomePage Colors",
    hasCorrectHomepageColors,
    hasCorrectHomepageColors
      ? "HomePage uses correct color scheme"
      : "HomePage color scheme needs update",
  );
} else {
  addResult("HomePage Analysis", false, "HomePage.tsx not found for analysis");
}

// Test NCC Service
const nccServicePath = "app/lib/ncc-service.ts";
if (fs.existsSync(nccServicePath)) {
  const content = fs.readFileSync(nccServicePath, "utf8");

  // Test for Class format support
  const supportsClassFormat =
    content.includes("Class 1") && content.includes("Class 10");
  addResult(
    "NCC Service Class Format",
    supportsClassFormat,
    supportsClassFormat
      ? "NCC service supports proper Class format"
      : "NCC service needs Class format update",
  );

  // Test for all analysis types
  const supportsAllTypes =
    content.includes("planning") &&
    content.includes("building") &&
    content.includes("plumbing");
  addResult(
    "NCC Service Analysis Types",
    supportsAllTypes,
    supportsAllTypes
      ? "NCC service supports all analysis types"
      : "NCC service missing analysis types",
  );
} else {
  addResult(
    "NCC Service Analysis",
    false,
    "NCC service not found for analysis",
  );
}

// Test environment configuration
if (fs.existsSync(".env")) {
  const envContent = fs.readFileSync(".env", "utf8");
  const hasOpenAI = envContent.includes("OPENAI_API_KEY");
  addResult(
    "OpenAI Configuration",
    hasOpenAI,
    hasOpenAI ? "OpenAI API key configured" : "OpenAI API key missing",
  );
} else {
  addWarning(
    "Environment",
    ".env file not found - using environment variables",
  );
}

// Test TypeScript configuration
const tsconfigPath = "tsconfig.json";
if (fs.existsSync(tsconfigPath)) {
  try {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
    addResult("TypeScript Config", true, "tsconfig.json exists and is valid");
  } catch (e) {
    addResult("TypeScript Config", false, "tsconfig.json is invalid JSON");
  }
} else {
  addResult("TypeScript Config", false, "tsconfig.json missing");
}

// Final summary
log("Test Summary:", "info");
log(`✅ Passed: ${results.passed.length}`, "info");
log(`❌ Failed: ${results.failed.length}`, "info");
log(`⚠️  Warnings: ${results.warnings.length}`, "info");

if (results.failed.length > 0) {
  log("Failed Tests:", "info");
  results.failed.forEach((fail) =>
    log(`  - ${fail.test}: ${fail.message}`, "fail"),
  );
}

if (results.warnings.length > 0) {
  log("Warnings:", "info");
  results.warnings.forEach((warn) =>
    log(`  - ${warn.test}: ${warn.message}`, "warn"),
  );
}

const totalTests = results.passed.length + results.failed.length;
const passRate =
  totalTests > 0 ? ((results.passed.length / totalTests) * 100).toFixed(1) : 0;
log(`Pass Rate: ${passRate}%`, "info");

// Exit with appropriate code
process.exit(results.failed.length > 0 ? 1 : 0);
