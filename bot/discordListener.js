import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { parseCommand } from "./commandParser.js";

dotenv.config();

const allowedChannels = [
  process.env.NASTP_BMS_CHANNEL_ID,
  process.env.CHANNEL_ID,
  process.env.TEST_CHANNEL_ID
].filter(Boolean);

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
  ]
});

client.once("clientReady", () => {
  console.log("Discord bot connected");
  console.log("Listening channels:", allowedChannels);
});

client.on('messageCreate', async message => {
  
  console.log(`Received message in channel ${message.channel.id} from ${message.author.username}: ${message.content}`);

    if (message.author.bot) return;
    if (!allowedChannels.includes(message.channel.id)) return;

    const result = parseCommand(message);  // this triggers loginProfiles/logoutProfiles

    if (result === "CHECKED_IN") {
        console.log(`Checked in processed for ${message.author.username}`);
    } else if (result === "CHECKED_OUT") {
        console.log(`Checked out processed for ${message.author.username}`);
    }
});


export function startDiscordListener() {
  client.login(process.env.DISCORD_TOKEN);
}
