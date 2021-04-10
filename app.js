const Card = require('./models/card'); 
const Deck = require('./models/deck'); 
const Player = require('./models/player');
let deck = new Deck();
let player = new Player();
// create card
// console.log(deck.cards); 

// totalScore 
console.log(player.getHandScore());

