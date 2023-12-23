// commandフォルダからregister.jsを取得
const registerFile = require('./commands/register.js')
// discord.jsから必要な機能を取得
const { Client, GatewayIntentBits } = require('discord.js');

const cron = require('node-cron');

// config.jsonからトークンを取得
const { token } = require('./config.json');
const unregisterFile = require('./commands/unregister.js');

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

    // チャンネルIDを指定
    const channelId = '1185099222257762397';
    const channel = client.channels.cache.get(channelId);  

    // 毎週日曜日の21時に実行されるイベント
    // スケジュール表現は左から、分、時、日、月、曜日に対応している
    cron.schedule('* * 21 * * 0', async () => {
      channel.send('毎週日曜日21時にメッセージを送信するよ♪');
      console.log('毎週日曜日21時にメッセージを送信するよ♪');
    }
    );
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
    }else if(interaction.commandName === unregisterFile.data.name){
      try{
        console.log('unregisterコマンドが実行されました。');
        await unregisterFile.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply('コマンドの実行中にエラーが発生しました。');
      }
    }else{
      await interaction.reply('そのコマンドは存在しません。');
    }
  });  

  
client.login(token);
  