import fs from "fs-extra";
import path from "path";
import ps from "ps-node";
import { execSync } from "child_process";
import { launchChromeLogin, launchChromeLogout } from "./chromeLauncher.js";

const chromeUserData = "C:\\Users\\johnb\\AppData\\Local\\Google\\Chrome\\User Data";

const emailToProfile = {
  "flutter.apps.project@gmail.com": "Profile 20",
  "johnbrrighte7427206@gmail.com": "Profile 15"
};

async function sleep(ms){
  return new Promise(r => setTimeout(r, ms));
}

async function ensureFolderDeleted(folder){

  for (let i = 0; i < 8; i++) {
    try {
      fs.removeSync(folder);
      return true;
    } catch (e) {

      if (e.code !== "EBUSY") throw e;

      console.log("Folder locked, retrying...", i+1);

      await sleep(1000);
    }
  }

  console.log("Failed to delete after retries:", folder);
  return false;
}

export async function loginProfiles(accounts) {
  console.log("Logging in profiles...");

  for (const acc of accounts) {
    const profileDir = path.join(chromeUserData, emailToProfile[acc.email]);

    if (!fs.existsSync(profileDir)) {
      fs.mkdirSync(profileDir);
    }

    await launchChromeLogin({profileDir , profileName: emailToProfile[acc.email]});
  }
};

export async function logoutProfiles(accounts) {

  console.log("Logging out profiles...");

  for (const acc of accounts) {

    const profileName = emailToProfile[acc.email];
    if (!profileName) continue;

    const profileDir = path.join(chromeUserData, profileName);

    if (!fs.existsSync(profileDir)) continue;

    console.log("Closing Chrome for", profileName);

    // 🔴 Kill ONLY Chrome background processes
    try {
      execSync('taskkill /IM chrome.exe /T /F', { stdio:"ignore" });
    } catch {}

    // wait for Windows to release file locks
    await sleep(2500);

    // 🔴 delete only that profile folder
    const deleted = await ensureFolderDeleted(profileDir);

    if (deleted)
      console.log("Profile removed:", acc.email);
    else
      console.log("Could not remove profile:", acc.email);
  }
}
