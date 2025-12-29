// test-headless.js
const { connect } = require("puppeteer-real-browser");

const test = async () => {
  const { page, browser } = await connect({
    headless: true,
    customConfig: {
      chromePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      userDataDir: "./chrome-profile", // Same profile!
    },
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled", // Hide puppeteer
      "--disable-web-security",
    ],
  });

  await page.goto("https://studio.youtube.com");
  const isLoggedIn = await page
    .waitForSelector("#avatar-btn", { timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  console.log("✅ AUTO-LOGIN SUCCESS:", isLoggedIn);
  await page.screenshot({ path: "proof.png" }); // Visual proof

  await browser.close();
};

test();
