class Player {
  /*
      String name : プレイヤーの名前
      String gameType : {'blackjack'}から選択。プレイヤーの初期化方法を決定するために使用されます。
      boolean judgeByRatio(ratio) : 引数により確率を操作する。 　高確率　 →　true　 低確率　　→　false　　(e.g 7:3 →　posibility(7,3) →　true : false)
  */

  constructor(name, gameType) {
    // プレイヤーの名前
    this.name = name;

    // 現在のゲームタイプ
    this.gameType = gameType;

    // プレイヤーの手札
    this.hand = [];

    // playerの状態
    this.status = "bet";

    // playerのaction
    this.action = "bet";
  }

  // 各継承先クラスで実装
  prompt() { }

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

  // boolean: blackjackか判定
  blackjack() {
    return this.getHandScore() == 21;
  }

  // boolean: "A"を持つblackjackか判定
  blackjackAndHasAce() {
    let scoreIsBlackJack = this.blackjack();
    if (scoreIsBlackJack) {
      this.hand.forEach(card => {
        if (card.rank == "A") return true;
      })
    }
    return false;
  }

  // used for possibility
  judgeByRatio(ratio) {
    const random = Math.floor(Math.random() * 10) + 1;　//1～10
    return random <= ratio;
  }

  // statusを変更する
  switchStatus() {}
}

module.exports = Player;