const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unregister')
        .setDescription('ユーザーを登録解除します。'),
    execute: async (interaction) => {
        const DiscordId = interaction.user.id;
        const AtCoderName = await getAtCoderName(DiscordId);

        await unregisterUser(DiscordId);

        await interaction.reply(`ユーザー名 : ${AtCoderName} を登録解除しました。`);
    },
}

// ユーザー登録を解除する関数
async function unregisterUser(DiscordId) {
    // ここにユーザー登録解除の処理を書く
}

// AtCoderユーザー名を取得する関数
async function getAtCoderName(DiscordId) {
    return 'AtCoderユーザー名';
}