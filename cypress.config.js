import { defineConfig } from "cypress";
import {
  beforeRunHook,
  afterRunHook,
} from "cypress-mochawesome-reporter/lib/index.js";
import { execSync as exec } from "child_process";
import { existsSync } from "fs";
import { resolve } from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const rimraf = require("rimraf");
const { sync } = rimraf;

const DEFAULT_TIME_OUT = 30000;

export default defineConfig({
  defaultCommandTimeout: 10000,
  pageLoadTimeout: DEFAULT_TIME_OUT,
  requestTimeout: DEFAULT_TIME_OUT,
  numTestsKeptInMemory: 0,
  viewportWidth: 1920,
  viewportHeight: 1080,
  experimentalMemoryManagement: true,
  chromeWebSecurity: false,
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    reporterEnabled: "cypress-mochawesome-reporter, mocha-junit-reporter",
    cypressMochawesomeReporterReporterOptions: {
      reportDir: "cypress/reports_html",
      reportFilename: "[datetime]-report",
      timestamp: true,
      overwrite: false,
      charts: true,
      reportPageTitle: "Automation Test Run",
      embeddedScreenshots: true,
      inlineAssets: true,
    },
    mochaJunitReporterReporterOptions: {
      mochaFile: "cypress/reports/junit/results-[hash].xml",
    },
  },
  e2e: {
    async setupNodeEvents(on, config) {
      on("before:run", async (details) => {
        console.log("🔧 [Hook] before:run");
        await beforeRunHook(details);

        const screenshotsPath = resolve("cypress/screenshots");
        const videosPath = resolve("cypress/videos");
        const reportsPath = resolve("cypress/reports");
        if (existsSync(screenshotsPath)) {
          console.log("🧹 Deleting screenshots...");
          sync(screenshotsPath);
        }
        if (existsSync(reportsPath)) {
          console.log("🧹 Deleting reports...");
          sync(reportsPath);
        }
        if (existsSync(videosPath)) {
          console.log("🧹 Deleting videos...");
          sync(videosPath);
        }
      });
      on("after:run", async () => {
        console.log("🔧 [Hook] after:run");
        try {
          console.log("📊 Generating Mochawesome JSON report...");
          exec(
            "npx mochawesome-merge ./cypress/reports_html/.jsons/*.json -o ./cypress/reports/mocha-report.json",
            { stdio: "inherit" }
          );
        } catch (err) {
          console.error("⚠ Error to generate reports:", err.message);
        }
        await afterRunHook();
      });

      if (config.env.IS_MOBILE) {
        config.viewportWidth = 412;
        config.viewportHeight = 915;
        console.log("📱 Viewport set for responsive mode (412x915)");
      }

      if (config.env.IS_TABLET) {
        config.viewportWidth = 1024;
        config.viewportHeight = 1366;
        console.log("📱 Viewport set for responsive mode (1024x1366)");
      }
      return config;
    },
    specPattern: "cypress/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    testIsolation: false,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    baseUrl: "https://www.lumahealth.io",
  },
});
