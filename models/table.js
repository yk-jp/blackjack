const Card = require('./card');
const Deck = require('./deck');
const Player = require('./player');
const GameDecision = require('./gameDecision');

class Table {
  /*
     String gameType : {"blackjack"}から選択。
     Array betDenominations : プレイヤーが選択できるベットの単位。デフォルトは[5,20,50,100]。
     return Table : ゲームフェーズ、デッキ、プレイヤーが初期化されたテーブル
  */

  turnCounter = 1;
  gamePhase = "betting"; //  {'betting', 'acting', 'evaluatingWinners, roundOver'}

  constructor(gameType, betDenominations = [5, 20, 50, 100]) {
    // gameType
    this.gameType = gameType;

    // プレイヤーが選択できるベットの単位。
    this.betDenominations = betDenominations;

    // deck
    this.deck = new Deck(this.gameType);

    // プレイしているゲームに応じて、プレイヤー、gamePhases、ハウスの表現が異なるかもしれません。
    // 今回はとりあえず3人のAIプレイヤーとハウス、「betting」フェースの始まりにコミットしましょう。
    this.players = [];

    // user 
    // this.players.push(new Player(`user`, 'user', this.gameType));

    // ai 
    this.playerNumber = 3;
    for (let i = 0; i < this.playerNumber; i++) {
      this.players.push(new Player(`ai${i + 1}`, 'ai', this.gameType));
    }
    // house
    this.house = new Player('house', 'house', this.gameType);

    this.players.push(this.house);

    this.gamePhase = 'betting';

    // これは各ラウンドの結果をログに記録するための文字列の配列です。
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
    player.gameStatus = gemeDecision.action;
    player.bet = gameDecision.amount;
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
    //TODO: ここから挙動をコードしてください。
    this.players.forEach(player => {
      player.hand.push(this.deck.drawOne(), this.deck.drawOne());
    });
  }

  /*
     return null : テーブル内のすべてのプレイヤーの状態を更新し、手札を空の配列に、ベットを0に設定します。
  */
  blackjackClearPlayerHandsAndBets() {
    //TODO: ここから挙動をコードしてください。
    this.players.forEach(player => {
      player.hand = [];
      player.bet = 0;
    });
  }

  /*
     return Player : 現在のプレイヤー
  */
  getTurnPlayer() {
    let index = (turnCounter - 1) % this.playerNumber;
    // 次のplayerのturn　→　turnCount++;
    this.turnCounter++;
    return this.players[index];
  }

  /*
     Number userData : テーブルモデルの外部から渡されるデータです。 
     return Null : このメソッドはテーブルの状態を更新するだけで、値を返しません。
  */
  haveTurn(userData) {
    // blackjackのルール適用
    if (this.gameType == "blackjack") {
      // 現在のプレイヤー
      let currPlayer = getTurnPlayer();
      
      // 
      if(this.gamePhase == "betting") { 
        // step1 全playerがベット(houese除く)
        this.players.forEach(player => { 
          // 
        });


      } else if(this.GamePhase == "") { 

      }

    }
    //　else if (this.gameType == "poker") { 
    //   pokerに拡張用　今回は実装しない

    // }
  }

  /*
      return Boolean : テーブルがプレイヤー配列の最初のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
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
      全てのプレイヤーがセット{'broken', 'bust', 'stand', 'surrender'}のgameStatusを持っていればtrueを返し、持っていなければfalseを返します。
  */
  allPlayerActionsResolved() {
    //TODO: ここから挙動をコードしてください。
    const gameStatus =
    {
      "broken": "broken",
      "bust": "bust",
      "stand": "stand",
      "surrender": "surrender"
    };
    let hasStatus = true;
    this.players.forEach(player => {
      if (!gameStatus.containsKey(player.gameStatus)) hashStatus = false;
    });
    return hasStatus;
  }
}

module.exports = Table;