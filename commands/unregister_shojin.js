const {SlashCommandBuilder} = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unregister_shojin')
        .setDescription('精進通知を解除します。'),
    execute: async (interaction) => {
        const DiscordId = interaction.user.id;
        const guildId = interaction.guildId.toString();
        const AtCoderName = await getAtCoderName(DiscordId);

        const members = await getShojinUser(guildId);
        var isMember = false;
        for(const member of members){
            if(member === DiscordId){
                isMember = true;
                break;
            }
        }
        if(!isMember){
            await interaction.reply('精進通知に登録されていません。');
            return;
        }
        
        await unregisterShojin(DiscordId, guildId);
        await interaction.reply(`ユーザー名 : ${AtCoderName} の精進通知登録を解除しました。`);
    },
}

// 精進登録を解除する関数
async function unregisterShojin(DiscordId, guildId) {
    // ここにユーザー登録解除の処理を書く
    const data = {
        discordID: `${DiscordId}`
    };
    const url = 'http://api:3000/api/servers/members/' + guildId;
    try {
        const response = await axios.delete(url, {params: data});
        // const response = await axios.get(url);
        console.log(response.data);
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

// サーバー精進ユーザーを所得
async function getShojinUser(guildId) {
    const url = `http://api:3000/api/servers/${guildId}`;
    try {
        const response = await axios.get(url);
        // console.log(JSON.stringify(response.data, null, 2));//レスポンスを整形して出力
        return response.data.members;
    } catch (error) {
        console.error(`error in getServerModel : ${error}`);
    }
}