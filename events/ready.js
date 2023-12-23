const cron = require('node-cron');


module.exports = {

    readyEvents: function(client){

        // botを起動したときに実行されるイベント
        client.on('ready', () => {
            console.log('ボットが起動したよ');
            
            // チャンネルIDを指定
            const channelId = '1185099222257762397';
            const channel = client.channels.cache.get(channelId);  
            
            // 毎週日曜日の21時に実行されるイベント
            // スケジュール表現は左から、分、時、日、月、曜日に対応している
            cron.schedule('* * 21 * * 0', async () => {
                channel.send('毎週日曜日21時にメッセージを送信するよ♪');
                console.log('毎週日曜日21時にメッセージを送信するよ♪');
            }
            );
        });
        
    }
}