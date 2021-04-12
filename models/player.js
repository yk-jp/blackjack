const Card = require('./card');
const GameDecision = require('./gameDecision');

class Player {
  /*
      String name : プレイヤーの名前
      String gameType : {'blackjack'}から選択。プレイヤーの初期化方法を決定するために使用されます。
     
      gameStatus: プレイヤーの状態やアクションを表す文字列。{"bet", "surrender", "stand", "hit", "double", "blackjack", "bust", "broke"}
  */
  constructor(name, gameType) {
    // プレイヤーの名前
    this.name = name;

    // 現在のゲームタイプ
    this.gameType = gameType;

    // プレイヤーの手札
    this.hand = [];

    // playerの状態
    this.playerStatus = "bet";
  }
  
  /*
     return Number : 手札の合計

     合計が21を超える場合、手札の各エースについて、合計が21以下になるまで10を引く。
  */
  getHandScore() {
    let totalScore = 0;
    this.hand.forEach(card => {
      totalScore += card.getRankNumber();
    });

    // スコアが21未満になるまで suit="A"を1として計算
    if (totalScore > 21) {
      let i = 0;
      while (totalScore > 21 && i < this.hand.length) {
        // A: 11→1  total-11+1 = total-10
        if (this.hand[i].rank == "A") totalScore -= 10;
        i++;
      }
    }
    return totalScore;
  }
}

module.exports = Player;