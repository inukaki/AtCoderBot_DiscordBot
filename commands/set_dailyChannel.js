const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_channel_daily')
        .setDescription('今日の一問を送るチャンネルでコマンドを実行してください。'),
    // コマンドが実行されたときに実行される処理
    execute: async (interaction) => {
        const channelID = interaction.channel.id;
        const guildID = interaction.guild.id;
        await setDailyChannel(channelID, guildID);

        const channelName = interaction.channel.name;
        await interaction.reply(`今日の一問を送るチャンネルを ${channelName} に設定しました。`);
    },
};

// dailyChannelIDをDBに保存
async function setDailyChannel(channelID, guildID) {
    // const data = {
    //     channelID: channelID,
    //     guildID: guildID
    // };
    // const url = '';
    // try {
    //     const response = await axios.post(url, data);
    //     console.log(response.data);
    // } catch (error) {
    //     console.error(`error in setDailyChannel: ${error}`);
    // }
    console.log('今日の一問チャンネルIDを保存する機能は後でちゃんと書いてね');
}