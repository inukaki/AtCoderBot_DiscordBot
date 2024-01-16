const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { get } = require('http');
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
        let problemsColors = [];
        for(color in problemsCounts){
            for(var i = 0; i < problemsCounts[color]; i++){
                problemsColors.push(color);
            }
        }
        const members = await getAtcoderIDs(interaction.guildId);
        console.log(members);
        // const members = ["inukaki", "maisuma"];
        const guildId = interaction.guildId.toString();
        const visible = "discordOnly";
        // console.log(problems);

        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();
        const JapaneseTime = new Date(todayYear, todayMonth, todayDate, contestTimeHours, contestTimeMinutes, 0);
        const time = new Date(JapaneseTime.getTime() - 9 * 60 * 60 * 1000);
        const contestTime = Math.floor(time.getTime()/1000);
        const startAtMinute = time.getMinutes();
        const startAtHours = time.getHours();
        const endTime = new Date(time.getTime() + contestDuration * 1000);
        const endAtHours = endTime.getHours();
        const endAtMinutes = endTime.getMinutes();

        // console.log(contestName, contestTime, contestDuration, members, guildId, visible, problemsColors)
        contestID = await makeVirtualContest(contestName, contestTime, contestDuration, members, guildId, visible, problemsColors);
        // const startAt = new Date(contestTime);
        // const startAtMinute = startAt.getMinutes();
        // const startAtHours = startAt.getHours();

        var duringContest = false;
        var pong;

        cron.schedule("* * * * * *", async () => {
            var url;
            var resultsUrl;
            
            cron.schedule(`0,10,20,30,40,50 ${startAtMinute} ${startAtHours} * * *`, async () => {
                // cron.schedule(`0 ${startAtMinute} ${startAtHours} * * *`, async () => {
                // console.log(contestName, contestTime, contestDuration, members, guildId, visible, problems)
                var text = "";
                if(!duringContest && text == ""){
                    // console.log(contestName, contestTime, contestDuration, members, guildId, visible, problemsColors)
                    // contestID = await makeVirtualContest(contestName, contestTime, contestDuration, members, guildId, visible, problemsColors);
                    // var text = "";
                    duringContest = true;
                    // setMaxIdleHTTPParsers(10);
                    url = 'http://api:3000/api/virtual_contests/'+contestID;
                    resultsUrl = `http://api:3000/api/virtual_contests/standings/${contestID}`;

                    try {
                        text = await startVirtualContest(contestID, interaction);
                        await interaction.channel.send(text);

                        // duringContest = true;
                        // response = await axios.get(url);
                        // const contest = response.data;
                        // // contest.startAtを日本時間に変換
                        // const startAt = new Date(contest.startAt * 1000 + 9 * 60 * 60 * 1000);
                        // const startAtHours = startAt.getHours();
                        // const startAtMinutes = startAt.getMinutes()
                        // const endTime = new Date(startAt.getTime() + contest.durationSecond * 1000);
                        // const endAtHours = endTime.getHours();
                        // const endAtMinutes = endTime.getMinutes();
                        // console.log(contest);
                        // text += `${contest.title}が始まりました！\n`+
                        //         `開始時刻: ${startAtHours}:${startAtMinutes}\n`+
                        //         `終了時刻: ${endAtHours}:${endAtMinutes}\n`;
                        // var points = "配点\n";
                        // var problems = "問題一覧\n";
                        // for(const problem of contest.problems){
                        //     points += `-${problem.point}`;
                        //     problems += `https://atcoder.jp/contests/${problem.contestID}/tasks/${problem.problemID}\n`;
                        // }
                        // points += "-\n";
                        // text += points;
                        // text += problems;
                        // console.log(text);
                        // await interaction.channel.send(text);

                        // コンテストの成績表を作成
                        const table = await sendVirtualContestResults(contestID);

                        // 成績表を送信
                        pong = await interaction.channel.send(table);
                    } catch (error) {
                        console.error(`error in startVirtualContest : ${error}`);
                    }
                }
            });
            cron.schedule(`0 * * * * *`, async () => {
                if(duringContest){
                    // コンテストの成績表を送信
                    response = await axios.get(resultsUrl);
                    results = response.data;
                    try{
                        // 送信するテキストを作成
                        const table = await sendVirtualContestResults(contestID, interaction);
                        
                        await pong.fetch(pong.id)
                        .then(message => {
                            message.edit(table);
                        })
                        .catch(console.error);
                    }catch(error){
                        console.error(`error in duringContest : ${error}`);
                    }
                }
            });
            cron.schedule(`0,10,20,30,40,50 ${endAtMinutes} ${endAtHours} * * *`, async () => {
                if(duringContest){
                    duringContest = false;
                    response = await axios.get(url);
                    const contest = response.data;
                    await interaction.channel.send(`${contest.title}が終了しました！`);
                }
            });
        });
    }
};
// 半角英数字を全角に変換する関数
function toFullWidth(str) {
    return str.replace(/[A-Za-z0-9!-~]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    }).replace(/ /g, '　');
}

// コンテストを作成する関数返り値はコンテストID
async function makeVirtualContest(contestName, contestTime, contestDuration, members, guildId, visible, problems) {
    var contestID;
    const url = 'http://api:3000/api/virtual_contests';
    const data = {
        startAt: contestTime,
        durationSecond: contestDuration,
        title: contestName,
        visible: visible,
        serverID: guildId,
        members: members,
        problems: problems
    };
    // コンテストを作成
    try {
        console.log(data);
        const response = await axios.post(url, data);
        contestID = response.data.virtualContestID;
    } catch (error) {
        console.error(`error in makeVirtualContest : ${error}`);
    }
    return contestID;
}

// コンテストの成績表を作成
async function sendVirtualContestResults(contestID){
    const resultsUrl = `http://api:3000/api/virtual_contests/standings/${contestID}`;

    var response = await axios.get(resultsUrl)
        .catch(error => {
            console.error(`error in sendVirtualContestResults : ${error}`);
        });
    const results = response.data;
    
    // 送信するテキストを作成
    let table = "| " + "順位".padEnd(2)+ " | " + "参加者".padEnd(3) + " | " + "総得点".padEnd(4) + " | ";
    let horizontalBar = "".padEnd(4,"-") + "".padEnd(7,"-") + "".padEnd(7,"-");
    for(let problem of results[0].problems){
        table += `${problem.problemIndex}`.padEnd(4) + " | ";
        horizontalBar += ``.padEnd(7,"-");
    }
    table += "\n";
    table += horizontalBar + "-\n";
    var ranking = 1;
    for (let contestant of results) {
        let row = "| " + `${ranking}`.padEnd(2) + ` | `+`${contestant.atcoderID}`.substring(0, 3).padEnd(3)+` | `+ `${contestant.point}`.padEnd(4) ;
        for (let problem of contestant.problems) {
            let problemPoint = problem.accepted ? problem.point : 0;
            row += ` | `+`${problemPoint}`.padEnd(4);
        }
        row += " |\n";
        table += row;
        ranking++;
    }
    table = toFullWidth(table);
    // tableの先頭と最後にバッククオートを追加
    table = "```\n" + table + "```";

    return table;
}

// バーチャルコンテストの開始を宣言
async function startVirtualContest(contestID, interaction){
    const url = `http://api:3000/api/virtual_contests/${contestID}`;
    try{
        const response = await axios.get(url);
        const contest = response.data;
        // contest.startAtを日本時間に変換
        const startAt = new Date(contest.startAt * 1000 + 9 * 60 * 60 * 1000);
        const startAtHours = startAt.getHours();
        const startAtMinutes = startAt.getMinutes()
        const endTime = new Date(startAt.getTime() + contest.durationSecond * 1000);
        const endAtHours = endTime.getHours();
        const endAtMinutes = endTime.getMinutes();
        console.log(contest);
        var text = `${contest.title}が始まりました！\n`+
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
        return text;
    }catch(error){
        console.error(`error in startVirtualContest : ${error}`);
    }
}
// 精進通知に登録されているユーザーのatcoderIDを所得する関数
async function getAtcoderIDs(guildId){
    const url = `http://api:3000/api/servers/${guildId}`;
    try {
        const response = await axios.get(url);
        const users = response.data.members;
        var atcoderIDs = [];
        for(const user of users){
            const atcoderID = await getAtcoderID(user);
            atcoderIDs.push(atcoderID);
        }
        console.log(atcoderIDs);
        return atcoderIDs;
    } catch (error) {
        console.error(`error in getAtcoderIDs: ${error}`);
    }
}

// discordのユーザーIDからatcoderIDを所得する関数
async function getAtcoderID(discordId){
    const url = `http://api:3000/api/users/${discordId}`;
    try {
        const response = await axios.get(url);
        const user = response.data;
        const atcoderID = user.atcoderID;
        return atcoderID;
    } catch (error) {
        console.error(`error in getAtcoderID: ${error}`);
    }
}