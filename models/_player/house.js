const Player = require('../player');
const GameDecision = require('../gameDecision');

/* overview
  継承 
    name : player名
    gameType(blackjack)
    hand : 手札
    void getHandScore() : Number →　playerの手札の点数を返す。

  houseに必要な変数、メソッド
    bet :　roundごとにいくらかけるか
    winAmount : 勝利したときの金額
    playerStatus : 現在のplayerのstatus　→ {waiting,playing}
    } 
    playerAction : 現在のplayerのaction  →　{waiting,stand,hit,double} bet,surrenderしない。
    gameStatus : blackjackのはじめはbetting　{betting,playing, roundOver, gameOver(userがbustしたとき)}  →　tableクラスのみ所持していればよいのかも知れない 
    gameDecision prompt(): GameDecisionクラスを返す　自動的に判断するような設計が必須  ※player classの更新はしない(tableクラス　evaluateMove()で更新)

    boolean judgeByRatio(ratio) : 引数により確率を操作する。 　高確率　 →　true　 低確率　　→　false　　(e.g 7:3 →　posibility(7,3) →　true : false)
*/

/* prompt()の処理
    以下の2点
     1.playerのbetを待つ。
     2.playing(1の後の処理) ※houseは、17以上になるまでカードを引き続けることを考慮。17<=scoreでstandできる

   1.playerStatus = waiting
    　playerAction = waiting　betはnullのままで、gameDecisionクラスを返す

   2. playerStatus = playing aiと同様に、中々bustしないhouseを作成する。※houseは、17以上になるまでカードを引き続けることを考慮。 　
    　
      手札(hand)
      hand: bustを避ける動きを作る。
      score < 17　→　　hit
      17<= score 
*/

class House extends Player {
  constructor() {
    super();
    this.chip = 400;
    this.bet = 0;
    this.winAmount = 0;
    this.playerAction = null;
  }

  /* return GameDecision class (action,bet)
     playerStatus=waiting -> return (action("waiting"),null)
     playerStatus=playing -> return (action,null)

  */
  prompt() {
    let promptBet = null;
    let promptAction = null;
    
    return new GameDecision(promptAction, promptBet);
  }

  judgeByRatio(ratio) {
    const random = Math.floor(Math.random() * 10) + 1;　//1～10
    if (random <= ratio) {
      return true;
    }
    return false;
  }
}

module.exports = House;