const fs = require("fs");
const { connect } = require("puppeteer-real-browser");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const start = async () => {
  const args = process.argv.slice(2);
  const VIDEO_ID = args[0] || "Bbdmk1B9Rhw";
  console.log(`Using VIDEO_ID: ${VIDEO_ID}`);

  // return;

  const { page, browser } = await connect({
    // headless: true,
    customConfig: {
      chromePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      userDataDir: "./chrome-profile", // ⚠️ SINGLE CHANGE HERE
    },
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1440, height: 900 });

  // const cookies = JSON.parse(fs.readFileSync("./cookies.json", "utf8"));
  // const filteredCookies = cookies.map((cookie) => {
  //   if (cookie.sameSite === null) {
  //     // Remove sameSite ONLY when null
  //     const { sameSite, ...cleanCookie } = cookie;
  //     return cleanCookie;
  //   }
  //   return cookie; // Keep everything if sameSite has value
  // });

  // console.log(filteredCookies);

  // try {
  //   await page.setCookie(...filteredCookies);
  // } catch (error) {
  //   console.error("Error setting cookies:", error);
  // }

  await page.goto("https://www.youtube.com/", {
    waitUntil: "domcontentloaded",
  });

  await page.reload({
    waitUntil: "networkidle2",
    timeout: 5000,
  });

  // await page.setCookie(...filteredCookies);

  // return;
  // 3. Reload to apply cookies
  await page.goto("https://www.youtube.com", {
    waitUntil: "networkidle2",
    timeout: 30000,
  });

  await wait(2000);

  // 4. Verify you're logged in
  const title = await page.title();
  console.log("Page title:", title);

  // 3. Reload to apply cookies
  //   await page.goto('https://www.youtube.com', {
  //     waitUntil: 'networkidle2',
  //     timeout: 2000
  //   });

  return;
  await page.goto("https://studio.youtube.com");
  await wait(2000);
  await page.goto(
    `https://studio.youtube.com/video/${VIDEO_ID}/monetization/ads`
  );
  await wait(2000);

  await page.waitForSelector(
    'ytcp-icon-button[aria-label="Edit video monetisation status"][role="button"]',
    { visible: true }
  );

  // Click the dropdown chevron
  await page.click(
    'ytcp-icon-button[aria-label="Edit video monetisation status"][role="button"]'
  );

  await wait(2000);

  // click on on radio button
  await page.click(
    "ytcp-video-monetization-edit-dialog tp-yt-paper-radio-button#radio-on"
  );

  await page.waitForSelector("ytcp-button#save-button", { visible: true });

  await wait(2000);

  // Click Save button
  await page.evaluate(() => {
    const host = document.querySelector("ytcp-button#save-button");
    if (!host) return;
    const realButton = host.querySelector("button");
    if (realButton) realButton.click();
  });

  await wait(2000);
  // Wait for the checkbox to be in the DOM
  await page.waitForSelector(
    'div[role="checkbox"][aria-label="None of the above"]',
    {
      visible: true,
    }
  );

  // Click it
  await page.click('div[role="checkbox"][aria-label="None of the above"]');
  await wait(2000);
  // Wait for the Submit button to be enabled
  await page.waitForSelector(
    'button[aria-label="Submit"][aria-disabled="false"]',
    {
      visible: true,
    }
  );

  await page.click('button[aria-label="Submit"][aria-disabled="false"]');

  // Wait until the Save button is rendered and enabled
  await page.waitForSelector(
    'button[aria-label="Save"][aria-disabled="false"]',
    {
      visible: true,
    }
  );

  await wait(2000);
  // Click it
  await page.click('button[aria-label="Save"][aria-disabled="false"]');

  // Screenshot for verification
  //   await page.screenshot({ path: 'youtube-studio.png', fullPage: true });

  // Get page text if needed
  const text = await page.evaluate(() =>
    document.body.innerText.slice(0, 2000)
  );
  console.log("YouTube Studio loaded:", text.substring(0, 500) + "...");

  // Keep open for 30s to check manually (remove for headless)
  // await page.waitForTimeout(30000);

  await browser.close();
};

start().catch(console.error);
