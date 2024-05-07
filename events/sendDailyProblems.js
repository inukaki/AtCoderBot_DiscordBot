const cron = require('node-cron');
const getDailyProblems = require('../functions/getDailyProblems');

module.exports = {

    sendDailyProblems: function(client){
            
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
        
        // 毎日の7時に実行されるイベント
        // スケジュール表現は左から、秒、分、時、日、月、曜日に対応している
        cron.schedule('0 0 22 * * *', async () => {
        // cron.schedule('0 * * * * *', async () => {  // テスト用            
            client.channels.cache.filter(ch => ch.name === '今日の一問').forEach(async (ch) => { 
                // 今日の一問を所得
                const dailyProblem = await getDailyProblems();

                var text ="本日の「今日の一問」はこちらです\n";

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
                        const contestId = dailyProblem[color].contestID;
                        const problemId = dailyProblem[color].problemID; 
                        text += `${emoji}：https://atcoder.jp/contests/${contestId}/tasks/${problemId}\n`
                    }
                }
                ch.send(text);
            });
        });
    }
}