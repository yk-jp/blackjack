class GameDecision {
  /*
     String action : プレイヤーのアクションの選択。（ブラックジャックでは、hit、standなど。）
     Player.statusと同じ。　→　{"betting", "bet", "surrender", "stand", "hit", "double", "blackjack", "bust", "broke"}
     Number amount : プレイヤーが選択する数値。

     これはPlayer.promptPlayer()は常にreturnする、標準化されたフォーマットです。
  */
  constructor(action, amount) {
    // アクション
    this.action = action;

    // プレイヤーが選択する数値
    this.amount = amount
  }
}

module.exports = GameDecision;