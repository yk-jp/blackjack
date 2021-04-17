const Card = require('./models/card');
const Deck = require('./models/deck');
const Table = require('./models/table');
const AI = require('./models/_player/ai');

// aiのクラスはuserと一緒になるはず。userクラスを継承してaiクラスを作成する。
let ai = new AI("ai", "blackjack");

let table = new Table("blackjack");
while (table.gamePhase != 'roundOver') {
    table.haveTurn();
}
console.log(table.resultsLog);

console.log(table.players);

table.gamePhase="betting";

while (table.gamePhase != 'roundOver') {
    table.haveTurn();
}
console.log(table.resultsLog);

console.log(table.players);
