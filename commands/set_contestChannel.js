const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_channel_contest')
        .setDescription('コンテスト通知を送るチャンネルでコマンドを実行してください。'),
    // コマンドが実行されたときに実行される処理
    execute: async (interaction) => {
        const channelID = interaction.channel.id;
        const guildID = interaction.guild.id;
        await setContestChannel(channelID, guildID);

        const channelName = interaction.channel.name;
        await interaction.reply(`コンテスト通知を送るチャンネルを ${channelName} に設定しました。`);
    },
};

// ContestChannelIDをDBに保存
async function setContestChannel(channelID, guildID) {
    // const data = {
    //     channelID: channelID,
    //     guildID: guildID
    // };
    // const url = '';
    // try {
    //     const response = await axios.post(url, data);
    //     console.log(response.data);
    // } catch (error) {
    //     console.error(`error in setChannel: ${error}`);
    // }
    console.log('チャンネルIDを保存する機能は後でちゃんと書いてね');
}