const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_channel_shojin')
        .setDescription('精進通知を送るチャンネルでコマンドを実行してください。'),
    // コマンドが実行されたときに実行される処理
    execute: async (interaction) => {
        const channelID = interaction.channel.id;
        const guildID = interaction.guild.id;
        await setShojinChannel(channelID, guildID);

        const channelName = interaction.channel.name;
        await interaction.reply(`精進通知を送るチャンネルを ${channelName} に設定しました。`);
    },
};

// ContestChannelIDをDBに保存
async function setShojinChannel(channelID, guildID) {
    // const data = {
    //     channelID: channelID,
    //     guildID: guildID
    // };
    // const url = '';
    // try {
    //     const response = await axios.post(url, data);
    //     console.log(response.data);
    // } catch (error) {
    //     console.error(`error in setShojinChannel: ${error}`);
    // }
    console.log('精進チャンネルIDを保存する機能は後でちゃんと書いてね');
}