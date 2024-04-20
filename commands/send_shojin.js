const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const getShojinRecord = require('../functions/getShojinRecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send_shojin')
        .setDescription('精進記録を送信します。'),
    // コマンドが実行されたときに実行される処理
    execute: async (interaction) => {
        const guildId = interaction.guildId.toString();
        const data = await getShojinRecord(guildId);
        console.log(data);
        const colorToEmoji = {
            'Gray': '🩶',
            'Brown': '🤎',
            'Green': '💚',
            'Cyan': '🩵',
            'Blue': '💙',
            'Yellow': '💛',
            'Orange': '🧡',
            'Red': '❤️'
        };
        const results = data.results.map(user => {
            

            var difficultyCount ={
                Gray: 0,
                Brown: 0,
                Green: 0,
                Cyan: 0,
                Blue: 0,
                Yellow: 0,
                Orange: 0,
                Red: 0
            };

            user.solved.forEach(problem => {
                if(problem.difficulty >= 0 && problem.difficulty < 400){
                    difficultyCount.Gray++;
                }else if(problem.difficulty >= 400 && problem.difficulty < 800){
                    difficultyCount.Brown++;
                }else if(problem.difficulty >= 800 && problem.difficulty < 1200){
                    difficultyCount.Green++;
                }else if(problem.difficulty >= 1200 && problem.difficulty < 1600){
                    difficultyCount.Cyan++;
                }else if(problem.difficulty >= 1600 && problem.difficulty < 2000){
                    difficultyCount.Blue++;
                }else if(problem.difficulty >= 2000 && problem.difficulty < 2400){
                    difficultyCount.Yellow++;
                }else if(problem.difficulty >= 2400 && problem.difficulty < 2800){
                    difficultyCount.Orange++;
                }else if(problem.difficulty >= 2800){
                    difficultyCount.Red++;
                }
            });

            // 各色の問題数を取り出す(Object.entriesで連想配列を配列に変換)
            let solved = Object.entries(difficultyCount)
            .filter(([color, count]) => count != 0)
            .map(([color, count]) => {
                // if (count === 0) return;
                const emoji = colorToEmoji[color];
                return `${emoji}: ${count}問`;
            }).join('\n');
            // solvedが空の場合は「なし」と表示
            if (!solved) {
                solved = 'なし';
            }
            return `${user.atcoderID}:\n${solved}`;
        }).join('\n');

        const reply = `今週の精進結果はこちらです！\n${results}`;
        await interaction.reply(reply);
    },
};