const Table = require('./models/table');


let table1 = new Table("blackjack","ai");

table1.haveTurn();


// 初期状態では、ハウスと2人以上のA.Iプレーヤーが戦います。
console.log(table1.gamePhase);
