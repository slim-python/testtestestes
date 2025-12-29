const { connect } = require("puppeteer-real-browser");

const primeProfile = async () => {
  const { page, browser } = await connect({
    headless: false, // Visible window
    customConfig: {
      chromePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      userDataDir: "./chrome-profile",
    },
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-web-security", // NEW
      "--disable-features=VizDisplayCompositor", // NEW - real compositor
    ],
  });

  console.log("🔴 1. Chrome opened - DO NOT CLOSE");
  console.log("🔴 2. Manually goto https://studio.youtube.com");
  console.log("🔴 3. Login + interact 2-3 mins (click channels, scroll)");
  console.log("🔴 4. Type 'node test-headless.js' in NEW terminal");

  // Keep alive 5 mins for interaction
  await new Promise((r) => setTimeout(r, 300000));
  await browser.close();
};

primeProfile();
