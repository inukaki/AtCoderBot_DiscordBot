// commandフォルダから.jsを取得
const registerFile = require('../commands/register.js')
const unregisterFile = require('../commands/unregister.js');


module.exports = {

    interactionCreateEvents: function(client){

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

            }
            // unregisterコマンドが実行されたときに実行される処理
            else if(interaction.commandName === unregisterFile.data.name){

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
    }
}