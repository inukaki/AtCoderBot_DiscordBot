const cron = require('node-cron');
const axios = require('axios');

module.exports = {
    
    sendContestNotification: function(client){
        client.on('ready', async() => {
            // スケジュール表現は左から、秒、分、時、日、月、曜日に対応している
            // cron.schedule('0 * * * * *', async () => {
            cron.schedule('* * 7 * * *', async () => {  // 毎日7時に実行されるイベント
                    // コンテスト通知チャンネルに対して処理を実行
                    client.channels.cache.filter(ch => ch.name === 'コンテスト通知').forEach(async (ch) => {
                    try{
                        var contestIds = await getContestIds();
                        // contestIdsの各要素に対して処理を実行
                        contestIds.forEach(contestId => {
                            const url = `https://atcoder.jp/contests/${contestId}/`;
                            const message = "本日は" + contestId + "が開催されます！\n" + 
                            "参加される方はリアクションをつけてください！\n" + url + "\n";
                            ch.send(message).then(message => {
                                message.react('👀');
                            });
                            console.log(message);
                        });
                    }catch (error) {
                        console.error(`error in sendContestNotification: ${error}`);
                    }
                });
            });
        });
    }
}

// 今日開催されるコンテストIDを取得する関数
async function getContestIds() {
    const now = new Date();
    const today = now.setHours(0,0,0,0);
    const todayUnixTime = Math.floor(today / 1000);
    const tomorrow = now.setHours(24,0,0,0);
    const tomorrowUnixTime = Math.floor(tomorrow / 1000);
    console.log(todayUnixTime);
    console.log(tomorrowUnixTime);
    const url = 'http://api:3000/api/contests';
    const data = {
        from: todayUnixTime,
        to: tomorrowUnixTime
    };
    try {
        const response = await axios.get(url, {params:data});
        const contests = response.data;
        var contestIds = [];
        contests.forEach(contest => {
            contestIds.push(contest.contestID);
        });
        // console.log(JSON.stringify(contests,null,2));
        // console.log(contestIds);
        return contestIds;
    } catch (error) {
        console.error(`error in getContestIds: ${error}`);
    }
}