// commandフォルダから.jsを取得
// const registerFile = require('../commands/register.js')
// const unregisterFile = require('../commands/unregister.js');

const fs = require('fs');
const path = require('path');

const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));

// コマンドを登録するためのJsonデータを作成
const commands = {};
for(const file of commandFiles){
    const command = require(path.join(__dirname, '../commands', file));
    commands[command.data.name] = command;
}

module.exports = {
    interactionCreateEvents: function(client){

        // コマンドが実行されたときに実行されるイベント
        client.on('interactionCreate', async (interaction) => {

            //　コマンドにスラッシュがついていない場合は処理を終了
            if(!interaction.isChatInputCommand()) return;

            const command = commands[interaction.commandName];

            // コマンドが存在しない場合は処理を終了
            if(!command){
                await interaction.reply('そのコマンドは存在しません。');
                return;
            }

            try {
                // コマンドの実行
                await command.execute(interaction);
                // console.log(interaction.data)
                console.log(`${interaction.commandName}コマンドが実行されました。`);
            } catch (error) {
                console.error(error);
                await interaction.reply('コマンドの実行中にエラーが発生しました。');
            }

            // // registerコマンドが実行されたときに実行される処理
            // if(interaction.commandName === registerFile.data.name) {

            //     try {
            //         // register.jsのexecute関数を実行
            //         console.log('registerコマンドが実行されました。');
            //         await registerFile.execute(interaction);
            //     } catch (error) {
            //         console.error(error);
            //         await interaction.reply('コマンドの実行中にエラーが発生しました。');
            //     }

            // }
            // // unregisterコマンドが実行されたときに実行される処理
            // else if(interaction.commandName === unregisterFile.data.name){

            //     try{
            //         console.log('unregisterコマンドが実行されました。');
            //         await unregisterFile.execute(interaction);
            //     } catch (error) {
            //         console.error(error);
            //         await interaction.reply('コマンドの実行中にエラーが発生しました。');
            //     }

            // }
            
            
            // else{
            //     await interaction.reply('そのコマンドは存在しません。');
            // }
        });  
    }
}