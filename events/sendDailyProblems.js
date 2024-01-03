const cron = require('node-cron');
const { send } = require('process');
const { axios } = require('axios');
const shojinSample = require('../sample/shojinSample.json');


module.exports = {

    sendDailyProblems: function(client){

        // botを起動したときに実行されるイベント
        client.on('ready', () => {
            
            // 毎週月曜日の9時に実行されるイベント
            // スケジュール表現は左から、秒、分、時、日、月、曜日に対応している
            cron.schedule('0 0 9 * * *', async () => {

                // 現在の時刻のミリ秒を所得。基準は2023/12/23 21:00 = 1703332800
                

                client.channels.cache.filter(ch => ch.name === '今日の一問').forEach(async (ch) => { 
                    
                });

                // message.guild.channels.cache.find(ch => ch.name === '精進通知')?.send('ここは精進通知チャンネルです。');
                // channel.send('毎週月曜日21時にメッセージを送信するよ♪');
                // console.log('毎週月曜日21時にメッセージを送信するよ♪');
            });
        });
    }
}