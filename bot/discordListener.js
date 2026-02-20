import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { parseCommand } from "./commandParser.js";
import { registerClient } from "./discordNotifier.js";
import { checkoutReply, checkinReply } from "./humanReplies.js";


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
  registerClient(client);
});

client.on('messageCreate', async message => {

  console.log(
    `Received message in channel ${message.channel.id} from ${message.author.username}: ${message.content}`
  );

  if (message.author.bot) return;
  if (!allowedChannels.includes(message.channel.id)) return;

  const command = await parseCommand(message);
  if (!command) return;

  const user = message.author.username;

  if (command.type === "OUT") {

    const removed = command.result?.removed || [];

    const replyText = checkoutReply(user, removed);

    await message.reply(replyText);

    console.log(`Checked out processed for ${user}`);
  }

  if (command.type === "IN") {

    const logged = command.result?.logged || [];

    const replyText = checkinReply(user, logged);

    await message.reply(replyText);

    console.log(`Checked in processed for ${user}`);
  }
});

export function startDiscordListener() {
  client.login(process.env.DISCORD_TOKEN);
}
