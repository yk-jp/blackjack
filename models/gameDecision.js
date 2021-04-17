class GameDecision {
  /*
     String action : プレイヤーのアクションの選択。（ブラックジャックでは、bet, hit、stand, double, surrender）
     Number bet : betする値。actionがbetでないとき　& playerがhouseの時null
  */
  constructor(action, bet = null) {
    // アクション
    this.action = action;
    // bet 
    this.bet = bet;
  }
}

module.exports = GameDecision;