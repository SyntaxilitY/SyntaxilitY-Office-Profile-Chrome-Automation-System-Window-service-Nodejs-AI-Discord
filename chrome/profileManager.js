import fs from "fs-extra";
import path from "path";
import ps from "ps-node";
import { execSync } from "child_process";
import { launchChromeLogin } from "./chromeLauncher.js";
import { sendDiscordMessage } from "../bot/discordNotifier.js";


const chromeUserData = "C:\\Users\\johnb\\AppData\\Local\\Google\\Chrome\\User Data";


async function sleep(ms){
  return new Promise(r => setTimeout(r, ms));
}

function getProfileFolderByEmail(email) {

  try {
    const localStatePath = path.join(chromeUserData, "Local State");
    const state = fs.readJsonSync(localStatePath);

    const profiles = state.profile?.info_cache || {};

    for (const folder in profiles) {
      const profile = profiles[folder];

      // Chrome stores email in different keys depending on login state
      const profileEmail =
        profile.user_name ||
        profile.account_info?.[0]?.email ||
        "";

      if (profileEmail.toLowerCase() === email.toLowerCase()) {
        return folder; // e.g. "Profile 21"
      }
    }

  } catch (e) {
    console.log("Could not read Chrome Local State:", e.message);
  }

  return null;
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
    
    const detectedProfile = getProfileFolderByEmail(acc.email);

    if (!detectedProfile) {
      console.log("No Chrome profile found for:", acc.email);
      failed.push(acc.email);
      continue;
    }

    const profileDir = path.join(chromeUserData, detectedProfile);

    if (!fs.existsSync(profileDir)) {
      fs.mkdirSync(profileDir);
    }

    await launchChromeLogin({profileDir , profileName: emailToProfile[acc.email]});
  }
};

export async function logoutProfiles(accounts) {

  console.log("Logging out profiles...");
  console.log("accounts:", accounts);

  const removed = [];
  const failed = [];

  for (const acc of accounts) {

    const detectedProfile = getProfileFolderByEmail(acc.email);

    if (!detectedProfile) {
      console.log("No Chrome profile found for:", acc.email);
      failed.push(acc.email);
      continue;
    }

    const profileDir = path.join(chromeUserData, detectedProfile);

    console.log(`Detected profile ${detectedProfile} for ${acc.email}`);

    if (!fs.existsSync(profileDir)) {
      console.log("Profile folder missing:", profileDir);
      failed.push(acc.email);
      continue;
    }

    console.log("Closing Chrome before deletion...");

    try {
      execSync('taskkill /IM chrome.exe /T /F', { stdio:"ignore" });
    } catch {}

    await sleep(2500);

    const deleted = await ensureFolderDeleted(profileDir);

    if (deleted) {
      removed.push(`${acc.email} (${detectedProfile})`);
      console.log("Profile removed:", acc.email);
    } else {
      failed.push(acc.email);
      console.log("Could not remove profile:", acc.email);
    }
  }

  return { removed, failed };
}
