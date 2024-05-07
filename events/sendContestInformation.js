const cron = require('node-cron');
const axios = require('axios');

module.exports = {
    
    sendContestInformation: function(client){
        client.on('ready', async() => {
            
            var startAtHours;
            var startAtMinutes;
            var endAtHours;
            var endAtMinutes;
            var alertAtHours = -1;
            var alertAtMinutes = -1;
            var resultAtHours = -1;
            var resultAtMinutes = -1;

            var contestId = "";
            var url = "";
            // var contestId = "abc335";
            // var url = `https://atcoder.jp/contests/${contestId}/`;

            // スケジュール表現は左から、秒、分、時、日、月、曜日に対応している
            // cron.schedule('0,10,20,30,40,50 * * * * *', async () => { // テスト用
            cron.schedule('0 30 6 * * *', async () => {  // 毎日15時30分に実行されるイベント(UNIX時間で指定)
                    // コンテスト通知チャンネルに対して処理を実行
                    client.channels.cache.filter(ch => ch.name === 'コンテスト通知').forEach(async (ch) => {
                    try{
                        var contests = await getContests();
                        // contestIdsの各要素に対して処理を実行
                        contests.forEach(contest => {
                            contestId = contest.contestID;
                            // コンテストIDにabcが含まれていなければ処理を終了
                            if(contestId.indexOf('abc') === -1) return;

                            // コンテストの開始時刻と終了時刻を所得
                            const startAtUnixTime = contest.startAt;
                            const endAtUnixTime = startAtUnixTime + contest.durationSecond;
                            const alertAtUnixTime = startAtUnixTime - 30*60;
                            const resultAtUnixTime = endAtUnixTime + 60*60;
                            const startAt = new Date(startAtUnixTime * 1000);
                            const endAt = new Date(endAtUnixTime * 1000);
                            const alertAt = new Date(alertAtUnixTime * 1000);
                            const resultAt = new Date(resultAtUnixTime * 1000);
                            startAtHours = startAt.getHours();
                            startAtMinutes = startAt.getMinutes();
                            endAtHours = endAt.getHours();
                            endAtMinutes = endAt.getMinutes();
                            alertAtHours = alertAt.getHours();
                            alertAtMinutes = alertAt.getMinutes();
                            resultAtHours = resultAt.getHours();
                            resultAtMinutes = resultAt.getMinutes();

                            // console.log(startAtHours, startAtMinutes);
                            // console.log(endAtHours, endAtMinutes);

                            url = `https://atcoder.jp/contests/${contestId}/`;
                            const message = "本日は" + contestId + "が開催されます！\n" + 
                            "参加される方はリアクションをつけてください！\n" + url;
                            ch.send(message).then(message => {
                                message.react('👀');
                            });
                            // console.log(message);
                        });
                    }catch (error) {
                        console.error(`error in sendContestNotification: ${error}`);
                    }
                });
            });

            cron.schedule('* * * * * *', async () => {
            // コンテスト開始30分前に通知
            // console.log(`0 ${alertAtMinutes} ${alertAtHours} * * *`);
            // cron.schedule(`0 * * * * *`, async () => { // テスト用
                cron.schedule(`0 ${alertAtMinutes} ${alertAtHours} * * *`, async () => {
                    if(alertAtMinutes != -1 && alertAtHours != -1){
                    client.channels.cache.filter(ch => ch.name === 'コンテスト通知').forEach(async (ch) => { 
                        
                        var text =`まもなく、${contestId}が開催されます！\n` + url + "\n";
        
                        const searchText = "本日は" + contestId + "が開催されます！\n" +  
                        "参加される方はリアクションをつけてください！\n" + url;
                        // console.log(searchText);
                        const messages = await ch.messages.fetch({ limit: 100 });
                        //　searchTextを含むメッセージを所得
                        const message = messages.find(m => {
                            return m.content === searchText;
                        });
                        if(!message){
                            console.log('メッセージが見つかりませんでした');
                            return;
                        }
                        // console.log(alertAtHours, alertAtMinutes);
                        const reaction = message.reactions.cache.get('👀');
                        const users = await reaction.users.fetch();
                        // リアクションをつけたユーザーに対してメッセージを送信
                        for(const user of users){
                            try{
                                if(user[1].bot) continue;
                                const sendUser = await client.users.fetch(user[0]);
                                await sendUser.send(text);
                            }catch(error){
                                console.error(`ユーザー ${user[1].globalName} にメッセージを送信できませんでした`, error);
                            }
                        }
                    });
                    alertAtHours = -1;
                    alertAtMinutes = -1;
                }
            });
        });
        cron.schedule('* * * * * *', async () => {
            // resultAtHours = 10;
            // resultAtMinutes = 46;
            // console.log(resultAtHours, resultAtMinutes);
            // cron.schedule(`0,10,20,30,40,50 * * * * *`, async () => {
            cron.schedule(`0 ${resultAtMinutes} ${resultAtHours} * * *`, async () => {
                if(resultAtMinutes != -1 && resultAtHours != -1){
                client.channels.cache.filter(ch => ch.name === 'コンテスト通知').forEach(async (ch) => { 
                    
                    var text =`${contestId}の結果を発表します！\n`;
    
                    const searchText = "本日は" + contestId + "が開催されます！\n" +  
                    "参加される方はリアクションをつけてください！\n" + url;
                    const messages = await ch.messages.fetch({ limit: 100 });
                    //　searchTextを含むメッセージを所得
                    console.log(contestId);
                    const message = messages.find(m => {
                        return m.content === searchText;
                    });
                    if(!message){
                        console.log('メッセージが見つかりませんでした');
                        return;
                    }
                    // console.log(resultAtHours, resultAtMinutes);
                    const reaction = message.reactions.cache.get('👀');
                    const users = await reaction.users.fetch();
                    // リアクションをつけたユーザーのコンテスト結果を所得
                    for(const user of users){
                        try{
                            if(user[1].bot) continue;
                            const atcoderID = await getAtCoderName(user[0]);
                            const results = await getContestResults(contestId,atcoderID);
                            text += `${atcoderID}：${results}\n`;
                        }catch(error){
                            console.error(error);
                        }
                    }
                    // console.log(text);
                    // ch.send(text);
                });
                resultAtHours = -1;
                resultAtMinutes = -1;
                // contestId = "";
                // url = "";
                }
            });
        });
        });
        
    }
}

// コンテスト結果を所得する関数
async function getContestResults(contestName,atcoderID) {
    const url = 'http://api:3000/api/results/contest/'+contestName;
    const data = {
        atcoderID: atcoderID
    };
    try {
        const response = await axios.get(url, {params:data});
        const contestResult = response.data;
        // console.log(JSON.stringify(contestResult,null,2));
        var results = "";
        contestResult.solved.forEach(problem => {
            // console.log(problem);
            results += problem.problemIndex;
        });
        return results;
    } catch (error) {
        console.error(`error in getContestResults: ${error}`);
    }
}

// 今日開催されるコンテストを取得する関数
async function getContests() {

    const now = new Date();
    const today = now.setHours(0,0,0,0);
    const todayUnixTime = Math.floor(today / 1000);
    const tomorrow = now.setHours(24,0,0,0);
    const tomorrowUnixTime = Math.floor(tomorrow / 1000);
    // console.log(todayUnixTime);
    // console.log(tomorrowUnixTime);
    const url = 'http://api:3000/api/contests';
    const data = {
        from: todayUnixTime,
        to: tomorrowUnixTime
        // from: 1704499200,
        // to: 1704585600
    };
    try {
        const response = await axios.get(url, {params:data});
        const contests = response.data;
        var contestIds = [];
        contests.forEach(contest => {
            contestIds.push(contest);
        });
        // console.log(JSON.stringify(contests,null,2));
        // console.log(contestIds);
        return contests;
    } catch (error) {
        console.error(`error in getContestIds: ${error}`);
    }
}
// AtCoderユーザー名を取得する関数
async function getAtCoderName(DiscordId) {
    // ここにAtCoderユーザー名を取得する処理を書く
    const url = `http://api:3000/api/users/${DiscordId}`;
    try {
        const response = await axios.get(url);
        // console.log(JSON.stringify(response.data, null, 2));//レスポンスを整形して出力
        return response.data.atcoderID;
    } catch (error) {
        console.error(`error in getAtCoderName : ${error}`);
    }
}
