const Card = require('./card');

class Deck {
  /*
     String gameType : ゲームタイプの指定。{'blackjack'}から選択。
  */
  constructor(gameType = null) {
    // このデッキが扱うゲームタイプ
    this.gameType = gameType;

    // カードの配列
    this.cards = [];

    // ゲームタイプによって、カードを初期化
    this.resetDeck(this.gameType);
  }

  shuffle() {
    // Math.random() * (max - min) + minでmin-max未満のランダムな数を生成することができます。
    for (let i = 0; i < this.cards.length; i++) {
      let randomNum = Math.floor(Math.random() * (this.cards.length - i));
      let temp = this.cards[i];
      this.cards[i] = this.cards[randomNum];
      this.cards[randomNum] = temp;
    }
  }

  /*
     String gameType : どのゲームにリセットするか
     return null : このメソッドは、デッキの状態を更新します。
  */
  resetDeck(gameType = null) {
    this.cards = [];
    for (let i = 0; i < Card.suit.length; i++) {
      for (let j = 0; j < Card.rank.length; j++) {
        this.cards.push(new Card(Card.suit[i], Card.rank[j]));
      }
    }
    this.shuffle();
  }

  drawOne() {
    return this.cards.pop();
  }
}

module.exports = Deck;
