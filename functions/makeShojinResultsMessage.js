const toFillWidth = require('../functions/toFullWidth');

async function makeShojinResultsMessage(data){
    
    const colorToEmoji = {
        'Gray': '🩶',
        'Brown': '🤎',
        'Green': '💚',
        'Cyan': '🩵',
        'Blue': '💙',
        'Yellow': '💛',
        'Orange': '🧡',
        'Red': '💝',
        'Sum': '📊'
    };

    var users=[];

    data.results.map(user => {
        var difficultyCount ={
            Gray: 0,
            Brown: 0,
            Green: 0,
            Cyan: 0,
            Blue: 0,
            Yellow: 0,
            Orange: 0,
            Red: 0,
            Sum: 0
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
            difficultyCount.Sum++;
        });
        // usersにユーザー名と問題数を追加
        if(difficultyCount.Sum === 0) return;
        users.push({atcoderID: user.atcoderID, difficultyCount: difficultyCount});
    });
    // サンプルデータ
    // users = [
    //     {atcoderID: 'inukaki', difficultyCount: {Gray: 0, Brown: 1, Green: 0, Cyan: 0, Blue: 0, Yellow: 0, Orange: 0, Red: 0, Sum: 1}},
    //     {atcoderID: 'maisuma', difficultyCount: {Gray: 2, Brown: 1, Green: 0, Cyan: 6, Blue: 0, Yellow: 0, Orange: 0, Red: 3, Sum: 12}},
    //     {atcoderID: 'sentou', difficultyCount: {Gray: 2, Brown: 1, Green: 0, Cyan: 0, Blue: 0, Yellow: 0, Orange: 0, Red: 0, Sum: 3}},
    //     {atcoderID: 'hainya', difficultyCount: {Gray: 5, Brown: 1, Green: 0, Cyan: 0, Blue: 0, Yellow: 0, Orange: 0, Red: 0, Sum: 6}}
    // ];
    // usersを問題数の多い順にソート
    users.sort((a, b) => b.difficultyCount.Sum - a.difficultyCount.Sum);

//  |ＡｔＣｏｄｅｒＩＤ　|　🩶　|　🤎　|　💚　|　🩵　|　💙　|　💛　|　🧡　|　💝　|　📊　|
//  ------------------------------------------------------------------------------
//  |ｉｎｕｋａｋｉ　　　|　０　｜　１　｜　０　｜　０　｜　０　｜　０　｜　０　｜　０　｜　１　｜
    var results = '```'+ '\n';
    results += `|${toFillWidth("AtCoderID")}`.padEnd(11, '　') + '|';
    results += Object.entries(colorToEmoji).map(([color, emoji]) => {
        return `　${emoji}　`;
    }).join("|")+ '|\n';
    results += "".padStart(78, '-') + '\n';
    users.forEach(user => {
        results += `|${toFillWidth(user.atcoderID)}`.padEnd(11, '　') + '|';
        results += Object.entries(user.difficultyCount).map(([color, count]) => {
            return `　${toFillWidth(String(count))}`.padEnd(3, '　') + '｜';
        }).join('') + '\n';
    });
    results += '```';

    const reply = `今週の精進記録\n${results}`;

    return reply;
}

module.exports = makeShojinResultsMessage;