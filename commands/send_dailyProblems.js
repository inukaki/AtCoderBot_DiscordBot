const { SlashCommandBuilder } = require('discord.js');
const sendDailyProblems = require('../functions/sendDailyProblems');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send_daily_problems')
        .setDescription('今日の一問を送信します。'),
    execute: async (interaction) => {
        await sendDailyProblems(interaction);
    }}
