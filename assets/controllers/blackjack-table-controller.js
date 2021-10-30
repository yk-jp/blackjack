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
    'roundOver': 'waitingForBets',
    "gameOver": "gameOver"
  };

  static actionMap =
    {
      "broke": "broke",
      "bust": "bust",
      "stand": "stand",
      "double": "double",
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
      this.user = new User(userName, this.gameType);
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
      if (currPlayer.chip < 5) {
        currPlayer.switchStatus("blackjack");
      }
      this.turnCounter++;
    }

    // round終了
    let log = `round${this.resultsLog.length + 1}: `;
    this.players.forEach(player => {
      if (player != this.house) {
        log += `◇${player.name}: action: ${player.action}, bet: ${player.bet}, won: ${player.winAmount}`;
      }
    });
    this.resultsLog.push(log);

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
                   gamePhaseをroundOver　→　betting
  */
  blackjackClearPlayerHandsAndBets() {
    this.switchGamePhase(Table.gamePhaseForBlackjack);
    this.players.forEach(player => {
      player.hand = [];
      player.bet = 0;
      player.switchStatus("blackjack");
      if (this.canPlayForBlackjack(player)) player.action = "bet";
      if (player == this.house) player.action = "waiting";
      else player.winAmount = 0;
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
            //手札が二枚かつdoubleのときは一枚引く。(actionsResolvedでtrueになり、drawされないため)
            if (currPlayer.hand.length == 2 && currPlayer.action == "double") currPlayer.hand.push(this.deck.drawOne()); 
            if (!this.actionsResolved(currPlayer)) currPlayer.hand.push(this.deck.drawOne());
            if(currPlayer == this.user) this.evaluateMove(currPlayer, userData);
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
        this.switchGamePhase(Table.gamePhaseForBlackjack);
      } else {
        //roundOver →　userのアクション
        this.blackjackClearPlayerHandsAndBets();
      }
    }
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
    if (this.gamePhase == "roundOver" && this.user.status == "broke") this.gamePhase = gamePhase["gameOver"];
  }

  /*
  playerがplayできるstatusか判断 　status = broke → false　
  return boolean 
  */
  canPlayForBlackjack(player) {
    return player.status != "broke";
  }
}


class GameDecision {
  /*
     String action : プレイヤーのアクションの選択。（ブラックジャックでは、bet, hit、stand, double, surrender）
     Number bet : betする値。actionがbetでないとき　& playerがhouseの時-1
  */
  constructor(action, bet = -1) {
    this.action = action;
    this.bet = bet;
  }
}

class Deck {
  /*
     String gameType : ゲームタイプの指定。{'blackjack'}から選択。
  */
  constructor(gameType = null) {
    // このデッキが扱うゲームタイプ
    this.gameType = gameType;

    // カードの配列
    this.cards = [];

    // ゲームタイプによって、カードを初期化
    this.resetDeck(this.gameType);
  }

  shuffle() {
    // Math.random() * (max - min) + minでmin-max未満のランダムな数を生成することができます。
    for (let i = 0; i < this.cards.length; i++) {
      let randomNum = Math.floor(Math.random() * (this.cards.length - i));
      let temp = this.cards[i];
      this.cards[i] = this.cards[randomNum];
      this.cards[randomNum] = temp;
    }
  }

  /*
     String gameType : どのゲームにリセットするか
     return null : このメソッドは、デッキの状態を更新します。
  */
  resetDeck(gameType = null) {
    this.cards = [];
    for (let i = 0; i < Card.suit.length; i++) {
      for (let j = 0; j < Card.rank.length; j++) {
        this.cards.push(new Card(Card.suit[i], Card.rank[j]));
      }
    }
    this.shuffle();
  }

  drawOne() {
    return this.cards.pop();
  }
}

class Card {
  /*
     String suit : {"H", "D", "C", "S"}
     String rank : {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"}
  */

  static suit = ["H", "D", "C", "S"];
  static rank = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  /*
     return Number : カードのランクを基準とした整数のスコア。
     
      2-10はそのまま数値を返します。
     {"J", "Q", "K"}を含む、フェースカードは10を返します。
      "A」が1なのか11なのかを判断するには手札全体の知識が必要なので、「A」はとりあえず11を返します。
  */

  getRankNumber() {
    if (("JQK").indexOf(this.rank) != -1) {
      return 10;
    } else if (this.rank == "A") {
      // 仮の値
      return 11;
    }
    return parseInt(this.rank);
  }
}

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
  switchStatus() { }
}
/* overview
  継承 
    name : player名
    gameType(blackjack)
    hand : 手札
    void getHandScore() : Number →　playerの手札の点数を返す。
    bet :　roundごとにいくらかけるか

  Userに必要な変数、メソッド
    chip(default = 400)　:　所持金
    winAmount : 勝利したときの金額
    status : 現在のplayerのstatus　→ {bet,playing,broke}
    } 
    action : 現在のplayerのaction  →　{bet,stand,hit,double,surrender,broke}
    gameDecision prompt(): GameDecisionクラスを返す　自動的に判断するような設計が必須 　　※player classの更新はしない(tableクラス　evaluateMove()で更新)
*/

/* prompt()の処理
    以下の2点
     1.bet
     2.playing(betした後の処理)
*/

class User extends Player {
  static statusForBlackjack = {
    "bet": "playing",
    "playing": "bet",
    "broke": "broke"
  };

  constructor(name, gameType) {
    super(name, gameType);
    this.bet = 0;
    this.chip = 400;
    this.winAmount = 0;
    this.action = "bet";
    this.type = "user";
  }

  /* return GameDecision class (action,bet)
     status=bet → return (action("bet"),bet)
     status=playing →　return (action,null)
     satatus = broke →　return (bust)
  */
  prompt(userData) {
    if (this.status == "bet") return new GameDecision("bet", userData);
    else if (this.status == "playing") {
      let promptAction = userData;
      let handScore = this.getHandScore();
      if (handScore > 21) promptAction = "bust";
      return new GameDecision(promptAction, this.bet);
    }
    return new GameDecision("broke", 0);
  }

  switchStatus(gameType) {
    if (gameType == "blackjack") {
      if (this.chip < 5) this.status = User.statusForBlackjack["broke"];
      else this.status = User.statusForBlackjack[this.status];
    }
  }
}

/* House class
  継承 
    name : player名
    gameType(blackjack)
    hand : 手札
    void getHandScore() : Number →　playerの手札の点数を返す。
    bet : houseに-1を代入

  houseに必要な変数、メソッド
    status : 現在のplayerのstatus　→ {waiting,playing}
    } 
    playerAction : 現在のplayerのaction  →　{waiting,stand,hit} bet,surrender,doubleしない。 
    gameDecision prompt(): GameDecisionクラスを返す　自動的に判断するような設計が必須  ※player classの更新はしない(tableクラス　evaluateMove()で更新)
*/

/* prompt()の処理
    以下の2点
     1.playerのbetを待つ。

     2.playing(1の後の処理)　 ※houseは、17以上になるまでカードを引き続けることを考慮。17<=scoreでstandできる

   1.status = waiting
     playerAction = waiting、bet=nullgameDecisionクラスを返す ※ GameDecisionクラスで、betはdefault = null

   2. status = playing aiと同様に、中々bustしないhouseを作成する。※houseは、17以上になるまでカードを引き続けることを考慮。 　
    　
      手札(hand)
      hand: bustを避ける動きを作る。
      score < 17　→　　hit
      17 = score → 7:3 → stand : hit 
      18 <= score <= 20 → 9:1 = stand : hit
      21 = score →　stand(blackjackで処理を終了) 
      score > 21 → bust
*/

class House extends Player {

  static statusForBlackjack = {
    "waiting": "playing",
    "playing": "waiting"
  };

  constructor(name, gameType) {
    super(name, gameType);
    this.status = "waiting";
    this.action = "waiting";
    this.type = "house";
  }

  /* return GameDecision class (action,bet)
     status=waiting -> return (action("waiting"))
     status=playing -> return (action)
  */
  prompt() {
    if (this.status == "waiting") return new GameDecision("playing");
    else if (this.status == "playing") {
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

  switchStatus(gameType) {
    if (gameType == "blackjack") this.status = House.statusForBlackjack[this.status];
  }
}

/* AI class 
  継承 
    name : player名
    gameType(blackjack)
    hand : 手札
    void getHandScore() : Number →　playerの手札の点数を返す。
    bet :　roundごとにいくらかけるか

  AIに必要な変数、メソッド
    chip(default = 400)　:　所持金
    winAmount : 勝利したときの金額
    status : 現在のplayerのstatus　→ {bet,playing,broke}
    } 
    action : 現在のplayerのaction  →　{bet,stand,hit,double,surrender,broke}
    gameStatus : blackjackのはじめはbetting　{betting,playing, roundOver, gameOver(userがbustしたとき)}  →　tableクラスのみ所持していればよいのかも知れない 
    gameDecision prompt(): GameDecisionクラスを返す　自動的に判断するような設計が必須 　　※player classの更新はしない(tableクラス　evaluateMove()で更新)
*/

/* prompt()の処理
    以下の2点
     1.bet
     2.playing(betした後の処理)
   
   1.status = bet
     
     chip > 400  →　bet = 5:5 = 100 : 200 
     chip <= 400(default) →　bet = 8:2 = 50 : 100
     chip <= 150 = 7:3 = chip/2 : all chips

   2. status = playing aiは、playing状態 userのように慎重な(中々bustしない or brokeしない)aiを作成する。 　
    　
   判断 → chip , 手札(hand)
     
      chip: defaultの400 <=chip →　doubleする時を作成する。9:1 = hit: doubleにする。
            ※doubleの時は、手札が2枚であることを考慮する。

      hand: bustを避ける動きを作る。
          score < 17 →　13～15の間の時、9:1の確率で、hit:doubleをする。13より小さい場合は、hit
                                    
            score = 16、17 → 3:4:3 = hit : stand : surrender ※カードが3枚の時のみsurrenderが可能
           18<= score <= 20　→　なるべく勝負にかけないようにする。9:1の確率で、stand:hitをする。
            score = 21　→　stand(blackjackで処理を終了) 
            score > 21 → bust
*/

class AI extends Player {

  static statusForBlackjack = {
    "bet": "playing",
    "playing": "bet",
    "broke": "broke"
  };

  constructor(name, gameType) {
    super(name, gameType);
    this.bet = 0;
    this.chip = 400;
    this.winAmount = 0;
    this.action = "bet";
    this.type = "ai";
  }

  /* return GameDecision class (action,bet)
     status=bet → return (action("bet"),bet)
     status=playing →　return (action,null)
     satatus = broke →　return (bust)
  */
  prompt() {
    if (this.status == "bet") {
      let promptBet = null;
      // 1.bet
      if (this.chip > 400) promptBet = this.judgeByRatio(5) ? 100 : 200;
      else if (150 < this.chip && this.chip <= 400) promptBet = this.judgeByRatio(8) ? 50 : 100;
      else promptBet = this.judgeByRatio(7) ? Math.floor(this.chip / 2) : this.chip;
      return new GameDecision("bet", promptBet);

    } else if (this.status == "playing") {
      let promptAction = null;
      // 2.playingの時
      let numOfHand = this.hand.length;
      let handScore = this.getHandScore();
      if (handScore < 16) {
        if (0 <= handScore && handScore < 13) promptAction = "hit";
        else if (13 <= handScore) promptAction = this.judgeByRatio(9) ? "hit" : !numOfHand == 2 ? "hit" : "double"; //手札が2枚のみdoubleが可能
      }
      else if (handScore == 16 || handScore == 17) {
        // 3:4:3 = hit : stand : surrender 
        if (this.judgeByRatio(7)) {
          // 1回目7:3 →　hit or stand : surrender
          promptAction = "hit";
          // 2回目 hit or stand
          if (this.judgeByRatio(4)) promptAction = "stand";
        } else {
          if (this.hand.length != 3) promptAction = "stand"; //カードが3枚の時のみsurrenderが可能
          else promptAction = "surrender";
        }
      } else if (18 <= handScore && handScore <= 20) {
        // 9:1 →　stand : hit
        promptAction = this.judgeByRatio(9) ? "stand" : "hit";
      } else if (handScore == 21) promptAction = "stand";
      else promptAction = "bust";

      return new GameDecision(promptAction, this.bet);
    }
    return new GameDecision("broke", 0);
  }

  switchStatus(gameType) {
    if (gameType == "blackjack") {
      if (this.chip < 5) this.status = AI.statusForBlackjack["broke"];
      else this.status = AI.statusForBlackjack[this.status];
    }
  }
}

class Render {
  static config = {
    body: document.getElementById("body"),
    table: document.getElementById("gameDiv")
  }

  static loginPage() {
    let div = document.createElement("div");
    div.innerHTML =
      `
    <!-- login form div -->
    <div id="loginPage">
        <p class="text-white" > Welcome to Card Game! </p>
        <form id="login-form" onsubmit="Controllers.jumpToMainPageAndStartGame(); event.preventDefault();">
          <!-- name field div -->
          <div>
              <input type="text" name = "userName" placeholder="name" required>
          </div>
          <!-- game type div -->
          <div>
              <select class="w-100" name="gameMode" required>
                  <option value="blackjack">Blackjack </option>
                  <option value="poker" disabled>Poker </option>
              </select>
          </div>
          <!-- submit div -->
          <div>
              <button type="submit" class="btn btn-success">Start Game</button>
          </div>
        <form>
    </div>
    `;

    this.config.table.innerHTML = "";
    this.config.table.append(div);

    return div;
  }

  static table(table) {
    this.config.table.innerHTML = "";
    let tableContainer = document.createElement("div");  // all cards (dealer, players) div  
    tableContainer.classList.add("col-12");

    // title　→ round or gameOver
    let title = Render.title(table);

    // house
    let house = Render.house(table.house, table.gamePhase);
    // all players (ai1 , user , ai2)
    let allPlayers = Render.allPlayers(table.players, table.gamePhase);
    // resultLog
    let resultsLog = Render.resultsLog(table);

    if (table.gamePhase != "evaluatingWinners" && table.gamePhase != "roundOver" && table.gamePhase != "gameOver") {
      if (table.getTurnPlayer().type == "user") {
        // button
        let button = null;
        if (table.gamePhase == "betting") button = Render.betOptionButton(table);
        else if (table.gamePhase == "playing") {
          if (!table.actionsResolved(table.user)) {
            button = Render.actionButton(table);
          } else {
            tableContainer.append(title, house, allPlayers, resultsLog);
            return tableContainer;
          }
        } else button = Render.roundOverButton(table);

        tableContainer.append(title, house, allPlayers, button, resultsLog);
      } else {
        tableContainer.append(title, house, allPlayers, resultsLog);
      }
    } else {
      let button = Render.roundOverButton(table);
      tableContainer.append(title, house, allPlayers, button, resultsLog);
    }

    this.config.table.append(tableContainer);

    return tableContainer;
  }

  static title(table) {
    let titleDiv = document.createElement("div");
    titleDiv.classList.add("d-flex", "justify-content-center", "pt-3", "text-gold");
    if (table.gamePhase != "gameOver") titleDiv.innerHTML = `<h3>ROUND${table.resultsLog.length + 1}</h3>`;
    else titleDiv.innerHTML = `<h1>GAME OVER</h1>`;
    return titleDiv;
  }

  static house(house, gamePhase) {
    let houseContainer = document.createElement("div");
    houseContainer.classList.add("pt-1");
    // houseName
    let houseName = Render.playerName(house.name, ["m-0", "text-center", "text-white"]);
    // house info 
    let houseInfo = Render.houseInfo(house, ["text-white", "d-flex", "m-0", "p-0", "justify-content-center"]);
    // house cards
    let houseCards = Render.cards(house.hand, ["d-flex", "justify-content-center"], gamePhase);

    houseContainer.append(houseName, houseInfo, houseCards);
    return houseContainer;
  }

  static allPlayers(playersArr, gamePhase) {
    let playersContainer = document.createElement("div");
    let players = document.createElement("div");
    players.setAttribute("id", "playersDiv");
    players.classList.add("d-flex", "justify-content-center", "flex-row", "w-100");

    let ai1 = Render.player(playersArr[0], gamePhase);
    let user = Render.player(playersArr[1], gamePhase);
    let ai2 = Render.player(playersArr[2], gamePhase);
    players.append(ai1, user, ai2);
    playersContainer.append(players);

    return playersContainer;
  }

  static player(playerClass, gamePhase) {
    let player = document.createElement("div");
    player.setAttribute("id", playerClass.type);
    player.classList.add("flex-column", "w-25");

    // player name
    let playerName = Render.playerName(playerClass.name, ["m-0", "text-white", "text-center"]);
    // player info
    let playerInfo = Render.playerInfo(playerClass, ["text-white", "d-flex", "justify-content-center"]);
    // player cards
    let playerCards = Render.cards(playerClass.hand, ["d-flex", "justify-content-center"], gamePhase);

    player.append(playerName, playerInfo, playerCards);

    return player;
  }

  static playerName(name, classInfo) {
    let playerName = document.createElement("h2");
    playerName.classList.add(...classInfo);
    playerName.innerHTML = `${name}`;
    return playerName;
  }

  static playerInfo(playerClass, classInfo) {
    let playerInfo = document.createElement("div");
    playerInfo.classList.add(...classInfo);

    playerInfo.innerHTML =
      `
     <p class="rem1 text-left px-1">S:${playerClass.action} </p>
     <p class="rem1 text-left px-1">B:${playerClass.bet} </p>
     <p class="rem1 text-left px-1">C:${playerClass.chip} </p>
    `;
    return playerInfo;
  }

  static houseInfo(houseClass, classInfo) {
    let houseInfo = document.createElement("div");
    houseInfo.classList.add(...classInfo);

    houseInfo.innerHTML =
      `
     <p class="rem1 text-left px-1">S:${houseClass.action}</p>
    `;
    return houseInfo;
  }

  static cards(hand, classInfo, gamePhase) {
    let cards = document.createElement("div");

    cards.classList.add(...classInfo);
    for (let i = 0; i < hand.length; i++) {
      let card = document.createElement("div");
      card.classList.add("d-flex", "flex-column", "bg-white", "border", "mx-2");
      if (gamePhase == "waitingForBets" || gamePhase == "betting") {
        card.innerHTML =
          `
          <div class="text-center">
            <img src=${Controllers.suitImg("Q")} alt="" width="50" height="50">
          </div>
          <div class="text-center">
            <p class="m-0 text-dark">?</p>
          </div>
          `;
      } else {
        card.innerHTML =
          `
          <div class="text-center">
            <img src=${Controllers.suitImg(hand[i].suit)} alt="" width="50" height="50">
          </div>
          <div class="text-center">
            <p class="m-0 text-dark">${hand[i].rank}</p>
          </div>
        `;
      }
      cards.append(card);
    }
    return cards;
  }

  static betOptionButton(table) {
    let actionsAndBetsDiv = document.createElement("div");
    actionsAndBetsDiv.setAttribute("id", "actionsAndBetsDiv");
    actionsAndBetsDiv.classList.add("d-flex", "pb-5", "pt-4", "justify-content-center");

    let betsDiv = document.createElement("div");

    betsDiv.setAttribute("id", "betsDiv");
    betsDiv.classList.add("d-flex", "flex-column", "w-50");

    // <!-- bottom half of bets including chip increments and submit  -->
    let betChoiceDiv = document.createElement("div");
    betChoiceDiv.classList.add("py-2", "h-60", "d-flex", "justify-content-between");

    for (let i = 0; i < table.betDenominations.length; i++) {
      // <!-- betChoiceDiv -->
      let div = document.createElement("div");
      div.innerHTML =
        `
      <div class="input-group">
        <span class="input-group-btn">
            <button type="button" class="btn btn-danger btn-number" onclick ="Controllers.decreaseNumber(${i}); ">
                -
            </button>
        </span>
        <input id = "bet${i}" type="text" class="input-number text-center" size="2" maxlength="5" value="0">
        <span class="input-group-btn">
            <button type="button" class="btn btn-success btn-number" onclick ="Controllers.increaseNumber(${i});">
                +
            </button>
        </span>
      </div>
      <p class="text-white text-center">${table.betDenominations[i]}</p>
      ` ;
      betChoiceDiv.append(div);
    }

    let betSubmitDiv = document.createElement("div");
    betSubmitDiv.innerHTML =
      `
      <button id="submit" class="w-100 rem5 text-center btn btn-primary">Submit your bet</button>
    `;

    betsDiv.append(betChoiceDiv, betSubmitDiv);

    actionsAndBetsDiv.append(betsDiv);
    this.config.table.append(actionsAndBetsDiv);
    return actionsAndBetsDiv;
  }

  static actionButton(table) {
    let actionsAndBetsDiv = document.createElement("div");
    actionsAndBetsDiv.setAttribute("id", "actionsAndBetsDiv");

    actionsAndBetsDiv.classList.add("d-flex", "pb-5", "pt-4", "justify-content-center");

    let actionsDiv = document.createElement("div");
    actionsDiv.setAttribute("id", "actionsDiv");

    actionsDiv.classList.add("d-flex", "flex-wrap", "w-70");
    actionsDiv.innerHTML += `
        <div class="py-2">
            <button class="action-btn btn text-dark  btn-light px-5 py-1">Surrender</button>
        </div>
        <div class="py-2">
            <button class="action-btn btn btn-success px-5 py-1">Stand</button>
        </div>
        <div class="py-2">
            <button class="action-btn btn btn-warning px-5 py-1">Hit</button>
        </div>
        <div class="py-2">
            <button class="action-btn btn btn-danger px-5 py-1">Double</button>
        </div>
    </div>
    `;

    let surrenderBtn = actionsDiv.querySelectorAll(".action-btn")[0];
    let doubleBtn = actionsDiv.querySelectorAll(".action-btn")[3];
    if (table.user.hand.length > 2) {
      surrenderBtn.disabled = true;
      doubleBtn.disabled = true;
    }

    actionsAndBetsDiv.append(actionsDiv);
    this.config.table.append(actionsAndBetsDiv);

    return actionsAndBetsDiv;
  }

  static roundOverButton(table) {
    let okDiv = document.createElement("div");
    okDiv.classList.add("d-flex", "justify-content-center", "mt-3");
    if (table.gamePhase == "roundOver") okDiv.innerHTML = `<button id="okBtn" class="btn bg-primary">NEXT ROUND</button>`;
    else okDiv.innerHTML = `<button id="okBtn" class="btn bg-primary">START NEW GAME</button>`;

    this.config.table.append(okDiv);
    return okDiv;
  }

  static resultsLog(table) {
    let resultsLogDiv = document.createElement("div");
    resultsLogDiv.classList.add("d-flex", "justify-content-center", "flex-column", "bg-green", "text-white", "mt-2");
    resultsLogDiv.innerHTML = `<div class="hover">
                                <p>click here and check resultsLog </p>
                              </div>
                            `;
    let contentDiv = document.createElement("div");
    contentDiv.classList.add("scroll");
    table.resultsLog.forEach(resultLog => {
      let div = document.createElement("div");
      div.setAttribute("id", "hover-resultsLog");
      div.classList.add("text-white", "d-none");
      resultLog = resultLog.split("◇"); // result

      resultLog.forEach(result => {
        div.innerHTML += `<p class="text-left">${result}</p>`
      });
      contentDiv.append(div);
      resultsLogDiv.append(contentDiv);

      resultsLogDiv.addEventListener("click", () => {
        div.classList.toggle("d-none");
      });
    });

    this.config.table.append(resultsLogDiv);
    return resultsLogDiv;
  }
}

class Controllers {
  // login pageから start game　→　main page
  static jumpToMainPageAndStartGame() {
    const loginForm = document.getElementById("login-form");
    // user name
    const userName = loginForm.querySelectorAll(`input[name="userName"]`).item(0).value;
    // blackjack or Poker
    let gameMode = loginForm.gameMode.value;

    const loginPage = document.getElementById("loginPage");
    loginPage.classList.toggle("d-none");
    // start game
    this.startGame(gameMode, userName);
  }

  /*
    tableの表示　
    userNameとgameMode(blackjack)を渡す

    userのアクションを管理
    1.bet
    2.action 
    3.gameOver (userがbroke)
  */
  static startGame(gameMode, userName) {
    let table = new Table(gameMode, userName);
    Controllers.table(table);
  }

  static table(table) {
    Render.table(table); //renderする
    if (table.gamePhase != "evaluatingWinners" && table.gamePhase != "roundOver" && table.gamePhase != "gameOver") {
      if (!table.actionsResolved(table.user) && table.getTurnPlayer().type == "user") { //actionが確定していない場合、userのturn
        // user
        if (table.gamePhase == "waitingForBets") {
          // 何もしない
          table.haveTurn();
          Controllers.table(table);
        } else if (table.gamePhase == "betting") {
          // ボタン押下してbetする →　betting →　playing
          Controllers.submitUserBets(table);
        } else if (table.gamePhase == "playing") {
          if (!table.actionsResolved(table.user)) {
            Controllers.userAction(table); //actionが確定していない
          } else {
            //actionが確定
            table.haveTurn();
            Controllers.table(table);
          }
        }
      } else {
        //ai,house
        let currPlayer = table.getTurnPlayer();
        if (!table.actionsResolved(currPlayer)) {
          table.haveTurn();
          if (table.gamePhase == "waitingForBets") Controllers.table(table);
          else {
            setTimeout(function () {
              Controllers.table(table);
            }, 1000);
          }
        } else {
          table.haveTurn();
          Controllers.table(table); //actionが確定しているplayerのとき、rendering遅延が発生するのを防ぐ
        }
      }
    } else {
      // table.gamePhase == evaluatinWinners or roundOver or gameOver
      if (table.gamePhase == "evaluatingWinners") {
        table.haveTurn();
        Controllers.table(table);
      } else if (table.gamePhase == "roundOver" || table.gamePhase == "gameOver") {
        Controllers.userDecision(table);
      }
    }
  }

  // userがbetボタンを押下
  static submitUserBets(table) {
    let submitBtn = document.querySelectorAll("#submit")[0];
    submitBtn.addEventListener("click", () => {
      let userBets = Controllers.culcBets(table.betDenominations);
      if (userBets <= 0) alert("you've got to bet more than 5$");
      else if (userBets > table.user.chip) alert("you can't bet more than money you have.");
      else {
        // betが成功したら次のplayer
        table.haveTurn(userBets);
        Controllers.table(table);
      }
    });
  }

  // userのアクション
  static userAction(table) {
    let actionBtns = document.querySelectorAll(".action-btn");
    actionBtns.forEach(actionBtn => {
      actionBtn.addEventListener("click", () => {
        let action = actionBtn.innerHTML;
        table.haveTurn(action.toLowerCase()); //buttonの各initialは大文字　→　小文字
        Controllers.table(table);
      });
    });
  }

  /*roundOver or gameOverの時、以下のoption
   roundover →　next round
   gameover　→　new game
  */
  static userDecision(table) {
    let okBtn = document.querySelectorAll("#okBtn")[0];
    okBtn.addEventListener("click", () => {
      if (table.gamePhase == "roundOver") {
        table.haveTurn();
        Controllers.table(table);
      } else {
        Render.loginPage(); //login page
      }
    });
  }

  static suitImg(suit) {
    const suitUrl = {
      "H": "https://recursionist.io/img/dashboard/lessons/projects/heart.png",           //♡
      "D": "https://recursionist.io/img/dashboard/lessons/projects/diamond.png",　　　　　//♦
      "C": "https://recursionist.io/img/dashboard/lessons/projects/clover.png",　　　　  //♧
      "S": "https://recursionist.io/img/dashboard/lessons/projects/spade.png",　        //♠
      "Q": "https://recursionist.io/img/questionMark.png" // ?
    };
    return suitUrl[suit];
  }

  static culcBets(betDenominations) {
    let userBets = 0;
    for (let i = 0; i < betDenominations.length; i++) {
      let value = parseInt(document.getElementById(`bet${i}`).value);
      userBets += value * betDenominations[i];
    }
    return userBets;
  }

  static increaseNumber(num) {
    let betNumInput = document.getElementById(`bet${num}`);
    betNumInput.value++;
  }

  static decreaseNumber(num) {
    let betNumInput = document.getElementById(`bet${num}`);
    let value = betNumInput.value;
    betNumInput.value = (value <= 0) ? 0 : betNumInput.value - 1;
  }

  static displayNone(ele) {
    ele.classList.remove("d-block");
    ele.classList.add("d-none");
  }

  static displayBlock(ele) {
    ele.classList.remove("d-none");
    ele.classList.add("d-block");
  }
}

// Controllers.startGame("blackjack", "user");
Render.loginPage();