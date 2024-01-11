const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send_daily_problems')
        .setDescription('今日の一問を送信します。'),
    execute: async (interaction) => {
        
        const emojis = ['🩶', '🤎', '💚', '🩵', '💙', '💛', '🧡', '❤️'];

        const emojiToColor = {
            '🩶': 'Gray',
            '🤎': 'Brown',
            '💚': 'Green',
            '🩵': 'Cyan',
            '💙': 'Blue',
            '💛': 'Yellow',
            '🧡': 'Orange',
            '❤️': 'Red'
        };
        
            
        // 今日の一問を所得
        const dailyProblem = await getDailyProblem();
        console.log(dailyProblem.Gray.name);
        
        var text ="本日の「今日の一問」はこちらです！\n";
        
        interaction.guild.channels.cache.filter(ch => ch.name === '今日の一問').forEach(async (ch) => {
            const searchText = '今日の一問のDifficultyを設定してください。'
            const messages = await ch.messages.fetch({ limit: 100 });
            const message = messages.find(m => m.content === searchText);
            // console.log(message);
            // const messageId = "1192398645094514821";
            // リアクションの付与状態を所得
            // const message = await ch.messages.fetch(messageId);
            if(!message){
                console.log('メッセージが見つかりませんでした');
                return;
            }
            for(const emoji of emojis) {
                const reaction = message.reactions.cache.get(emoji);
                const color = emojiToColor[emoji];
                if (reaction.count > 1) {
                    const contestId = dailyProblem[color].contestID;
                    const problemId = dailyProblem[color].problemID; 
                    text += `${emoji}：https://atcoder.jp/contests/${contestId}/tasks/${problemId}\n`
                }
            }
            console.log(text);
            await interaction.reply(text);
        });
    }}

    
// 今日の一問を所得する関数
async function getDailyProblem() {
    const url = 'http://api:3000/api/daily';
    try {
        const response = await axios.get(url);
        const dailyProblem = response.data;
        return dailyProblem;
    } catch (error) {
        console.error(`error in getDailyProblem: ${error}`);
    }
}