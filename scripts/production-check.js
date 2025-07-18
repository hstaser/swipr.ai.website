#!/usr/bin/env node

/**
 * Production Readiness Check Script
 * Verifies that all systems are ready for production deployment
 */

import fs from "fs";
import path from "path";

console.log("🚀 Starting Production Readiness Check...\n");

const checks = [];

// Check 1: Verify all required API endpoints exist
console.log("1. Checking API endpoints...");
const apiEndpoints = [
  "api/jobs/apply.js",
  "api/contact.js",
  "api/waitlist.js",
  "api/admin/dashboard.js",
  "api/lib/storage.js",
];

let apiCheckPassed = true;
apiEndpoints.forEach((endpoint) => {
  if (fs.existsSync(endpoint)) {
    console.log(`   ✅ ${endpoint}`);
  } else {
    console.log(`   ❌ ${endpoint} - Missing`);
    apiCheckPassed = false;
  }
});

checks.push({ name: "API Endpoints", passed: apiCheckPassed });

// Check 2: Verify frontend pages exist
console.log("\n2. Checking frontend pages...");
const frontendPages = [
  "client/pages/Index.tsx",
  "client/pages/Apply.tsx",
  "client/pages/LearnMore.tsx",
  "client/pages/AdminDashboard.tsx",
  "client/pages/Privacy.tsx",
  "client/pages/NotFound.tsx",
];

let frontendCheckPassed = true;
frontendPages.forEach((page) => {
  if (fs.existsSync(page)) {
    console.log(`   ✅ ${page}`);
  } else {
    console.log(`   ❌ ${page} - Missing`);
    frontendCheckPassed = false;
  }
});

checks.push({ name: "Frontend Pages", passed: frontendCheckPassed });

// Check 3: Verify configuration files
console.log("\n3. Checking configuration files...");
const configFiles = [
  "vercel.json",
  "package.json",
  "tsconfig.json",
  "tailwind.config.ts",
  "vite.config.ts",
];

let configCheckPassed = true;
configFiles.forEach((config) => {
  if (fs.existsSync(config)) {
    console.log(`   ✅ ${config}`);
  } else {
    console.log(`   ❌ ${config} - Missing`);
    configCheckPassed = false;
  }
});

checks.push({ name: "Configuration Files", passed: configCheckPassed });

// Check 4: Verify package.json has required dependencies
console.log("\n4. Checking package.json dependencies...");
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const requiredDeps = [
  "react",
  "react-dom",
  "react-router-dom",
  "vite",
  "typescript",
  "@tanstack/react-query",
];

let depsCheckPassed = true;
requiredDeps.forEach((dep) => {
  if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
    console.log(`   ✅ ${dep}`);
  } else {
    console.log(`   ❌ ${dep} - Missing`);
    depsCheckPassed = false;
  }
});

checks.push({ name: "Dependencies", passed: depsCheckPassed });

// Check 5: Verify vercel.json configuration
console.log("\n5. Checking Vercel configuration...");
const vercelConfig = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
let vercelCheckPassed = true;

if (vercelConfig.functions?.["api/**/*.js"]?.runtime) {
  console.log(
    `   ✅ Runtime specified: ${vercelConfig.functions["api/**/*.js"].runtime}`,
  );
} else {
  console.log("   ❌ No runtime specified for API functions");
  vercelCheckPassed = false;
}

if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
  console.log("   ✅ Rewrites configured");
} else {
  console.log("   ❌ No rewrites configured");
  vercelCheckPassed = false;
}

checks.push({ name: "Vercel Configuration", passed: vercelCheckPassed });

// Check 6: Verify analytics system
console.log("\n6. Checking analytics system...");
let analyticsCheckPassed = true;

if (fs.existsSync("client/lib/analytics.ts")) {
  const analyticsContent = fs.readFileSync("client/lib/analytics.ts", "utf8");
  if (analyticsContent.includes("trackPageView")) {
    console.log("   ✅ Analytics system exists with page tracking");
  } else {
    console.log("   ❌ Analytics system incomplete");
    analyticsCheckPassed = false;
  }
} else {
  console.log("   ❌ Analytics system missing");
  analyticsCheckPassed = false;
}

if (fs.existsSync("api/analytics/track.js")) {
  console.log("   ✅ Analytics API endpoint exists");
} else {
  console.log("   ❌ Analytics API endpoint missing");
  analyticsCheckPassed = false;
}

checks.push({ name: "Analytics System", passed: analyticsCheckPassed });

// Check 7: Verify form validation
console.log("\n7. Checking form validation...");
const applyPageContent = fs.readFileSync("client/pages/Apply.tsx", "utf8");
let formValidationPassed = true;

if (applyPageContent.includes("validateField")) {
  console.log("   ✅ Form validation implemented");
} else {
  console.log("   ❌ Form validation missing");
  formValidationPassed = false;
}

if (applyPageContent.includes("validationErrors")) {
  console.log("   ✅ Error handling implemented");
} else {
  console.log("   ❌ Error handling missing");
  formValidationPassed = false;
}

checks.push({ name: "Form Validation", passed: formValidationPassed });

// Summary
console.log("\n" + "=".repeat(50));
console.log("PRODUCTION READINESS SUMMARY");
console.log("=".repeat(50));

let allChecksPassed = true;
checks.forEach((check) => {
  const status = check.passed ? "✅ PASS" : "❌ FAIL";
  console.log(`${status} - ${check.name}`);
  if (!check.passed) allChecksPassed = false;
});

console.log("\n" + "=".repeat(50));

if (allChecksPassed) {
  console.log("🎉 ALL CHECKS PASSED! Ready for production deployment.");
  console.log("\nNext steps:");
  console.log("1. Commit and push all changes to GitHub");
  console.log("2. Deploy to Vercel");
  console.log("3. Configure custom domain (swipr.ai)");
  console.log("4. Test all functionality on live site");
  console.log("5. Monitor logs and analytics");
} else {
  console.log("⚠️  SOME CHECKS FAILED! Please fix issues before deploying.");
  process.exit(1);
}

console.log("\n🚀 Production check complete!");
