class Card {
  /*
     String suit : {"H", "D", "C", "S"}
     String rank : {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"}
  */

  static suit = ["H", "D", "C", "S"];
  static rank = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  /*
     return Number : カードのランクを基準とした整数のスコア。
     
      2-10はそのまま数値を返します。
     {"J", "Q", "K"}を含む、フェースカードは10を返します。
      "A」が1なのか11なのかを判断するには手札全体の知識が必要なので、「A」はとりあえず11を返します。
  */

  getRankNumber() {
    if (("JQK").indexOf(this.rank) != -1) {
      return 10;
    } else if (this.rank == "A") {
      // 仮の値
      return 11;
    }
  
    return parseInt(this.rank);
  }
}

module.exports = Card;