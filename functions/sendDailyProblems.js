const axios = require('axios');
const getDailyProblems = require('./getDailyProblems');

async function sendDailyProblems(interaction) {
    
        
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
    const dailyProblem = await getDailyProblems();
    
    var text ="本日の「今日の一問」はこちらです\n";
    
    interaction.guild.channels.cache.filter(ch => ch.name === '今日の一問').forEach(async (ch) => {
        const searchText = '今日の一問のDifficultyを設定してください。'
        const messages = await ch.messages.fetch({ limit: 100 });
        const message = messages.find(m => m.content === searchText);
        if(!message){
            console.log('メッセージが見つかりませんでした');
            return;
        }
        for(const emoji of emojis) {
            const reaction = message.reactions.cache.get(emoji);
            const color = emojiToColor[emoji];
            if (reaction.count > 1) {
                console.log("color:"+color)
                const contestId = dailyProblem[color].contestID;
                const problemId = dailyProblem[color].problemID; 
                console.log("contestId:"+contestId)
                console.log("problemId:"+problemId)
                text += `${emoji}：https://atcoder.jp/contests/${contestId}/tasks/${problemId}\n`
                console.log("text:"+text)
            }
        }
        console.log(text);
        await interaction.reply(text);
    });

}

module.exports = sendDailyProblems;