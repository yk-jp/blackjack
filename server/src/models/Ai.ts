import Player from "./Player";
import GameDecision from "./GameDecision";
/* AI class 
  extension 
    name : player name
    gameType(blackjack)
    hand : player's cards
    void getHandScore() : Number →　return current score
    bet :　how much players bet in each round.
  neccessary variables, functions
    chip(default = 400)　:　current balance
    winAmount : the amount of money when players win the game
    status : current player's status　→ {bet,playing,broke}
    } 
    action : current player's action  →　{bet,stand,hit,double,surrender,broke}
    gameStatus : It starts with betting　{betting,playing, roundOver, gameOver(when user is bust)}
    gameDecision prompt(): return GameDecision class
*/

class AI extends Player {

  constructor(name: string, gameType: string) {
    super(name, gameType);
    this.action = "bet";
    this.type = "ai";
  }

  /* return GameDecision class (action,bet)
     status=bet → return (action("bet"),bet)
     status=playing →　return (action,null)
     satatus = broke →　return (bust)
  */
  public prompt(): GameDecision {
    if (this.status == "bet") {
      let promptBet: number | null = null;
      // 1.bet
      if (this.chip > 400) promptBet = this.judgeByRatio(5) ? 100 : 200;
      else if (150 < this.chip && this.chip <= 400)
        promptBet = this.judgeByRatio(8) ? 50 : 100;
      else
        promptBet = this.judgeByRatio(7)
          ? Math.floor(this.chip / 2)
          : this.chip;
      return new GameDecision("bet", promptBet);
    } else if (this.status === "playing") {
      let promptAction: null | string = null;
      // 2.playingの時
      let numOfHand: number = this.hand.length;
      let handScore: number = this.getHandScore();
      if (handScore < 16) {
        if (0 <= handScore && handScore < 13) promptAction = "hit";
        else if (13 <= handScore)
          promptAction = this.judgeByRatio(9)
            ? "hit"
            : numOfHand !== 2
            ? "hit"
            : "double"; //手札が2枚のみdoubleが可能
      } else if (handScore == 16 || handScore == 17) {
        // 3:4:3 = hit : stand : surrender
        if (this.judgeByRatio(7)) {
          // 1回目7:3 →　hit or stand : surrender
          promptAction = "hit";
          // 2回目 hit or stand
          if (this.judgeByRatio(4)) promptAction = "stand";
        } else {
          if (this.hand.length != 3) promptAction = "stand";
          //カードが3枚の時のみsurrenderが可能
          else promptAction = "surrender";
        }
      } else if (18 <= handScore && handScore <= 20) {
        // 9:1 →　stand : hit
        promptAction = this.judgeByRatio(9) ? "stand" : "hit";
      } else if (handScore == 21) promptAction = "stand";
      else promptAction = "bust";

      return new GameDecision(promptAction as string, this.bet);
    }
    return new GameDecision("broke", 0);
  }

  public switchStatus(gameType: string): void {
    if (gameType == "blackjack") {
      if (this.chip <= 0) this.status = AI.STATUSFORBLACKJACK["broke"];
      else this.status = AI.STATUSFORBLACKJACK[this.status];
    }
  }
}

export default AI;
