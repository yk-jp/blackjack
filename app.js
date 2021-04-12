const Card = require('./models/card'); 
const Deck = require('./models/deck'); 
const Table = require('./models/table');


const AI = require('./models/_player/ai');


// aiのクラスはuserと一緒になるはず。userクラスを継承してaiクラスを作成する。
let ai = new AI("ai","blackjack");

console.log(ai.promptPlayer());



// let table1 = new Table("blackjack");
// while(table1.gamePhase != 'roundOver'){
//     table1.haveTurn();
// }

// 初期状態では、ハウスと2人以上のA.Iプレーヤーが戦います。
// console.log(table1.resultsLog);