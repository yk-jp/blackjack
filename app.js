const Table = require('./models/table');


let table1 = new Table("blackjack","ai");

while(table1.gamePhase != 'roundOver') table1.haveTurn();



// 初期状態では、ハウスと2人以上のA.Iプレーヤーが戦います。
console.log(table1.gamePhase);
console.log(table1.players);