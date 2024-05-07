const cron = require('node-cron');
const axios = require('axios'); //{}をつけるとエラーになる
const shojinSample = require('../sample/shojinSample.json');
const { count } = require('console');
const getShojinRecord = require('../functions/getShojinRecord');


module.exports = {

    sendShojinResults: function(client){

        // botを起動したときに実行されるイベント
        client.on('ready', async() => {
            // スケジュール表現は左から、秒、分、時、日、月、曜日に対応している
            // cron.schedule('0,10,20,30,40,50 * * * * *', async () => {
            cron.schedule('0 0 0 * * 1', async () => {  // 毎週月曜日の9時に実行されるイベント
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
                        // console.log(JSON.stringify(data, null, 2));
                        
                        const results = data.results.map(user => {

                            var difficultyCount ={
                                Gray: 0,
                                Brown: 0,
                                Green: 0,
                                Cyan: 0,
                                Blue: 0,
                                Yellow: 0,
                                Orange: 0,
                                Red: 0
                            };

                            user.solved.forEach(problem => {
                                if(problem.difficulty >= 0 && problem.difficulty < 400){
                                    difficultyCount.Gray++;
                                }else if(problem.difficulty >= 400 && problem.difficulty < 800){
                                    difficultyCount.Brown++;
                                }else if(problem.difficulty >= 800 && problem.difficulty < 1200){
                                    difficultyCount.Green++;
                                }else if(problem.difficulty >= 1200 && problem.difficulty < 1600){
                                    difficultyCount.Cyan++;
                                }else if(problem.difficulty >= 1600 && problem.difficulty < 2000){
                                    difficultyCount.Blue++;
                                }else if(problem.difficulty >= 2000 && problem.difficulty < 2400){
                                    difficultyCount.Yellow++;
                                }else if(problem.difficulty >= 2400 && problem.difficulty < 2800){
                                    difficultyCount.Orange++;
                                }else if(problem.difficulty >= 2800){
                                    difficultyCount.Red++;
                                }
                            });

                            // 各色の問題数を取り出す(Object.entriesで連想配列を配列に変換)
                            let solved = Object.entries(difficultyCount)
                            .filter(([color, count]) => count != 0)
                            .map(([color, count]) => {
                                // if (count === 0) return;
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