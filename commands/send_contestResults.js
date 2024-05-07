const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('contest_results')
        .setDescription('コンテスト結果を送信します。')
        .addStringOption(option =>
            option.setName('contest_name')
                .setDescription('コンテスト名を入力してください。')
                .setRequired(true)  // 必須かどうかを設定
        )
        .addStringOption(option =>
            option.setName('atcoder_id')
                .setDescription('AtCoderユーザー名を入力してください。')
                .setRequired(false)  // 必須かどうかを設定
        ),
    // コマンドが実行されたときに実行される処理
    execute: async (interaction) => {
        const contestName = interaction.options.getString('contest_name');
        const discordID = interaction.user.id;
        var atcoderID = await getAtCoderName(discordID);
        if(interaction.options.getString('atcoder_id')){
            atcoderID = interaction.options.getString('atcoder_id');
        }
        // const atcoderID = "maisuma";
        var reply = `${contestName}の${atcoderID}さんの結果です！\n`;
        reply += `${atcoderID}：`;
        reply += await getContestResults(contestName,atcoderID);
        reply += "\n";
        console.log(reply);
        await interaction.reply(reply);
        
        // await interaction.reply(`ユーザー名 : ${AtCoderName} を登録しました。`);

    },
};
// コンテスト結果を所得する関数
async function getContestResults(contestName,atcoderID) {
    const url = 'http://api:3000/api/results/contest/'+contestName;
    const data = {
        atcoderID: atcoderID
    };
    try {
        const response = await axios.get(url, {params:data});
        const contestResult = response.data;
        console.log(JSON.stringify(contestResult,null,2));
        var results = "";
        contestResult.solved.forEach(problem => {
            results += problem.problemIndex;
        });
        return results;
    } catch (error) {
        console.error(`error in getDailyProblem: ${error}`);
    }
}

// AtCoderユーザー名を取得する関数
async function getAtCoderName(DiscordId) {
    // ここにAtCoderユーザー名を取得する処理を書く
    const url = `http://api:3000/api/users/${DiscordId}`;
    try {
        const response = await axios.get(url);
        // console.log(JSON.stringify(response.data, null, 2));//レスポンスを整形して出力
        return response.data.atcoderID;
    } catch (error) {
        console.error(`error in getAtCoderName : ${error}`);
    }
}
