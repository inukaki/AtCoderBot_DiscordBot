module.exports = {

    guildCreateEvents: function(client){

        // botを起動したときに実行されるイベント
        client.on('guildCreate', guild => {
            console.log(`新しいサーバーに参加しました: ${guild.name} (id: ${guild.id}). このサーバーは${guild.memberCount}人です！`);
            const channel = guild.channels.cache.find(channel => channel.name === '一般');
            if (!channel) return;
            channel.send(`このサーバーのIDは ${guild.id} 、名前は${guild.name}です！\nこのサーバーは${guild.memberCount}人です！`);
        });
        
    }
}