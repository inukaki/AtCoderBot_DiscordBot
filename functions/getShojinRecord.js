const axios = require('axios');

// 精進記録を獲得する関数
async function getShojinRecord(guildId) {

    // nowに現在時
    const now = new Date();
    const nowUnixTime = Math.floor(now.getTime()/1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneWeekAgoUnixTime = Math.floor(oneWeekAgo.getTime()/1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneMonthAgoUnixTime = Math.floor(oneMonthAgo.getTime()/1000);

    const url = `http://api:3000/api/results/server/`+guildId;
    console.log(url);

    console.log(nowUnixTime, oneWeekAgoUnixTime);
    const data = {
        from: oneWeekAgoUnixTime,
        to: nowUnixTime
    };
    try {
        const response = await axios.get(url, {params:data});
        console.log(JSON.stringify(response.data, null, 2));//レスポンスを整形して出力
        return response.data;
    } catch (error) {
        console.error(`error in getShojinRecord : ${error}`);
        return [];
    }
}

module.exports = getShojinRecord;