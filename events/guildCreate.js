module.exports = {

    guildCreateEvents: function(client){

        // botを起動したときに実行されるイベント
        client.on('guildCreate', guild => {
            const name = guild.name;
            const id = guild.id;
            const memberCount = guild.memberCount;

            console.log(`新しいサーバーに参加しました: ${name} (id: ${id}). このサーバーは${guild.memberCount}人です！`);
            const channel = guild.channels.cache.find(channel => channel.name === '一般');
            if (!channel) return;
            channel.send(`このサーバーのIDは ${id} 、名前は${name}です！\nこのサーバーは${guild.memberCount}人です！`);

            // サーバー情報をDBに保存する処理を書く

        });
        
    }
}