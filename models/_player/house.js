const Player = require('../player');
const GameDecision = require('../gameDecision');

/* overview
  継承 
    name : player名
    gameType(blackjack)
    hand : 手札
    void getHandScore() : Number →　playerの手札の点数を返す。
    bet : houseにnullを代入

  houseに必要な変数、メソッド
    playerStatus : 現在のplayerのstatus　→ {waiting,playing}
    } 
    playerAction : 現在のplayerのaction  →　{waiting,stand,hit} bet,surrender,doubleしない。 
    gameDecision prompt(): GameDecisionクラスを返す　自動的に判断するような設計が必須  ※player classの更新はしない(tableクラス　evaluateMove()で更新)
*/

/* prompt()の処理
    以下の2点
     1.playerのbetを待つ。

     2.playing(1の後の処理)　 ※houseは、17以上になるまでカードを引き続けることを考慮。17<=scoreでstandできる

   1.playerStatus = waiting
     playerAction = waiting、bet=nullgameDecisionクラスを返す ※ GameDecisionクラスで、betはdefault = null

   2. playerStatus = playing aiと同様に、中々bustしないhouseを作成する。※houseは、17以上になるまでカードを引き続けることを考慮。 　
    　
      手札(hand)
      hand: bustを避ける動きを作る。
      score < 17　→　　hit
      17 = score → 7:3 → stand : hit 
      18 <= score <= 20 → 9:1 = stand : hit
      21 = score →　stand(blackjackで処理を終了) 
      score > 21 → bust
*/

class House extends Player {
  constructor(name, gameType) {
    super(name, gameType);
    this.playerStatus = "waiting";
  }

  /* return GameDecision class (action,bet)
     playerStatus=waiting -> return (action("waiting"))
     playerStatus=playing -> return (action)

  */
  prompt() {
    if (this.playerStatus == "waiting") return new GameDecision("playing");
    else if (this.playerStatus == "playing") {
      let promptAction = null;
      let handScore = this.getHandScore();
      if (handScore < 17) promptAction = "hit";
      else if (handScore == 17) promptAction = this.judgeByRatio(7) ? "stand" : "hit";
      else if (18 <= handScore && handScore <= 20) promptAction = this.judgeByRatio(9) ? "stand" : "hit";
      else if (handScore == 21) promptAction = "stand";
      else if (handScore > 21) promptAction = "bust";

      return new GameDecision(promptAction);
    }
  }
}

module.exports = House;