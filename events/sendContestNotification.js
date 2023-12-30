const { get } = require("http");

async function sendContestNotification(guildID) {

    const channelID = getContestChannelId(guildId);
    await channel.send(`今週のコンテストはこちらです。\n${contestName}\n${contestUrl}`);
    console.log(`今週のコンテストはこちらです。\n${contestName}\n${contestUrl}`);
}

// コンテスト情報を送るチャンネルIDを取得する関数
async function getContestChannelId(guildId) {
    // const url = '';
    // try {
    //     const response = await axios.get(url);
    //     const contestChannelId = response.data.contestChannelId;
    //     return contestChannelId;
    // } catch (error) {
    //     console.error(`error in getContestChannelId: ${error}`);
    // }
    console.log('コンテストチャンネルIDを取得する機能は後でちゃんと書いてね');
}