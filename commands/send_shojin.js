const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const getShojinRecord = require('../functions/getShojinRecord');
const makeShojinResultsMessage = require('../functions/makeShojinResultsMessage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send_shojin')
        .setDescription('精進記録を送信します。'),
    // コマンドが実行されたときに実行される処理
    execute: async (interaction) => {
        const guildId = interaction.guildId.toString();
        const data = await getShojinRecord(guildId);
        console.log(data);
        const reply = await makeShojinResultsMessage(data);

        await interaction.reply(reply);
    },
};