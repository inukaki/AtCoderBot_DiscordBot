const cron = require('node-cron');
const axios = require('axios'); //{}をつけるとエラーになる
const shojinSample = require('../sample/shojinSample.json');


module.exports = {

    sendShojinResults: function(client){

        // botを起動したときに実行されるイベント
        client.on('ready', async() => {
            // スケジュール表現は左から、秒、分、時、日、月、曜日に対応している
            // cron.schedule('0 * * * * *', async () => {
            cron.schedule('* * 9 * * 1', async () => {  // 毎週月曜日の9時に実行されるイベント
                    // 精進通知チャンネルに対して処理を実行
                    client.channels.cache.filter(ch => ch.name === '精進通知').forEach(async (ch) => {
                    try{
                        
                        const colorToEmoji = {
                            'Gray': '🩶',
                            'Brown': '🤎',
                            'Green': '💚',
                            'Cyan': '🩵',
                            'Blue': '💙',
                            'Yellow': '💛',
                            'Orange': '🧡',
                            'Red': '❤️'
                        };
                        
                        // APIからデータを取得
                        const guildId = ch.guild.id.toString();
                        const data = await getShojinRecord(guildId);
                        
                        // shojinSample.jsonを使う場合
                        // const data = shojinSample;

                        // データを表示
                        console.log(JSON.stringify(data, null, 2));
                        
                        const results = data.result.map(user => {
                            // 各色の問題数を取り出す(Object.entriesで連想配列を配列に変換)
                            let solved = Object.entries(user.solved).map(([color, count]) => {
                                const emoji = colorToEmoji[color];
                                return `${emoji}: ${count}問`;
                            }).join('\n');
                            // solvedが空の場合は「なし」と表示
                            if (!solved) {
                                solved = 'なし';
                            }
                            return `${user.atcoderID}:\n${solved}`;
                        }).join('\n');

                        // 結果を送信
                        ch.send(`今週の精進結果はこちらです！\n${results}`);
                        console.log(`今週の精進結果はこちらです！\n${results}`)

                    }catch (error) {
                        console.error(`error in sendShojinResults: ${error}`);
                    }
                });
            });
        });
    }
}

// 精進記録を獲得する関数
async function getShojinRecord(guildId) {

    const now = new Date();
    const nowUnixTime = Math.floor(now.getTime()/1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneWeekAgoUnixTime = Math.floor(oneWeekAgo.getTime()/1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneMonthAgoUnixTime = Math.floor(oneMonthAgo.getTime()/1000);

    const url = `http://api:3000/api/results/server/`+guildId;
    console.log(url);

    const data = {
        from: oneWeekAgoUnixTime,
        to: nowUnixTime
    };
    try {
        const response = await axios.get(url, {params:data});
        console.log(JSON.stringify(response.data, null, 2));//レスポンスを整形して出力
        return response.data;
    } catch (error) {
        console.error(`error in getShojinRecord : ${error}`);
        return [];
    }
}