const Card = require('./card');
const GameDecision = require('./gameDecision');

class Player {
  /*
      String name : プレイヤーの名前
      String type : プレイヤータイプ。{'ai', 'user', 'house'}から選択。
      String gameType : {'blackjack'}から選択。プレイヤーの初期化方法を決定するために使用されます。
      ?Number chips : ゲーム開始に必要なチップ。デフォルトは400。
      gameStatus: プレイヤーの状態やアクションを表す文字列。{"betting", "bet", "surrender", "stand", "hit", "double", "blackjack", "bust", "broke"}
  */
  constructor(name, type, gameType, chips = 400) {
    // プレイヤーの名前
    this.name = name;

    // プレイヤーのタイプ
    this.type = type;

    // 現在のゲームタイプ
    this.gameType = gameType;

    // プレイヤーの手札
    this.hand = [];

    // プレイヤーが所持しているチップ。
    this.chips = chips;

    // 現在のラウンドでのベットしているチップ
    this.bet = 0;

    // 勝利金額。正の数にも負の数にもなります。
    this.winAmount = 0;

    // プレイヤーのゲームの状態やアクションを表します。
    // ブラックジャックの場合、最初の状態は「betting」です。
    this.gameStatus = 'betting';
  }

  /*
     ?Number userData : モデル外から渡されるパラメータ。nullになることもあります。
     return GameDecision : 状態を考慮した上で、プレイヤーが行った決定。

      このメソッドは、どのようなベットやアクションを取るべきかというプレイヤーの決定を取得します。プレイヤーのタイプ、ハンド、チップの状態を読み取り、GameDecisionを返します。パラメータにuserData使うことによって、プレイヤーが「user」の場合、このメソッドにユーザーの情報を渡すことができますし、プレイヤーが 「ai」の場合、 userDataがデフォルトとしてnullを使います。
  */
  promptPlayer(userData = null) {
    //TODO: ここから挙動をコードしてください。
    /*
    GameDecision(action, amount) :

    String action: // {'bet', 'surrender', 'stand', 'hit', 'double'}から設定します。
    Number amount: // プレイヤーがベットする場合のみ使われます。他のゲームでも使う可能性があります。

    */
    let gameDecision = null;

    if (userData.type = "user") {
      this.chips += userData.chips;
      this.bet = userData.bet;
      this.gameStatus = userData.gameStatus;
      gameDecision = new GameDecsion(this.gameStatus, this.bet);
    } else if (userData.type = "house") {

    } else {
      // userData.type=="ai"  →　userData=nullとして使う。　aiはsurrenderなし。
      let handScore = this.getHandScore();
      
      if (handScore < 17) this.gameStatus = "hit";
      else if (17 <= handScore && handScore < 20) {
        // 8:2 →　stand : hit
        let random = Math.floor(Math.random() * 5);
        this.gameStatus = (random != 5) ? "stand" : "hit";
      } else if (handScore == 21) this.gameStatus = "blackjack";
      else this.gameStatus = "bust";

    }

    return gameDecision;
  }

  /*
     return Number : 手札の合計

     合計が21を超える場合、手札の各エースについて、合計が21以下になるまで10を引きます。
  */
  getHandScore() {
    let totalScore = 0;
    this.hand = [];
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