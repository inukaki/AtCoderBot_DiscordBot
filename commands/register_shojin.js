const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { get } = require('http');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register_shojin')
        .setDescription('精進通知に登録します。'),
    // コマンドが実行されたときに実行される処理
    execute: async (interaction) => {
        const DiscordId = interaction.user.id;
        const AtCoderName = await getAtCoderName(DiscordId);
        const guildId = interaction.guildId.toString();
        
        if(AtCoderName === null){
            await interaction.reply('AtCoderユーザー名とDiscordIDが紐づけられていません。\n/register_user で紐づけを行ってください。');
            return;
        }
        const members = await getShojinUser(guildId);
        // console.log(members);
        for(const member of members){
            if(member === DiscordId){
                await interaction.reply('すでに精進通知に登録されています。');
                return;
            }
        }
        // 精進登録をする関数
        await addShojinMember(guildId, DiscordId);
        await interaction.reply(`ユーザー名 : ${AtCoderName} を精進通知に登録しました。`);
    },
};

// ユーザー情報をサーバーと紐づける関数
async function addShojinMember(guildId, userId){
    const data = {
        discordID: `${userId}`
    };
    const url = 'http://api:3000/api/servers/members/'+guildId;
    try {
        const response = await axios.post(url, data);
        // console.log(response.data);
    } catch (error) {
        console.error(`error in addShojinMember : ${error}`);
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