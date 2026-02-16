import fs from "fs-extra";
import path from "path";
import { loginProfiles, logoutProfiles } from "../chrome/profileManager.js";

const configPath = path.resolve("config/accounts.json");

export function parseCommand(msg) {
  const config = fs.readJsonSync(configPath);

  if (msg.author.username.toLowerCase() !== config.owner.toLowerCase()) return null;

  const content = msg.content.toLowerCase();

  if (content.includes("checked in")) {
    loginProfiles(config.emails);
    return "CHECKED_IN";
  }

  if (content.includes("checked out")) {
    logoutProfiles(config.emails);
    return "CHECKED_OUT";
  }

  return null;
}
