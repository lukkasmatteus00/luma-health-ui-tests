import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { execSync } from "child_process";

const runCodeStr = process.argv[2];

if (!runCodeStr) {
  console.error(
    "❌ You must provide a suite. Example: 'e2e' or 'mobile:-chrome'"
  );
  process.exit(1);
}

const args = runCodeStr.split(":");
const suiteAlias = args[0].toLowerCase();
let headedFlag = null;
let browserAlias = null;

for (let i = 1; i < args.length; i++) {
  const arg = args[i].toLowerCase();
  if (arg === "nh" || arg === "headless") {
    headedFlag = "nh";
  } else if (arg.startsWith("-")) {
    browserAlias = arg.substring(1);
  } else {
    console.warn(`⚠ Unknown argument ignored: ${arg}`);
  }
}

function loadSuites() {
  const suiteFilePath = resolve("./cypress/suites.json");
  if (!existsSync(suiteFilePath)) {
    console.error(`❌ suites.json not found at path: ${suiteFilePath}`);
    process.exit(1);
  }
  try {
    return JSON.parse(readFileSync(suiteFilePath, "utf-8"));
  } catch (err) {
    console.error("❌ Failed to parse suites.json:", err.message);
    process.exit(1);
  }
}

function getSpecPatternFromSuite(suites, alias) {
  const folder = suites[alias];
  if (folder === undefined) return null;

  switch (folder) {
    case "e2e":
      return "e2e/*.{cy,spec}.js";
    case "mobile":
    case "tablet":
    case "desktop":
      return "responsiveness/*.{cy,spec}.js";
    default:
      return folder;
  }
}

function determineBrowser(alias = "") {
  switch (alias) {
    case "edge":
      return "edge";
    case "ff":
    case "firefox":
      return "firefox";
    case "electron":
      return "electron";
    case "chrome":
      return "chrome";
    default:
      return "electron";
  }
}

function shouldRunHeaded(flag) {
  if (!flag) return true;
  return !(flag === "nh" || flag === "headless");
}

function buildCypressCommand(specGlob, browser, isHeaded) {
  let command = `cypress run --spec "cypress/${specGlob}" --browser ${browser}`;
  if (isHeaded) command += " --headed";

  let envPrefix = "";
  if (suiteAlias === "mobile") envPrefix = "IS_MOBILE=true";
  if (suiteAlias === "tablet") envPrefix = "IS_TABLET=true";

  if (envPrefix) {
    command = `npx cross-env ${command} --env ${envPrefix}`;
  }

  return command;
}

const suites = loadSuites();
const specPattern = getSpecPatternFromSuite(suites, suiteAlias);

if (!specPattern) {
  console.error(`❌ Suite alias '${suiteAlias}' not found in suites.json`);
  console.error(`Available suites: ${Object.keys(suites).join(", ")}`);
  process.exit(1);
}

const browser = determineBrowser(browserAlias);
const isHeaded = shouldRunHeaded(headedFlag);
const command = buildCypressCommand(specPattern, browser, isHeaded);

console.log("\n🚀 Running Cypress with:");
console.log("▶ Suite alias:", suiteAlias);
console.log("▶ Specs:", `cypress/${specPattern}`);
console.log("▶ Browser:", browser);
console.log("▶ Headed:", isHeaded ? "Yes" : "No (headless)");
console.log("▶ Command:", command, "\n");

try {
  execSync(command, { stdio: "inherit" });
} catch (err) {
  console.error(
    "\n❗ Cypress exited with an error. Some tests may have failed."
  );
  process.exit(1);
}
