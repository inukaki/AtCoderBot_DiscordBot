// commandフォルダからregister.jsを取得
const registerFile = require('./commands/register.js')
// discord.jsから必要な機能を取得
const { Client, GatewayIntentBits } = require('discord.js');
// config.jsonからトークンを取得
const { token } = require('./config.json');

const client = new Client(
  { intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  }
);

// botを起動したときに実行されるイベント
client.on('ready', () => {
    console.log('ボットが起動したよ');
  });

// コマンドが実行されたときに実行されるイベント
client.on('interactionCreate', async (interaction) => {

    //　コマンドにスラッシュがついていない場合は処理を終了
    if(!interaction.isChatInputCommand()) return;

    // registerコマンドが実行されたときに実行される処理
    if(interaction.commandName === registerFile.data.name) {
      try {
        // register.jsのexecute関数を実行
        console.log('registerコマンドが実行されました。');
        await registerFile.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply('コマンドの実行中にエラーが発生しました。');
      }
    }else{
      await interaction.reply('そのコマンドは存在しません。');
    }
  });  


client.login(token);
  