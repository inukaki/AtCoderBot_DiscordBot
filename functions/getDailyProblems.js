const axios = require('axios');

// 今日の一問を所得する関数
async function getDailyProblems() {
    const url = 'http://api:3000/api/daily';
    try {
        const response = await axios.get(url);
        const dailyProblem = response.data;
        return dailyProblem;
    } catch (error) {
        console.error(`error in getDailyProblem: ${error}`);
    }
}

module.exports = getDailyProblems;