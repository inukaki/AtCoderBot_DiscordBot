const { REST, Routes}  = require('discord.js')

const registerFile = require('./commands/register.js')

const { token, applicationId, guildId } = require('./config.json');

const commands = [registerFile.data.toJSON()];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(applicationId, guildId),
            { body: commands },
        );
        console.log('コマンドを登録しました。');
    } catch (error) {
        console.error('コマンドの登録中にエラーが発生しました:',error);
    }
})();