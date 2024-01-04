const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unregister')
        .setDescription('ユーザーを登録解除します。'),
    execute: async (interaction) => {
        const DiscordId = interaction.user.id;
        const guildId = interaction.guildId.toString();
        const AtCoderName = await getAtCoderName(DiscordId);

        await unregisterUser(DiscordId, guildId);

        await interaction.reply(`ユーザー名 : ${AtCoderName} を登録解除しました。`);
    },
}

// ユーザー登録を解除する関数
async function unregisterUser(DiscordId, guildId) {
    // ここにユーザー登録解除の処理を書く
    const data = {
        discordID: `${DiscordId}`
    };
    const url = 'http://api:3000/api/servers/members/' + guildId;
    try {
        const response = await axios.put(url, data);
        // const response = await axios.get(url);
        console.log(response.data);
    } catch (error) {
        console.error(`error in registerUser : ${error}`);
    }
}

// AtCoderユーザー名を取得する関数
async function getAtCoderName(DiscordId) {
    // ここにAtCoderユーザー名を取得する処理を書く
    const data = {
        DiscordId: DiscordId,
    };
    const url = `http://api:3000/api/users/${DiscordId}`;
    try {
        const response = await axios.get(url);
        console.log(JSON.stringify(response.data, null, 2));//レスポンスを整形して出力
        return response.data.atcoderID;
    } catch (error) {
        console.error(`error in getAtCoderName : ${error}`);
    }
    // console.log('AtCoderユーザー名を取得する処理は後でちゃんと書いてね');
    // return 'AtCoderユーザー名';
}