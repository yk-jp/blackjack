const Card = require('./card');
const Deck = require('./deck');
const GameDecision = require('./gameDecision');
const AI = require('./_player/ai');
const House = require('./_player/house');

/* overview
   blackjack　gameFlow  user, ai × 2 , house の  3 player + house用  　

  変数
   turnCounter : Number → player配列へのアクセス用。剰余計算でアクセス。一巡したら1に更新。
    gameStatus : gameFlowの管理　→　{'betting', 'playing', 'evaluatingWinners, roundOver'}
    betDenominations : userがかけられるチップの単位　aiの場合使用しない
    resultLog : roundごとの結果を格納
    playerNumber : playerの数を設定　ai = 3に設定　

  メソッド
   evaluateMove() : player.prompt()が確定したら、次のplayerのturn (turnCounter + 1)

   String haveTurn() : gameStatusを返す。roundOverになったら終了。(userが、betボタン押下　→　event発火 →　gemeStatusがbettingに変更する処理をControllerで管理)  　
   処理手順は、gameFlowを表す
   1.bet (gameStatus　→　betting)
    最初のplayerから全員betする →　getTurnPlayer()でactionするplayer呼び出し
   2.cardを2枚配る。(playerがbrokeしていない) →　blackjackAssignPlayerHands()
   3.action →　prompt()でplayerStatus更新
  
*/

class Table {
  /*
     String gameType : {"blackjack"}から選択。
     Array betDenominations : プレイヤーが選択できるベットの単位。デフォルトは[5,20,50,100]。
     return Table : ゲームフェーズ、デッキ、プレイヤーが初期化されたテーブル
  */

  turnCounter = 1;

  constructor(gameType, betDenominations = [5, 20, 50, 100]) {
    // gameType
    this.gameType = gameType;

    // プレイヤーが選択できるベットの単位。
    this.betDenominations = betDenominations;

    // deck
    this.deck = new Deck(this.gameType);

    // player
    this.players = [];

    // user 
    // this.players.push(new Player(`user`, 'user', this.gameType));

    // ai × 3
    for (let i = 0; i < 3; i++) {
      this.players.push(new AI(`ai${i + 1}`, this.gameType));
    }
    // house
    this.house = new HOUSE('house', this.gameType);

    this.players.push(this.house);

    this.playerNumber = this.players.length;

    this.gameStatus = 'betting';

    // 各ラウンドの結果をログに記録する
    this.resultsLog = [];
  }
  /*
      Player player : テーブルは、Player.promptPlayer()を使用してGameDecisionを取得し、GameDecisionとgameTypeに応じてPlayerの状態を更新します。
      return Null : このメソッドは、プレーヤの状態を更新するだけです。

      EX:
      プレイヤーが「ヒット」し、手札が21以上の場合、gameStatusを「バスト」に設定し、チップからベットを引きます。
  */
  evaluateMove(player) {
    let gameDecision = player.promptPlayer();
    player.playerAction = gemeDecision.action;
    player.bet = gameDecision.bet;
  }

  /*
     return String : 新しいターンが始まる直前の全プレイヤーの状態を表す文字列。
      NOTE: このメソッドの出力は、各ラウンドの終了時にテーブルのresultsLogメンバを更新するために使用されます。
  */
  blackjackEvaluateAndGetRoundResults() {
    let log = `round : ${this.resultsLog.length + 1}`;
    this.players.forEach(player => {
      log += `
              ${player.name}: action: ${player.gameStatus}, bet: ${player.bet}, won:${player.winAmount}
             `;
    });
    this.resultsLog.push(log);
    return log;
  }

  /*
     return null : デッキから2枚のカードを手札に加えることで、全プレイヤーの状態を更新します。
     NOTE: プレイヤーのタイプが「ハウス」の場合は、別の処理を行う必要があります。
  */
  blackjackAssignPlayerHands() {
    this.players.forEach(player => {
      if (player instanceof House) {
        player.hand.push(this.deck.drawOne());
      } else {
        player.hand.push(this.deck.drawOne(), this.deck.drawOne());
      }
    });
  }

  /*
     return null : テーブル内のすべてのプレイヤーの状態を更新し、手札を空の配列に、ベットを0に設定します。 
  */
  blackjackClearPlayerHandsAndBets() {
    this.players.forEach(player => {
      player.hand = [];
      if (!player instanceof House) player.bet = 0;
    });

  }
  /*
     return Player : 現在のプレイヤー
  */
  getTurnPlayer() {
    let index = (turnCounter - 1) % this.playerNumber;
    return this.players[index];
  }

  /*
     Number userData : テーブルモデルの外部から渡されるデータです。ボタン押下で選択したデータをuserDataに格納してplayerの状態を更新する。
     return Null : このメソッドはテーブルの状態を更新するだけで、値を返しません。
  */
  haveTurn(userData) {
    // blackjackのルール適用
    if (this.gameType == "blackjack") {
      if (this.gameStatus == "betting") {
        // step1 betする player.status != broke && house以外(house.bet = null)
        this.players.forEach(player => {
          if (player.Status != "broke") {
            // player更新
            this.evaluateMove(player);
            // step2 cardを配る
            player.hand = this.blackjackAssignPlayerHands();
            // statusをbet → playing
            player.Status = "playing";
          }
        });
      } else if (this.gameStatus == "playing") {
        while (!this.onLastPlayer() && !this.allPlayerActionsResolved(this.getTurnPlayer())) {
          // houseは、playerのstatusが確定するまで実施しない。
          this.evaluateMove(this.getTurnPlayer());
          // カードをdraw、手札に加える
          this.getTurnPlayer().hand.push(this.deck.drawOne());
          // 次のplayerへ
          this.turnCounter++;
        }
        // houseのstatus更新
        this.turnCounter = this.players.length;
        while (!this.allPlayerActionsResolved()) {
          this.getTurnPlayer().hand.push(this.deck.drawOne());
          this.evaluateMove(this.getTurnPlayer());
        }
      }
    }
  }

  /*
      return Boolean : テーブルがプレイヤー配列の最初のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
      // betをリセットするとき使用
  */
  onFirstPlayer() {
    return this.players[0] == this.getTurnPlayer();
  }

  /*
      return Boolean : テーブルがプレイヤー配列の最後のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
  */
  onLastPlayer() {
    return this.players[this.players.length - 1] == this.getTurnPlayer();
  }

  /*
      playerがセット{'broke', 'bust', 'stand', 'surrender'}のgameStatusを持っていればtrueを返し、持っていなければfalseを返します。
      // player=null　→　全てのplayer対象
      //player != null →　特定のplayer対象
  */
  playerActionsResolved(player = null) {
    const gameStatus =
    {
      "broke": "broke",
      "bust": "bust",
      "stand": "stand",
      "surrender": "surrender"
    };
    let hasStatus = true;
    if (player == null) {
      this.players.forEach(player => {
        if (!gameStatus.containsKey(player.Status)) hashStatus = false;
      });
    } else {
      if (!gameStatus.containsKey(player.Status)) hashStatus = false;
    }
    return hasStatus;
  }
}

module.exports = Table;