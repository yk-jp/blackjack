const Deck = require('./deck');
const User = require('./_player/user');
const AI = require('./_player/ai');
const House = require('./_player/house');
/* overview
   blackjack　gameFlow  user, ai × 2 , house の  3 player + house用  　

   nameとgameModeを受け取る。

   // userName == ai のとき、aiの対戦にする。　→　今回実装なし

  変数
   turnCounter : Number → player配列へのアクセス用。剰余計算でアクセス。
   gamePhase : gameFlowの管理　→　{'waitingForBets','betting', 'playing', 'evaluatingWinners', 'roundOver'}
   betDenominations : userがかけられるチップの単位　aiの場合使用しない
   resultLog : roundごとの結果を格納
   playerNumber : playerの数を設定　ai = 3に設定　

  メソッド
   void haveTurn() : roundOverになったら終了。(userが、betボタン押下　→　event発火 →　gemeStatusがbettingに変更する処理をControllerで管理)  　
   処理手順は、gameFlow通り
    1.bet (gamePhase　→　betting)
      最初のplayerから全員betする →　getTurnPlayer()でactionするplayer呼び出し
    2.cardを2枚配る。(playerがbrokeしていない) →　blackjackAssignPlayerHands()
    3.action →　prompt()でstatus更新
    4.roundOverになったら終了
*/

class Table {
  /*
     String gameType : {"blackjack"}から選択。
     Array betDenominations : プレイヤーが選択できるベットの単位。デフォルトは[5,20,50,100]。
     return Table : ゲームフェーズ、デッキ、プレイヤーが初期化されたテーブル
  */

  turnCounter = 1;

  // blackjack用gamePhase
  static gamePhaseForBlackjack = {
    'waitingForBets': 'betting',
    'betting': 'playing',
    'playing': 'evaluatingWinners',
    'evaluatingWinners': 'roundOver',
    "gameOver": "gameOver"
  };

  static actionMap =
    {
      "broke": "broke",
      "bust": "bust",
      "stand": "stand",
      "double":"double",
      "surrender": "surrender"
    };
  constructor(gameType, userName, betDenominations = [5, 20, 50, 100]) {
    // gameType
    this.gameType = gameType;

    // プレイヤーが選択できるベットの単位。
    this.betDenominations = betDenominations;

    // deck
    this.deck = new Deck(this.gameType);

    // players
    this.players = [];

    this.players.push(new AI("ai1", this.gameType));

    this.user = null;

    // userName == ai のとき、aiの対戦にする。　→　今回実装なし
    if (userName == "ai") {
      this.user = new AI("ai2", this.gameType);
      // this.user = new User(userName, this.gameType);
    } else {
      this.user = new User(userName, this.gameType);
    }
    this.players.push(this.user);

    this.players.push(new AI("ai3", this.gameType));

    // house
    this.house = new House('house', this.gameType);

    this.players.push(this.house);

    this.playerNumber = this.players.length;

    this.gamePhase = 'waitingForBets';

    // 各ラウンドの結果をログに記録する
    this.resultsLog = [];
  }
  /*
      Player player : テーブルは、Player.promptPlayer()を使用してGameDecisionを取得し、GameDecisionとgameTypeに応じてPlayerの状態を更新します。
      return Null : このメソッドは、プレーヤの状態を更新するだけです。

      EX:
      プレイヤーが「ヒット」し、手札が21以上の場合、gamePhaseを「バスト」に設定し、チップからベットを引きます。
  */
  evaluateMove(player, userData = null) {
    let gameDecision = player.prompt(userData);
    player.action = gameDecision.action;
    player.bet = gameDecision.bet;
  }

  /*
     return String : 新しいターンが始まる直前の全プレイヤーの状態を表す文字列。
      NOTE: このメソッドの出力は、各ラウンドの終了時にテーブルのresultsLogメンバを更新するために使用されます。
  */
  blackjackEvaluateAndGetRoundResults() {
    // houseとplayerの比較
    let houseHand = this.house.getHandScore();
    // playersの先頭をとる
    this.turnCounter = 1;
    while (!this.onLastPlayer()) {
      let currPlayer = this.getTurnPlayer();
      let playerHand = currPlayer.getHandScore();
      if (!this.canPlayForBlackjack(currPlayer)) {
        this.turnCounter++;
        continue;
      }
      // playerがbust
      if (currPlayer.action == "bust") currPlayer.winAmount = -currPlayer.bet;
      // playerがsurrender
      else if (currPlayer.action == "surrender") currPlayer.winAmount = -Math.floor(currPlayer.bet / 2);
      else {
        // houseと勝負
        if (this.house.action == "bust") {
          currPlayer.winAmount = currPlayer.blackjack() ? Math.floor(currPlayer.bet * 1.5) : (currPlayer.action == "double") ? currPlayer.bet * 2 : currPlayer.bet; // playerがwin
        }
        else {
          // house.action != bust
          if (this.house.blackjackAndHasAce()) {
            // house がblackjackかつ "A"をもつ   playerもblackjackかつ "A"をもつ 　→　引き分け
            if (!currPlayer.blackjackAndHasAce()) currPlayer.winAmount = (currPlayer.action == "double") ? -currPlayer.bet * 2 : -currPlayer.bet; // playerの負け    
          } else if (this.house.blackjack()) {
            // houseがblackjack //playerもblackjack →　引き分け
            if (currPlayer.blackjackAndHasAce()) currPlayer.winAmount = (currPlayer.action == "double") ? currPlayer.bet * 2 : currPlayer.bet;//playerの勝ち 
            else if (!currPlayer.blackjack()) currPlayer.winAmount = (currPlayer.action == "double") ? -currPlayer.bet * 2 : -currPlayer.bet; // playerの負け
          } else {
            // houseがblackjackでない
            if (playerHand < houseHand) currPlayer.winAmount = (currPlayer.action == "double") ? -currPlayer.bet * 2 : -currPlayer.bet; // playerの負け
            else if (playerHand > houseHand) currPlayer.chip = (currPlayer.action == "double") ? currPlayer.bet * 2 : currPlayer.bet; // playerの勝ち
          }
        }
      }
      currPlayer.chip += currPlayer.winAmount;
      if (currPlayer.chip <= 0) {
        currPlayer.switchStatus("blackjack");
      }
      this.turnCounter++;
    }

    // round終了
    let log = `round : ${this.resultsLog.length + 1}`;
    this.players.forEach(player => {
      if (player != this.house && this.canPlayForBlackjack(player)) {
        log += ` ◇${player.name}: action:${player.action}, bet:${player.bet}, won:${player.winAmount}
       `;
      }
    });
    this.resultsLog.push(log);

    // gamePhase=roundOverへ更新 user.statusがbrokeの場合、gameOver  
    this.switchGamePhase(Table.gamePhaseForBlackjack);

    return log;
  }

  /*
     return null : デッキから2枚のカードを手札に加えることで、全プレイヤーの状態を更新します。
     NOTE: プレイヤーのタイプが「ハウス」の場合は、はじめ手札一枚。
  */
  blackjackAssignPlayerHands(player) {
    if (this.canPlayForBlackjack(player)) {
      if (player == this.house) player.hand.push(this.deck.drawOne());
      else player.hand.push(this.deck.drawOne(), this.deck.drawOne());
    }
  }

  /*
     return null : テーブル内のすべてのプレイヤーの状態を更新し、手札を空の配列に、ベットを0に設定します。 
  */
  blackjackClearPlayerHandsAndBets() {
    this.players.forEach(player => {
      player.hand = [];
      player.bet = 0;
      player.switchStatus("blackjack");
      if (this.canPlayForBlackjack(player)) player.action = "bet";

      if (player == this.house) {
        player.bet = -1;
        player.action = "waiting";
      } else {
        player.winAmount = 0;
      }
    });
    // cardをリセット
    this.deck.resetDeck();
    this.turnCounter = 1;
  }
  /*
     return Player : 現在のプレイヤー
  */
  getTurnPlayer() {
    let index = (this.turnCounter - 1) % this.playerNumber;
    return this.players[index];
  }

  /*
     Number userData : テーブルモデルの外部から渡されるデータです。ボタン押下で選択したデータをuserDataに格納してplayerの状態を更新する。
     return Null : このメソッドはテーブルの状態を更新するだけで、値を返しません。
  */
  haveTurn(userData = null) {
    if (this.gameType == "blackjack") {
      // blackjackのルール適用
      if (this.gamePhase == "waitingForBets") {
        let currPlayer = this.getTurnPlayer();
        // step1 cardを配る
        this.blackjackAssignPlayerHands(currPlayer);

        // house(lastPlayer)で次のフェーズ　→　 gamePhase更新 waitingForBets →　betting
        if (this.onLastPlayer()) this.switchGamePhase(Table.gamePhaseForBlackjack);
        // 次のplayer
        this.turnCounter++;
      } else if (this.gamePhase == "betting") {
        let currPlayer = this.getTurnPlayer();
        // step2 betする

        this.evaluateMove(currPlayer, userData);
        // houseだけbetしない　→　waitingのまま　
        if (!this.onLastPlayer()) currPlayer.switchStatus("blackjack");

        // house(lastPlayer)で次のフェーズ　→　 gamePhase更新 betting →　playing
        if (this.onLastPlayer()) this.switchGamePhase(Table.gamePhaseForBlackjack);

        // 次のplayer
        this.turnCounter++;
      } else if (this.gamePhase == "playing") {

        let currPlayer = this.getTurnPlayer();

        if (currPlayer != this.house) {
          if (this.actionsResolved()) this.house.switchStatus("blackjack");  //全playerのactionが決定したら、houseのturn (waitingからplaying)

          if (this.actionsResolved(currPlayer)) {
            this.turnCounter++; //actionが決定したら次のplayer
          } else {
            this.evaluateMove(currPlayer, userData);
            if (!this.actionsResolved(currPlayer)) currPlayer.hand.push(this.deck.drawOne());
            this.turnCounter++;
          }
        } else {
          // this.house.status == "playing" →　全playerのactionが決定
          if (this.actionsResolved(this.house)) {
            this.switchGamePhase(Table.gamePhaseForBlackjack);
            this.turnCounter++;
          } else {
            if (this.house.status == "waiting") this.turnCounter++;
            else {
              // waitingが終わったら(playerのactionが確定したら)houseのturn
              this.house.hand.push(this.deck.drawOne());
              this.evaluateMove(this.house, userData);
            }
          }
        }
      } else if (this.gamePhase == "evaluatingWinners") {
        this.blackjackEvaluateAndGetRoundResults();
      } else {
        // roundOver
        // this.blackjackClearPlayerHandsAndBets();
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
    return this.players[this.playerNumber - 1] == this.getTurnPlayer();
  }

  /*
    playerがセット{'broke', 'bust', 'stand', 'surrender'}のgamePhaseを持っていればtrueを返し、持っていなければfalseを返します。
    //player =  null → house以外のplayerが対象
    //player != null → 特定のplayer対象
  */
  actionsResolved(player = null) {
    let hasAction = true;
    if (player == null) {
      for (let i = 0; i < this.playerNumber - 1; i++) {
        if (!(this.players[i].action in Table.actionMap)) hasAction = false;
      }
    } else {
      if (!(player.action in Table.actionMap)) hasAction = false;
    }
    return hasAction;
  }

  // userDataに格納されたactionに対するfunctio。actionResolvedと同じ
  userActionsResolved(userData) {
    return userData in Table.actionMap;
  }

  /*
  gamePhase切り替え　
  blackjackの場合、betting → playing → evaluatingWinners → roundOver
  roundOverで一度gameが途切れ、playerの選択(新しいroundを実施するか)によってbettingに切り替わるため、roundOver　→  bettingの切り替え実装は不要
  */

  switchGamePhase(gamePhase) {
    this.gamePhase = gamePhase[this.gamePhase];
    if (this.gamePhase == "roundOver" && this.user.status == "broke") this.gamePhase == gamePhase["gameOver"];
  }

  /*
  playerがplayできるstatusか判断 　status = broke → false　
  return boolean 
  */
  canPlayForBlackjack(player) {
    return player.status != "broke";
  }
}

module.exports = Table;