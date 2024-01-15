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
        const members = ["inukaki", "maisumaaaaaaaaa"];
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

        var url = 'http://api:3000/api/virtual_contests';
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

        var duringContest = false;
        cron.schedule("* * * * * *", async () => {
            url = 'http://api:3000/api/virtual_contests/'+contestID;
            
            // var resultsUrl = `https://api:3000/api/virtual_contests/standings/${contestID}`;
            // const results = await axios.get(resultsUrl);
            // console.log(results.data);

            console.log(`0 ${startAtMinute} ${startAtHours} * * *`);
            
            cron.schedule(`0,10,20,30,40,50 ${startAtMinute} ${startAtHours} * * *`, async () => {
            // cron.schedule(`0 ${startAtMinute} ${startAtHours} * * *`, async () => {

                if(!duringContest){
                    // const url = 'http://api:3000/api/virtual_contests/'+contestID;
                    console.log(url);
                    var text = "";
                    duringContest = true;

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
                                `終了時刻: ${endAtHours}:${endAtMinutes}\n`;
                        var points = "配点\n";
                        var problems = "問題一覧\n";
                        for(const problem of contest.problems){
                            points += `-${problem.point}`;
                            problems += `https://atcoder.jp/contests/${problem.contestID}/tasks/${problem.problemID}\n`;
                        }
                        points += "-\n";
                        text += points;
                        text += problems;
                        console.log(text);
                        await interaction.channel.send(text);

                        // コンテストの成績表を送信
                        console.log(contestID);
                        var resultsUrl = `http://api:3000/api/virtual_contests/standings/${contestID}`;
                        // var resultsUrl = `http://api:3000/api/virtual_contests/${contestID}`;
                        duringContest = true;
                        const results = await axios.get(resultsUrl);
                        console.log(results.data);
                        let table = "| " + "参加者".padEnd(10) + " | " + "総得点".padEnd(4) + " | ";
                        let horizontalBar = "".padEnd(13,"-") + "".padEnd(7,"-");
                        for(let problem of contest.problems){
                            table += `${problem.problemIndex}`.padEnd(4) + " | ";
                            horizontalBar += ``.padEnd(7,"-");
                        }
                        table += "\n";
                        table += horizontalBar + "-\n";
                        for (let contestant of results.data) {

                            let row = `| `+`${contestant.atcoderID}`.substring(0, 10).padEnd(10)+` | `+ `${contestant.point}`.padEnd(4) ;
                            for (let problem of contestant.problems) {
                                let problemPoint = problem.accepted ? problem.point : 0;
                                row += ` | `+`${problemPoint}`.padEnd(4);
                            }
                            row += " |\n";
                            table += row;
                        }
                        table = toFullWidth(table);
                        // tableの先頭と最後にバッククオートを追加
                        table = "```\n" + table + "```";
                        console.log(table);
                        await interaction.channel.send(table);
                    } catch (error) {
                        console.error(`error in makeVirtualContest : ${error}`);
                    }
                }
            });
            if(duringContest){

            }
        });
    }
};
// 半角英数字を全角に変換する関数
function toFullWidth(str) {
    return str.replace(/[A-Za-z0-9!-~]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    }).replace(/ /g, '　');
}