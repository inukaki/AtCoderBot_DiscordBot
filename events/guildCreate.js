const axios = require('axios');

module.exports = {

    guildCreateEvents: function(client){

        // botを起動したときに実行されるイベント
        client.on('guildCreate', async (guild) => {
            const name = guild.name;
            const id = guild.id.toString();
            const memberCount = guild.memberCount;

            // console.log(`新しいサーバーに参加しました: ${name} (id: ${id}). このサーバーは${guild.memberCount}人です！`);
            // const channel = guild.channels.cache.find(channel => channel.name === '一般');
            // if (!channel) return;
            // channel.send(`このサーバーのIDは ${id} 、名前は${name}です！\nこのサーバーは${guild.memberCount}人です！`);

            // サーバー情報をDBに保存する処理を書く
            await saveServerInfo(id);
        });
        
    }
}

// サーバー情報をDBに保存する関数
async function saveServerInfo(guildId) {
    console.log(`saveServerInfo : ` + guildId);
    const data = {
        serverID: guildId
    };
    console.log(data);
    const url = 'http://api:3000/api/servers/init';
    try {
        const response = await axios.post(url, data);
        console.log(response.data);
    } catch (error) {
        console.error(`error in saveServerInfo : ${error}`);
    }
}