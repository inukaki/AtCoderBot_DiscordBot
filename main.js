// eventsフォルダから.jsを取得
const { interactionCreateEvents } = require('./events/interactionCreate.js');
const { readyEvents } = require('./events/ready.js');
const { guildCreateEvents } = require('./events/guildCreate.js');
const { sendShojinResults} = require('./events/sendShojinResults.js');
const { sendDailyProblems } = require('./events/sendDailyProblems.js');
const { sendContestNotification } = require('./events/sendContestNotification.js');


// discord.jsから必要な機能を取得
const { Client, GatewayIntentBits } = require('discord.js');

// config.jsonからトークンを取得
const { token } = require('./config.json');
const guildCreate = require('./events/guildCreate.js');

const client = new Client(
  { intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  }
);


interactionCreateEvents(client);
readyEvents(client);
guildCreateEvents(client);
sendShojinResults(client);
sendDailyProblems(client);
sendContestNotification(client);
client.login(token);
  