require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const questions = require('./blind75.json');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  cron.schedule('19 9 * * *', async () => {
    const channelIds = process.env.CHANNEL_IDS.split(',');

    const today = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const index = today % questions.length;
    const q = questions[index];

    for (const channelId of channelIds) {
      try {
        const channel = await client.channels.fetch(channelId.trim());
        if (!channel) {
          console.error(`❌ Channel not found: ${channelId}`);
          continue;
        }

        const message = await channel.send({
          content:
            `**LeetCode Daily Challenge #${q.id}**\n` +
            `📂 Category: **${q.category}**\n` +
            `🔗 [${q.name}](${q.link})\n\n` +
            `✅ **Did you solve it?** React below!`
        });

        await message.react('✅');
        await message.react('❌');
      } catch (error) {
        console.error(`Error sending to channel ${channelId}:`, error);
      }
    }
  }, {
    timezone: 'Asia/Kolkata'
  });
});

client.login(process.env.DISCORD_BOT_TOKEN);
