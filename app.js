const Card = require('./models/card'); 
const Deck = require('./models/deck'); 
const Table = require('./models/table');
const AI = require('./models/_player/ai');


// aiのクラスはuserと一緒になるはず。userクラスを継承してaiクラスを作成する。
let ai = new AI("ai","blackjack");


let table = new Table("blackjack");
while(table.gamePhase != 'roundOver'){
    table.haveTurn();
}

// 初期状態では、ハウスと2人以上のA.Iプレーヤーが戦います。
// console.log(table1.resultsLog);