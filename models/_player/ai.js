const Player = require('../player');
const GameDecision = require('../gameDecision');

/* overview
  継承 
    name : player名
    gameType(blackjack)
    hand : 手札
    void getHandScore() : Number →　playerの手札の点数を返す。

  AIに必要な変数、メソッド
    chip(default = 400)　:　所持金
    bet :　roundごとにいくらかけるか
    winAmount : 勝利したときの金額
    playerStatus : 現在のplayerのstatus　→ {bet,playing,broke}
    } 
    playerAction : 現在のplayerのaction  →　{bet,stand, hit, double,surrender}
    gameStatus : blackjackのはじめはbetting　{betting,playing, roundOver, gameOver(userがbustしたとき)}  →　tableクラスのみ所持していればよいのかも知れない 
    gameDecision prompt(): GameDecisionクラスを返す　自動的に判断するような設計が必須 　　※player classの更新はしない(tableクラス　evaluateMove()で更新)

    boolean judgeByRatio(ratio) : 引数により確率を操作する。 　高確率　 →　true　 低確率　　→　false　　(e.g 7:3 →　posibility(7,3) →　true : false)
*/

/* prompt()の処理
    以下の2点
     1.bet
     2.playing(betした後の処理)
   
   1.playerStatus = bet
     
     chip > 400  →　bet = 5:5 = 100 : 200 
     chip <= 400(default) →　bet = 8:2 = 50 : 100
     chip <= 150 = 7:3 = chip/2 : all chips

   2. playerStatus = playing aiは、playing状態 userのように慎重な(中々bustしない or brokeしない)aiを作成する。 　
    　
   判断 → chip , 手札(hand)
     
      chip: defaultの400 <=chip →　doubleする時を作成する。9:1 = hit: doubleにする。
            ※doubleの時は、手札が2枚であることを考慮する。

      hand: bustを避ける動きを作る。
          score < 17 →　13～15の間の時、9:1の確率で、hit:doubleをする。13より小さい場合は、hit
                                    
            score = 16、17 → 3:4:3 = hit : stand : surrender
           18<= score <= 20　→　なるべく勝負にかけないようにする。9:1の確率で、stand:hitをする。
            score = 21　→　stand(blackjackで処理を終了) 
            score > 21 → bust
*/

class AI extends Player {
  constructor() {
    super();
    this.chip = 400;
    this.bet = 0;
    this.winAmount = 0;
    this.playerAction = null;
  }

  /* return GameDecision class (action,bet)
     playerStatus=bet -> return (action("bet"),bet)
     playerStatus=playing -> return (action,null)

  */
  prompt() {
    let promptBet = null;
    let promptAction = null;
    if (this.playerStatus == "bet") {
      promptAction = "bet";
      // 1.bet
      if (this.chip > 400) promptBet = this.judgeByRatio(5) ? 100 : 200;
      else if (150 < this.chip && this.chip <= 400) promptBet = this.judgeByRatio(8) ? 50 : 100;
      else promptBet = this.judgeByRatio(7) ? Math.floor(this.chip / 2) : this.chip;
    } else if (this.playerStatus == "playing") {
      // 2.playingの時
      let numOfHand = this.hand.length;
      let handScore = this.getHandScore();
      if (handScore < 17) {
        if (handScore < 13) promptAction = "hit";
        else if (13 <= handScore) promptAction = this.judgeByRatio(9) ? "hit" : !numOfHand == 2 ? "hit" : "double"; //手札が2枚のみdoubleが可能
      }
      else if (handScore == 16 || handScore == 17) {
        // 3:4:3 = hit : stand : surrender 
        if (judgeByRatio(7)) {
          // 1回目7:3 →　hit or stand : surrender
          promptAction = "hit";
          // 2回目 hit or stand
          if (judgeByRatio(4)) promptAction = "stand";
        } else {
          promptAction = "surrender";
        }
      }
      else if (18 <= handScore && handScore <= 20) {
        // 9:1 →　stand : hit
        promptAction = this.judgeByRatio(9) ? "stand" : "hit";
      } else if (handScore == 21) promptAction = "blackjack";
      else promptAction = "bust";
    }

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

module.exports = AI;