const Player = require('../player');
const GameDecision = require('../gameDecision');

/* overview
  継承 
    name : player名
    gameType(blackjack)
    hand : 手札
    void getHandScore() : Number →　playerの手札の点数を返す。
    bet :　roundごとにいくらかけるか

  Userに必要な変数、メソッド
    chip(default = 400)　:　所持金
    winAmount : 勝利したときの金額
    status : 現在のplayerのstatus　→ {bet,playing,broke}
    } 
    action : 現在のplayerのaction  →　{bet,stand,hit,double,surrender,broke}
    gameDecision prompt(): GameDecisionクラスを返す　自動的に判断するような設計が必須 　　※player classの更新はしない(tableクラス　evaluateMove()で更新)
*/

/* prompt()の処理
    以下の2点
     1.bet
     2.playing(betした後の処理)
*/

class User extends Player {
  static statusForBlackjack = {
    "bet": "playing",
    "playing": "bet",
    "broke": "broke"
  };

  constructor(name, gameType) {
    super(name, gameType);
    this.bet = 0;
    this.chip = 400;
    this.winAmount = 0;
    this.action = "bet";
    this.type = "user";
  }

  /* return GameDecision class (action,bet)
     status=bet → return (action("bet"),bet)
     status=playing →　return (action,null)
     satatus = broke →　return (bust)
  */
  prompt(userData) {
    if (this.status == "bet") return new GameDecision("bet", userData);
    else if (this.status == "playing") {
      let promptAction = userData;
      let handScore = this.getHandScore();
      if (handScore > 21) promptAction = "bust";
      return new GameDecision(userData, this.bet);
    }
    return new GameDecision("broke", 0);
  }

  switchStatus(gameType) {
    if (gameType == "blackjack") {
      if (this.chip <= 0) this.status = User.statusForBlackjack["broke"];
      else this.status = User.statusForBlackjack[this.status];
    }
  }
}

module.exports = User;