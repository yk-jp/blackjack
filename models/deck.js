const Card = require('./card');

class Deck {
  /*
     String gameType : ゲームタイプの指定。{'blackjack'}から選択。
  */
  constructor(gameType) {
    // このデッキが扱うゲームタイプ
    this.gameType = gameType;

    // カードの配列
    this.cards = [];

    // ゲームタイプによって、カードを初期化してください。
    this.resetDeck(this.gameType);
  }

  /*
     return null : このメソッドは、デッキの状態を更新します。

     カードがランダムな順番になるようにデッキをシャッフルします。
  */
  shuffle() {
    //TODO: ここから挙動をコードしてください。
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
  resetDeck(gameType) {
    this.cards = [];
    for (let i = 0; i < Card.suit.length; i++) {
      for (let j = 0; j < Card.rank.length; j++) {
        this.cards.push(new Card(Card.suit[i], Card.rank[j]));
      }
    }
    
    this.shuffle();
  }

  /*
     return Card : ポップされたカードを返します。
     カード配列から先頭のカード要素をポップして返します。
  */
  drawOne() {
    //TODO: code behavior here
    return this.cards.pop();
  }
}

module.exports = Deck;
