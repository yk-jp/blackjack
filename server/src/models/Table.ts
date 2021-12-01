/* overview
  variables
   gamePhase : 'waitingForBets','betting', 'playing', 'evaluatingWinners', 'roundOver'
   betDenominations : chip options to bet = [5, 20, 50, 100]
   resultLog : result of each round
   playerNumber: number of players
  methods
   void haveTurn() : Round is over in roundOver  　
*/

import Deck from "./Deck";
import GameDecision from "./GameDecision";
import House from "./House";
import Ai from './Ai';
import User from './User';

class Table {
  // blackjack用gamePhase
  public static GAMEPHASEFORBLACKJACK:{[key:string]:string} = {
    'waitingForBets': 'betting',
    'betting': 'playing',
    'playing': 'evaluatingWinners',
    'evaluatingWinners': 'roundOver',
    'roundOver': 'waitingForBets',
    "gameOver": "gameOver"
  };

  public static ACTIONMAP =
    {
      "broke": "broke",
      "bust": "bust",
      "stand": "stand",
      "double": "double",
      "surrender": "surrender"
    };
  
  private gameType:string;
  private betDenominations:number[];
  private deck:Deck
  private players;
  private user:User;
  private house:House;
  private playerNumber:number;
  private gamePhase:string;
  private resultsLog:string[];
  public turnCounter:number;
  constructor(gameType:string, userName:string, betDenominations = [5, 20, 50, 100]) {
    // gameType
    this.gameType = gameType;

    this.betDenominations = betDenominations;

    // deck
    this.deck = new Deck(this.gameType);

    // players
    this.players = [];
    this.players.push(new Ai("ai1", this.gameType));
    this.user = new User(userName, this.gameType);
    this.players.push(this.user);
    this.players.push(new Ai("ai3", this.gameType));
    // house
    this.house = new House('house', this.gameType);
    this.players.push(this.house);

    this.playerNumber = this.players.length;
    this.gamePhase = 'waitingForBets';
    this.resultsLog = [];
    this.turnCounter = 1;
  }

  public evaluateMove(player:User | Ai | House, userData = null):void {
    let gameDecision:GameDecision = player.prompt(userData) as GameDecision;
    player.setAction(gameDecision.getAction());
    player.setBet(gameDecision.getBet(
    ));
  }

  public blackjackEvaluateAndGetRoundResults():string {
    // compaer house and player
    let houseHand = this.house.getHandScore();
    this.turnCounter = 1;
    while (!this.onLastPlayer()) {
      let currPlayer:Ai | User | House = this.getTurnPlayer();
      let playerHand = currPlayer.getHandScore();
      if (!this.canPlayForBlackjack(currPlayer)) {
        this.turnCounter++;
        continue;
      }
      // bust
      if (currPlayer.getAction() === "bust") currPlayer.setWinAmount(-currPlayer.getBet());
      // surrender
      else if (currPlayer.getAction() === "surrender") currPlayer.setWinAmount( -Math.floor(currPlayer.getBet() / 2));
      else {
        // game with house
        if (this.house.getAction() === "bust") {
          currPlayer.setWinAmount(currPlayer.blackjack() ? Math.floor(currPlayer.getBet() * 1.5) : (currPlayer.getAction() === "double") ? currPlayer.getBet() * 2 : currPlayer.getBet()); // playerがwin
        }
        else {
          // house.action != bust
          if (this.house.blackjackAndHasAce()) {
            // house is blackjack　and has "A"   player also has blackjack and "A" as well 　→　draw
            if (!currPlayer.blackjackAndHasAce()) currPlayer.setWinAmount((currPlayer.getAction() === "double") ? -currPlayer.getBet() * 2 : -currPlayer.getBet()); // player lose    
          } else if (this.house.blackjack()) {
            // house is blackjack //player is blackjack →　draw
            if (currPlayer.blackjackAndHasAce()) currPlayer.setWinAmount((currPlayer.getAction() === "double") ? currPlayer.getBet() * 2 : currPlayer.getBet());//player　win 
            else if (!currPlayer.blackjack()) currPlayer.setWinAmount((currPlayer.getAction() === "double") ? -currPlayer.getBet() * 2 : -currPlayer.getBet()); // player lose
          } else {
            // house is not blackjack 
            if (playerHand < houseHand) currPlayer.setWinAmount((currPlayer.getAction() === "double") ? -currPlayer.getBet() * 2 : -currPlayer.getBet()); // player lose
            else if (playerHand > houseHand) currPlayer.setChip((currPlayer.getAction() === "double") ? currPlayer.getBet() * 2 : currPlayer.getBet()); // player win
          }
        }
      }
      currPlayer.setChip(currPlayer.getChip() + currPlayer.getWinAmount());
      if (currPlayer.getChip() <= 0) {
        currPlayer.switchStatus("blackjack");
      }
      this.turnCounter++;
    }

    // round is over 
    let log:string = `round${this.resultsLog.length + 1}: `;
    this.players.forEach(player => {
      if (player != this.house) {
        log += `◇${player.getName()}: action: ${player.getAction()}, bet: ${player.getBet()}, won: ${player.getWinAmount()}`;
      }
    });
    this.resultsLog.push(log);

    return log;
  }

  /*
     NOTE: house has initially one card
  */
  public blackjackAssignPlayerHands(player:House | User | Ai):void {
    if (this.canPlayForBlackjack(player)) {
      if (player == this.house) player.getHand().push(this.deck.drawOne());
      else player.getHand().push(this.deck.drawOne(), this.deck.drawOne());
    }
  }

  public blackjackClearPlayerHandsAndBets():void {
    this.switchGamePhase(Table.GAMEPHASEFORBLACKJACK);
    this.players.forEach(player => {
      player.resetHand();
      player.setBet(0);
      player.switchStatus("blackjack");
      if (this.canPlayForBlackjack(player)) player.setAction("bet");
      if (player === this.house) player.setAction("waiting");
      else player.setWinAmount(0);
    });
    this.deck.resetDeck();
    this.turnCounter = 1;
  }

  public getTurnPlayer():User | Ai | House {
    let index = (this.turnCounter - 1) % this.playerNumber;
    return this.players[index];
  }

  public haveTurn(userData = null) {
    if (this.gameType == "blackjack") {
      if (this.gamePhase == "waitingForBets") {
        let currPlayer:User | Ai|House = this.getTurnPlayer();
        this.blackjackAssignPlayerHands(currPlayer);

        if (this.onLastPlayer()) this.switchGamePhase(Table.GAMEPHASEFORBLACKJACK);
        this.turnCounter++;
      } else if (this.gamePhase == "betting") {
        let currPlayer = this.getTurnPlayer();

        this.evaluateMove(currPlayer, userData);
        if (!this.onLastPlayer()) currPlayer.switchStatus("blackjack");

        if (this.onLastPlayer()) this.switchGamePhase(Table.GAMEPHASEFORBLACKJACK);

        this.turnCounter++;
      } else if (this.gamePhase == "playing") {
        let currPlayer = this.getTurnPlayer();

        if (currPlayer != this.house) {
          if (this.actionsResolved()) this.house.switchStatus("blackjack"); 

          if (this.actionsResolved(currPlayer)) {
            this.turnCounter++; 
          } else {
            this.evaluateMove(currPlayer, userData);
            if (currPlayer.getHand().length == 2 && currPlayer.getAction() === "double") currPlayer.getHand().push(this.deck.drawOne()); 
            if (!this.actionsResolved(currPlayer)) currPlayer.getHand().push(this.deck.drawOne());
            this.turnCounter++;
          }
        } else {
          if (this.actionsResolved(this.house)) {
            this.switchGamePhase(Table.GAMEPHASEFORBLACKJACK);
            this.turnCounter++;
          } else {
            if (this.house.getStatus() === "waiting") this.turnCounter++;
            else {
              this.house.getHand().push(this.deck.drawOne());
              this.evaluateMove(this.house, userData);
            }
          }
        }
      } else if (this.gamePhase == "evaluatingWinners") {
        this.blackjackEvaluateAndGetRoundResults();
        this.switchGamePhase(Table.GAMEPHASEFORBLACKJACK);
      } else {
        //roundOver →　user's accion
        this.blackjackClearPlayerHandsAndBets();
      }
    }
  }
 
  public onLastPlayer() {
    return this.players[this.playerNumber - 1] == this.getTurnPlayer();
  }

  public actionsResolved(player:User | House | Ai | null = null) {
    let hasAction = true;
    if (player === null) {
      for (let i = 0; i < this.playerNumber - 1; i++) {
        if (!(this.players[i].getAction() in Table.ACTIONMAP)) hasAction = false;
      }
    } else {
      if (!(player.getAction() in Table.ACTIONMAP)) hasAction = false;
    }
    return hasAction;
  }

  public userActionsResolved(userData:string) {
    return userData in Table.ACTIONMAP;
  }

  /*　
  blackjack betting → playing → evaluatingWinners → roundOver
  no need to switch status for roundOver to betting 
  */

  public switchGamePhase(gamePhase:{[key:string]:string}) {
    this.gamePhase = gamePhase[this.gamePhase];
    if (this.gamePhase === "roundOver" && this.user.getStatus() === "broke") this.gamePhase = gamePhase["gameOver"];
  }

  /*
  status = broke → false　
  return boolean 
  */
  public canPlayForBlackjack(player:User | Ai | House) {
    return player.getStatus() != "broke";
  }

  // getter
  public getGamePhase():string { 
    return this.gamePhase;
  };

  public getResultsLog():string[] { 
    return this.resultsLog;
  }
}

export default Table;