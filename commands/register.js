const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('ユーザーを登録します。')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('AtCoderユーザー名を入力してください。')
                .setRequired(true)  // 必須かどうかを設定
        ),
    // コマンドが実行されたときに実行される処理
    execute: async (interaction) => {
        const AtCoderName = interaction.options.getString('name');
        const DiscordId = interaction.user.id;
        const DiscordName = interaction.user.username;
        
        await interaction.reply(`ユーザー名 : ${AtCoderName} を登録しました。`);

        // ここにユーザー登録をする関数
        await registerUser(AtCoderName, DiscordId);
    },
};

// ユーザー登録をする関数
async function registerUser(AtCoderName, DiscordId) {
    // ここにユーザー登録の処理を書く
    const data = {
        discordID: DiscordId,
        atcoderID: AtCoderName
    };
    const url = 'http://api:3000/api/users/create';
    try {
        const response = await axios.post(url, data);
        console.log(response.data);
    } catch (error) {
        console.error(`エラーだよw 頑張ってねw : ${error}`);
    }
    // console.log('ユーザー登録の処理は後でちゃんと書いてね');
}
