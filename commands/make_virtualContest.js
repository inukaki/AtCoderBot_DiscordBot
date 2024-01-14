const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const cron = require('node-cron');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('make_virtual_contest')
        .setDescription('バーチャルコンテストを作成します。')
        .addStringOption(option =>
            option.setName('contest_name')
                .setDescription('コンテスト名を入力してください。')
                .setRequired(true))  // 必須かどうかを設定
        .addStringOption(option =>
            option.setName('contest_time_hours')
                .setDescription('コンテスト開始時刻を入力してください。')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('contest_time_minutes')
                .setDescription('コンテスト開始時刻を入力してください。')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('contest_duration')
                .setDescription('コンテスト時間を入力してください。')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('contest_problems_grey')
                .setDescription('コンテストの問題難易度を設定してください。')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('contest_problems_brown')
                .setDescription('コンテストの問題難易度を設定してください。')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('contest_problems_green')
                .setDescription('コンテストの問題難易度を設定してください。')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('contest_problems_cyan')
                .setDescription('コンテストの問題難易度を設定してください。')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('contest_problems_blue')
                .setDescription('コンテストの問題難易度を設定してください。')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('contest_problems_yellow')
                .setDescription('コンテストの問題難易度を設定してください。')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('contest_problems_orange')
                .setDescription('コンテストの問題難易度を設定してください。')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('contest_problems_red')
                .setDescription('コンテストの問題難易度を設定してください。')
                .setRequired(true)),
    execute: async (interaction) => {
        var contestID;
        const contestName = interaction.options.getString('contest_name');
        // const contestTime = interaction.options.getString('contest_time');
        const contestTimeHours = interaction.options.getString('contest_time_hours');
        const contestTimeMinutes = interaction.options.getString('contest_time_minutes');
        const contestDuration = interaction.options.getString('contest_duration')*60;
        var problemsCounts = {
            Gray: interaction.options.getString('contest_problems_grey'),
            Brown: interaction.options.getString('contest_problems_brown'),
            Green: interaction.options.getString('contest_problems_green'),
            Cyan: interaction.options.getString('contest_problems_cyan'),
            Blue: interaction.options.getString('contest_problems_blue'),
            Yellow: interaction.options.getString('contest_problems_yellow'),
            Orange: interaction.options.getString('contest_problems_orange'),
            Red: interaction.options.getString('contest_problems_red')
        };
        var problems = [];
        for(color in problemsCounts){
            for(var i = 0; i < problemsCounts[color]; i++){
                problems.push(color);
            }
        }
        const members = ["inukaki", "maisuma"];
        const guildId = interaction.guildId.toString();
        const visible = "discordOnly";
        console.log(problems);

        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();
        const JapaneseTime = new Date(todayYear, todayMonth, todayDate, contestTimeHours, contestTimeMinutes, 0);
        const time = new Date(JapaneseTime.getTime() - 9 * 60 * 60 * 1000);
        const contestTime = Math.floor(time.getTime()/1000);
        // const contestDuration = 7200;
        const startAtMinute = time.getMinutes();
        const startAtHours = time.getHours();
        // 今の時刻に設定

        const url = 'http://api:3000/api/virtual_contests';
        const data = {
            startAt: contestTime,
            // startAt: unixtime,
            durationSecond: contestDuration,
            title: contestName,
            visible: visible,
            serverID: guildId,
            members: members,
            problems: problems
        };
        try {
            const response = await axios.post(url, data);
            contestID = response.data.virtualContestID;
            // console.log(contestID);
            console.log(response.data);
        } catch (error) {
            console.error(`error in makeVirtualContest : ${error}`);
        }
        // console.log(members);

        // const startAt = new Date(contestTime);
        // const startAtMinute = startAt.getMinutes();
        // const startAtHours = startAt.getHours();

        cron.schedule("* * * * * *", async () => {
            const url = 'http://api:3000/api/virtual_contests/'+contestID;
            console.log(`0 ${startAtMinute} ${startAtHours} * * *`);
            cron.schedule(`0 ${startAtMinute} ${startAtHours} * * *`, async () => {
                // const url = 'http://api:3000/api/virtual_contests/'+contestID;
                console.log(url);
                var text = "";
                try {
                    const response = await axios.get(url);
                    const contest = response.data;
                    // contest.startAtを日本時間に変換
                    const startAt = new Date(contest.startAt * 1000 + 9 * 60 * 60 * 1000);
                    console.log(startAt);
                    const startAtHours = startAt.getHours();
                    const startAtMinutes = startAt.getMinutes()
                    const endTime = new Date(startAt.getTime() + contest.durationSecond * 1000);
                    const endAtHours = endTime.getHours();
                    const endAtMinutes = endTime.getMinutes();
                    console.log(contest);
                    text += `${contest.title}が始まりました！\n`+
                            `開始時刻: ${startAtHours}:${startAtMinutes}\n`+
                            `終了時刻: ${endAtHours}:${endAtMinutes}\n`+
                            `問題一覧\n`;
                    for(const problem of contest.problems){
                        text += `https://atcoder.jp/contests/${problem.contestID}/tasks/${problem.problemID}\n`;
                    }
                    console.log(text);
                    // interaction.channel.send(text);
                } catch (error) {
                    console.error(`error in makeVirtualContest : ${error}`);
                }
            });
        });
    }
};