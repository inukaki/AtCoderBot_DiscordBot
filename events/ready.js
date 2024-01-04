module.exports = {

    readyEvents: function(client){

        // botを起動したときに実行されるイベント
        client.on('ready', () => {
            console.log('ボットが起動したよ');

        });
    }
}