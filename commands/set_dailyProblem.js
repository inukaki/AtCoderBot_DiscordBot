const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_daily_problem')
        .setDescription('今日の一問のDifficultyを設定'),
    // コマンドが実行されたときに実行される処理
    execute: async (interaction) => {
        // コマンドが実行されたチャンネル名が「今日の一問」でない場合は処理を終了
        if (interaction.channel.name != '今日の一問') return;

        // 今日の一問のDifficultyを設定するメッセージを送信
        await interaction.reply(`今日の一問のDifficultyを設定してください。`);

        // 今日の一問のDifficultyを設定するメッセージにリアクションをつける
        const message = await interaction.fetchReply();
        const emojis = ['🩶', '🤎', '💚', '🩵', '💙', '💛', '🧡', '❤️'];

        for(const emoji of emojis) {
            await message.react(emoji);
        }
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