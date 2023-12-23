const { REST, Routes }  = require('discord.js')
const fs = require('fs');
const path = require('path');

const { token, applicationId, guildId } = require('./config.json');

// commandsフォルダからコマンドを取得 .jsファイルのみを取得
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

// コマンドを登録するためのJsonデータを作成
const commands = commandFiles.map(file => {
    const command = require(path.join(__dirname, 'commands', file));
    return command.data.toJSON();
});

const rest = new REST({ version: '10' }).setToken(token);

// 即実行関数　定義と同時に実行
(async () => {
    try {
        // REST APIを使ってコマンドを登録
        await rest.put(
            // コマンドを登録するAPIのエンドポイントを作成
            Routes.applicationGuildCommands(applicationId, guildId),
            // コマンドのリストをリクエストボディに設定
            { body: commands },
        );
        console.log('コマンドを登録しました。');
    } catch (error) {
        console.error('コマンドの登録中にエラーが発生しました:',error);
    }
})();