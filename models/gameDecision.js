class GameDecision {
  /*
     String action : プレイヤーのアクションの選択。（ブラックジャックでは、hit、standなど。）
     Player.statusと同じ。　→　{"betting", "bet", "surrender", "stand", "hit", "double", "blackjack", "bust", "broke"}
     Number bet : betする値。初回のみのため、nullをdefault

     これはPlayer.promptPlayer()は常にreturnする、標準化されたフォーマットです。
  */
  constructor(action, bet = null) {
    // アクション
    this.action = action;

    // bet 
    this.bet = bet;
  }
}

module.exports = GameDecision;