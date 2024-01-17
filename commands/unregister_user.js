const {SlashCommandBuilder} = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unregister_user')
        .setDescription('DiscordとAtCoderの紐づけを解除します。'),
    execute: async (interaction) => {
        const DiscordId = interaction.user.id;
        const guildId = interaction.guildId.toString();
        const AtCoderName = await getAtCoderName(DiscordId);

        if(AtCoderName === undefined){
            await interaction.reply('AtCoderユーザー名とDiscordIDが紐づけられていません。');
            return;
        }

        await unregisterUser(DiscordId);
        await interaction.reply(`ユーザー名 : ${AtCoderName} を登録解除しました。`);
    },
}

// ユーザー登録を解除する関数
async function unregisterUser(DiscordId) {
    const url = 'http://api:3000/api/users/' + DiscordId;
    try {
        const response = await axios.delete(url);
        // const response = await axios.get(url);
        // console.log(response.data);
    } catch (error) {
        console.error(`error in registerUser : ${error}`);
    }
}

// AtCoderユーザー名を取得する関数
async function getAtCoderName(DiscordId) {
    // ここにAtCoderユーザー名を取得する処理を書く
    const url = `http://api:3000/api/users/${DiscordId}`;
    try {
        const response = await axios.get(url);
        // console.log(JSON.stringify(response.data, null, 2));//レスポンスを整形して出力
        return response.data.atcoderID;
    } catch (error) {
        console.error(`error in getAtCoderName : ${error}`);
    }
}