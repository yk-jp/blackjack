class GameDecision {
  /*
     String action : プレイヤーのアクションの選択。（ブラックジャックでは、bet, hit、stand, double, surrender）
     Number bet : betする値。actionがbetでないとき　& playerがhouseの時-1
  */
  constructor(action, bet = -1) {
    this.action = action;
    this.bet = bet;
  }
}

module.exports = GameDecision;