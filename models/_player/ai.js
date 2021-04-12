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
    playerStatus : 現在のplayerのstatus　→ {bet,playing,broke,bust,blackjack} 
    playerAction : 現在のplayerのaction  →　{stand, hit, double,surrender}
    gameStatus : blackjackのはじめはbetting　{betting,playing, roundOver, gameOver(userがbustしたとき)}  →　tableクラスのみ所持していればよいのかも知れない 
    gameDecision prompt(): aiのクラスを返す。自動的に判断するような設計が必須

    Number judgeByRatio(ratio1, ratio2) : 引数により確率を操作する。(e.g 7:3 →　posibility(7,3))
*/  

/* prompt()の処理
    以下の2点
     1.bet
     2.playing(betした後の処理)
   
   1.playerStatus = bet
     
     chip > 400  →　bet = 5:5 = 100 : 200 
     chip <= 400(default) →　bet = 8:2 = 50 : 100
     chip <= 150 = 7:3 = chip/2 : all 

   2. playerStatus = playing aiは、playing状態 userのように慎重な(中々bustしない or brokeしない)aiを作成する。 　
    　
  　判断 → chip , 手札(hand)
  　  
      chip: defaultの400 <=chip →　doubleする時を作成する。9:1 = hit: doubleにする。
            ※doubleの時は、手札が2枚であることを考慮する。

      hand: bustを避ける動きを作る。
      　　　 score < 17 →　13～16の間の時、9:1の確率で、hit:doubleをする。それ以下は、hit
                                    
            score = 16、17 → 3:4:3 = hit : stand : surrender
          　18<= score <= 20　→　なるべく勝負にかけないようにする。9:1の確率で、stand:hitをする。
            score = 21　→　blackjackで処理を終了 
            score > 21 → bust
*/

class AI extends Player{ 
  constructor() { 
    super();
    this.chip = 400;
    this.bet = 0;
    this.winAmount = 0;
    this.playerAction = null;
  }

  prompt() { 
    if(this.playerStatus == "bet") { 
      // 1.bet



    } else if(this.playerStatus == "playing"){
      // 2.playingの時
      let numOfHand = this.hand.length;
      let handScore = this.getHandScore();
        if (handScore < 17){
          if(handScore < 13) 
  
  
          this.gameStatus = "hit";
        } 
  
  
  
  
  
        else if (17 <= handScore && handScore < 20) {
          // 8:2 →　stand : hit
          let random = Math.floor(Math.random() * 10);
          this.gameStatus = (random != 9) ? "stand" : "hit";
        } else if (handScore == 21) this.gameStatus = "blackjack";
        else this.gameStatus = "bust";
    }
  }


  judgeByRatio(ratio1,ratio2) { 

  }


}

module.exports = AI;