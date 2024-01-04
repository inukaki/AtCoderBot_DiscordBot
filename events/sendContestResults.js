const cron = require('node-cron');
const { send } = require('process');
const axios = require('axios');
const shojinSample = require('../sample/shojinSample.json');


module.exports = {

    sendContestResults: function(client){

        // botを起動したときに実行されるイベント
        client.on('ready', () => {
            // 毎日の7時に実行されるイベント
            // スケジュール表現は左から、秒、分、時、日、月、曜日に対応している
            cron.schedule('0 0 23 * * 7', async () => {
            // cron.schedule('0 * * * * *', async () => {  // テスト用

                
                client.channels.cache.filter(ch => ch.name === 'コンテスト通知').forEach(async (ch) => { 
                    // 今日の一問を所得
                    const dailyProblem = await getDailyProblem();
                    console.log(dailyProblem.Gray.name);

                    var text ="本日の「今日の一問」はこちらです！\n";
    
                    const messageId = "1192398645094514821";
                    // リアクションの付与状態を所得
                    const message = await ch.messages.fetch(messageId);
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
                            text += `${emoji}:https://atcoder.jp/contests/${contestId}/tasks/${problemId}\n`
                        }
                    }
                    console.log(text);
                    ch.send(text);
                });
            });
        });
    }
}
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