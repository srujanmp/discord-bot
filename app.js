require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, REST } = require('discord.js');
const cron = require('node-cron');
const questions = require('./blind75.json');

// Create Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// Helper function to get today's question
function getTodaysQuestion() {
  const today = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const index = today % questions.length;
  return questions[index];
}

// Post daily problem at 6:00 AM IST
client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // Register slash command (/today)
  const command = new SlashCommandBuilder()
    .setName('today')
    .setDescription("📅 Show today's LeetCode Daily Challenge");

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_APP_ID),
      { body: [command.toJSON()] }
    );
    console.log('✅ Slash command /today registered');
  } catch (error) {
    console.error('❌ Error registering slash command:', error);
  }

  // Daily message cron at 6:00 AM IST
  cron.schedule('0 6 * * *', async () => {
    const channelIds = process.env.CHANNEL_IDS.split(',');
    const q = getTodaysQuestion();

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

// Handle /today slash command (no "Did you solve" line)
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === 'today') {
    const q = getTodaysQuestion();
    await interaction.reply({
      content:
        `**LeetCode Daily Challenge #${q.id}**\n` +
        `📂 Category: **${q.category}**\n` +
        `🔗 [${q.name}](${q.link})`
    });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
