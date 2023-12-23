const { REST, Routes }  = require('discord.js')
const fs = require('fs');
const path = require('path');

const { token, applicationId, guildId } = require('./config.json');

const registerFile = require('./commands/register.js');
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

// const commands = [registerFile.data.toJSON()];
const commands = commandFiles.map(file => {
    const command = require(path.join(__dirname, 'commands', file));
    return command.data.toJSON();
});

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