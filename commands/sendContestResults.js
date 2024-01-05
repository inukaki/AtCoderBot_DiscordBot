const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('contest_results')
        .setDescription('コンテスト結果を送信します。')
        .addStringOption(option =>
            option.setName('contest_name')
                .setDescription('コンテスト名を入力してください。')
                .setRequired(true)  // 必須かどうかを設定
        ),
    // コマンドが実行されたときに実行される処理
    execute: async (interaction) => {
        const contestName = interaction.options.getString('contestName');
        const DiscordId = interaction.user.id;
        const guildId = interaction.guildId.toString();
        
        await interaction.reply(`ユーザー名 : ${AtCoderName} を登録しました。`);

        // ここにユーザー登録をする関数
        await registerUser(AtCoderName, DiscordId);
        await addShojinMember(guildId, DiscordId);
    },
};

// ユーザー登録をする関数
async function registerUser(AtCoderName, DiscordId) {
    // ここにユーザー登録の処理を書く
    const data = {
        discordID: `${DiscordId}`,
        atcoderID: `${AtCoderName}`
    };
    const url = 'http://api:3000/api/users';
    try {
        const response = await axios.put(url, data);
        // const response = await axios.get(url);
        console.log(response.data);
    } catch (error) {
        console.error(`error in registerUser : ${error}`);
    }
}

// ユーザー情報をサーバーと紐づける関数
async function addShojinMember(guildId, userId){
    const data = {
        discordID: `${userId}`
    };
    const url = 'http://api:3000/api/servers/members'+guildId;
    try {
        const response = await axios.post(url, data);
        console.log(response.data);
    } catch (error) {
        console.error(`error in addShojinMember : ${error}`);
    }
}

// コンテスト結果を所得する関数
async function getDailyProblem(atcoderID, contestID) {
    const url = 'http://api:3000/api/results/contest';
    try {
        const response = await axios.get(url);
        const dailyProblem = response.data;
        return dailyProblem;
    } catch (error) {
        console.error(`error in getDailyProblem: ${error}`);
    }
}