// const express = require('express');
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// const app = express();

// // static files
// app.use(express.static('public'));
// app.use('/css',express.static(__dirname +'public/css'));
// app.use('/js',express.static(__dirname +'public/js'));
// app.use('/img',express.static(__dirname +'public/img'));

// app.get('/', (req, res) =>  { 
//   res.sendFile(__dirname + '/views/index.html');
// });

// const port = process.env.PORT || 3000;

// app.listen(port, () => { 
//   console.log(`Server listening on ${port}`);
// })


let table1 = new Table("ai", "blackjack");
while(table1.gamePhase != 'roundOver'){
    table1.haveTurn();
}
table1.gamePhase = "waitingForBets";
while(table1.gamePhase != 'roundOver'){
  table1.haveTurn();
}

// 初期状態では、ハウスと2人以上のA.Iプレーヤーが戦います。
console.log(table1.resultsLog);