const cron = require('node-cron');
const { send } = require('process');
const axios = require('axios'); //{}をつけるとエラーになる
const shojinSample = require('../sample/shojinSample.json');
const { get } = require('http');


module.exports = {

    sendShojinResults: function(client){

        // botを起動したときに実行されるイベント
        client.on('ready', async() => {
            
            const baseDate = new Date('2023-12-23T21:00:00Z');
            const now = new Date();
            console.log(baseDate.getTime());
            
            // 毎週月曜日の9時に実行されるイベント
            // スケジュール表現は左から、秒、分、時、日、月、曜日に対応している
            cron.schedule('0 * * * * *', async () => {
                
            // cron.schedule('* * 9 * * 1', async () => {
                    // sendContestNotification(channel, url);
                    // 精進通知チャンネルに対して処理を実行
                    client.channels.cache.filter(ch => ch.name === '精進通知').forEach(async (ch) => { 
                    const url = 'http://api:3000/api/result/server/'+ch.guild.id;
                    console.log(url);
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
                        const guildId = ch.guild.id;
                        const data = await getShojinRecord(guildId); // APIから取得したデータ
                        
                        // shojinSample.jsonを使う場合
                        // console.log(shojinSample);
                        // const data = shojinSample;

                        // 各ユーザーの結果を処理
                        const results = data.results.map(user => {
                            // 各色の問題数を取り出す
                            const solved = user.solved.map(problem => {
                                const emoji = colorToEmoji[problem.color];
                                return `${emoji}: ${problem.count}問`;
                            }).join('\n');

                            // ユーザー名と解いた問題数を組み合わせる
                            return `${user.atcoderID}:\n${solved}`;
                        }).join('\n\n');

                        // 結果を送信
                        // ch.send(`今週の精進結果はこちらです！\n${results}`);
                        console.log(`今週の精進結果はこちらです！\n${results}`)

                    }catch (error) {
                        console.error(`error in sendShojinResults: ${error}`);
                    }
                });
                // message.guild.channels.cache.find(ch => ch.name === '精進通知')?.send('ここは精進通知チャンネルです。');
                // channel.send('毎週月曜日21時にメッセージを送信するよ♪');
                // console.log('毎週月曜日21時にメッセージを送信するよ♪');
            }
            );
        });
        
    }
}

// 精進記録を獲得する関数
async function getShojinRecord(guildId) {
    console.log(`getShojinRecord : ${guildId}`);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    console.log(oneWeekAgo.getTime(), now.getTime());
    const url = `http://api:3000/api/results/server/${+guildId}`;
    // const url = 'http://api:3000/api/results/user/maisuma';
    // const url = 'http://api:3000/api/users';
    // const data = {
    //     // serverID: `${guildId}`,
    //     discordID: '1234567890',
    //     atcoderID: 'test'
    // };
    const data = {
        serverID: `${guildId}`,
        // atcoderID: 'maisuma',
        from: `${oneWeekAgo.getTime()}`,
        to: `${now.getTime()}`
    };
    try {
        const response = await axios.get(url, {params:data});
        // const response = await axios.put(url,data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(`error in getShojinRecord : ${error}`);
    }
}