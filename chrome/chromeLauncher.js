import puppeteer from "puppeteer-core";
import dotenv from "dotenv";

dotenv.config();

export async function launchChromeLogin({ profileDir , profileName }) {

  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH,
    headless: false,
    userDataDir: profileDir,
    args: [
      `--profile-directory=${profileName}`,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--start-maximized"
    ],
    defaultViewport: null,
    ignoreDefaultArgs: ["--enable-automation"],  // suppress automation warnings
    ignoreHTTPSErrors: true,                     // optional
    dumpio: false                                // turn off DevTools logging
  });

  const page = await browser.newPage();

  await page.goto("https://mail.google.com", {
    waitUntil: "domcontentloaded"
  });

  console.log("Chrome launched successfully");
}

export async function launchChromeLogout({ profileDir , profileName }) {

  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH,
    headless: false,
    userDataDir: profileDir,
    args: [
      `--profile-directory=${profileName}`,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--start-maximized"
    ],
    defaultViewport: null,
    ignoreDefaultArgs: ["--enable-automation"],  // suppress automation warnings
    ignoreHTTPSErrors: true,                     // optional
    dumpio: false                                // turn off DevTools logging
  });

  const page = await browser.newPage();

  await page.goto(
    "https://accounts.google.com/Logout?hl=en&continue=https://mail.google.com&service=mail&logout",
    { waitUntil: "networkidle2" }
  );

  console.log("Google account logged out");

  // optional: close after logout
  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
}


