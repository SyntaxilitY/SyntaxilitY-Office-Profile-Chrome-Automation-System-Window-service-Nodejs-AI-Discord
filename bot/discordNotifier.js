let clientRef = null;

export function registerClient(client) {
  clientRef = client;
}

export async function sendDiscordMessage(channelId, text) {
  if (!clientRef) return;

  try {
    const channel = await clientRef.channels.fetch(channelId);
    if (channel) {
      await channel.send(text);
    }
  } catch (err) {
    console.error("Discord notify error:", err.message);
  }
}